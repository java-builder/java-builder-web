"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useInterviewQuestionsByQuestionSetSlug } from "@/hooks/useInterviewQuestions";
import { useQuestionSets } from "@/hooks/useQuestionSets";
import {
  pickInterviewQuestionTranslation,
  pickQuestionSetTranslation,
} from "@/types/interview";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Crown,
  Gem,
  HelpCircle,
  Lightbulb,
  ListFilter,
  Lock,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const COMPLETED_STORAGE_KEY = "interview_completed_questions";

function cleanAnswerMarkdown(raw: string, questionTitle: string): string {
  if (!raw) return "";
  let cleaned = raw.trim();

  // 1. Strip leading H1 (# ...) that duplicates the question title
  cleaned = cleaned.replace(/^\s*#\s+[^\n]+\n*/, "").trim();

  // 2. Strip leading "### Câu hỏi / Question" section that repeats the question
  cleaned = cleaned
    .replace(
      /^\s*#{1,4}\s*(?:Câu hỏi|Question)\s*\n+([^\n]+\n+){1,2}/i,
      ""
    )
    .trim();

  // 3. If the first line still literally repeats questionTitle, strip it
  if (
    questionTitle &&
    cleaned.toLowerCase().startsWith(questionTitle.trim().toLowerCase())
  ) {
    cleaned = cleaned.slice(questionTitle.trim().length).trim();
  }

  // 4. Strip redundant leading "### Trả lời / Answer" heading if it's at the very top
  cleaned = cleaned
    .replace(/^\s*#{1,4}\s*(?:Trả lời|Câu trả lời|Answer)\s*\n+/i, "")
    .trim();

  return cleaned;
}

export default function InterviewSetPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.slug as string;
  const setSlug = params.setSlug as string;
  const { t, locale } = useI18n();

  const { questions, isLoading: isLoadingQuestions } =
    useInterviewQuestionsByQuestionSetSlug(setSlug);
  const { questionSets, isLoading: isLoadingSets } = useQuestionSets(topicSlug);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<
    "ALL" | "EASY" | "MEDIUM" | "HARD" | "UNLEARNED"
  >("ALL");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${COMPLETED_STORAGE_KEY}_${setSlug}`);
      if (raw) setCompletedIds(new Set(JSON.parse(raw)));
    } catch {}
  }, [setSlug]);

  useEffect(() => {
    if (isMobileListOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileListOpen]);

  const persistCompleted = useCallback(
    (next: Set<string>) => {
      try {
        localStorage.setItem(
          `${COMPLETED_STORAGE_KEY}_${setSlug}`,
          JSON.stringify(Array.from(next))
        );
      } catch {}
    },
    [setSlug]
  );

  const toggleCompleted = useCallback(
    (id: string) => {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persistCompleted(next);
        return next;
      });
    },
    [persistCompleted]
  );

  const questionSet = useMemo(
    () => questionSets.find((s) => s.slug === setSlug) || null,
    [questionSets, setSlug]
  );

  const setTitle = useMemo(
    () =>
      pickQuestionSetTranslation(questionSet?.translations, locale)?.title ||
      questionSet?.slug ||
      "",
    [questionSet, locale]
  );

  const questionsView = useMemo(
    () =>
      questions.map((q) => {
        const tr = pickInterviewQuestionTranslation(q.translations, locale);
        return {
          ...q,
          displayQuestion: tr?.question || q.slug,
          displayAnswer: tr?.answer || "",
          displayTips: tr?.tips || "",
        };
      }),
    [questions, locale]
  );

  const filteredQuestions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return questionsView.filter((item) => {
      if (filterMode === "UNLEARNED" && completedIds.has(item.id)) return false;
      if (
        (filterMode === "EASY" ||
          filterMode === "MEDIUM" ||
          filterMode === "HARD") &&
        item.difficulty !== filterMode
      )
        return false;
      if (q && !item.displayQuestion.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [questionsView, searchText, filterMode, completedIds]);

  useEffect(() => {
    if (questionsView.length > 0 && !selectedId) {
      setSelectedId(questionsView[0].id);
    }
  }, [questionsView, selectedId]);

  const selectedQuestion = useMemo(
    () =>
      questionsView.find((q) => q.id === selectedId) ||
      questionsView[0] ||
      null,
    [questionsView, selectedId]
  );

  const selectedIndex = useMemo(
    () =>
      selectedQuestion
        ? questionsView.findIndex((q) => q.id === selectedQuestion.id)
        : -1,
    [questionsView, selectedQuestion]
  );

  const prevQuestion =
    selectedIndex > 0 ? questionsView[selectedIndex - 1] : null;
  const nextQuestion =
    selectedIndex >= 0 && selectedIndex < questionsView.length - 1
      ? questionsView[selectedIndex + 1]
      : null;

  const cleanedAnswer = useMemo(
    () =>
      selectedQuestion
        ? cleanAnswerMarkdown(
            selectedQuestion.displayAnswer,
            selectedQuestion.displayQuestion
          )
        : "",
    [selectedQuestion]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (questionsView.length === 0) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (selectedIndex + 1) % questionsView.length;
        setSelectedId(questionsView[next].id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          (selectedIndex - 1 + questionsView.length) % questionsView.length;
        setSelectedId(questionsView[prev].id);
      } else if (e.key === " " && selectedQuestion) {
        e.preventDefault();
        toggleCompleted(selectedQuestion.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, questionsView, selectedQuestion, toggleCompleted]);

  const completedCount = useMemo(
    () => questionsView.filter((q) => completedIds.has(q.id)).length,
    [questionsView, completedIds]
  );
  const progressPct = questionsView.length
    ? Math.round((completedCount / questionsView.length) * 100)
    : 0;

  const isLoading = isLoadingQuestions || isLoadingSets;

  const difficultyBadge = (difficulty: string) => {
    const map: Record<string, { color: string; label: string }> = {
      EASY: {
        color: "text-success bg-success/10 border-success/25",
        label: t("exercisesPage.filterEasy"),
      },
      MEDIUM: {
        color: "text-warning bg-warning/10 border-warning/25",
        label: t("exercisesPage.filterMedium"),
      },
      HARD: {
        color: "text-error bg-error/10 border-error/25",
        label: t("exercisesPage.filterHard"),
      },
    };
    const cfg = map[difficulty] || {
      color: "text-text-muted bg-muted border-border",
      label: difficulty,
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${cfg.color}`}
      >
        {cfg.label}
      </span>
    );
  };

  const premiumBadge = (isPremium?: boolean, isAccess?: boolean) => {
    if (!isPremium) return null;
    if (isAccess === false) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-error/10 text-error border border-error/20">
          <Lock className="w-2.5 h-2.5 shrink-0" />
          <span>{t("interviewPage.lockedBadge") || "Locked"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-warning/10 text-warning border border-warning/25">
        <Gem className="w-2.5 h-2.5 shrink-0" />
        <span>{t("interviewPage.premiumBadge") || "Premium"}</span>
      </span>
    );
  };

  const handlePrev = () => {
    if (prevQuestion) setSelectedId(prevQuestion.id);
  };
  const handleNext = () => {
    if (nextQuestion) setSelectedId(nextQuestion.id);
  };

  const renderSidebarContent = (onSelectExtra?: () => void) => (
    <div className="flex flex-col h-full bg-surface">
      {/* Top Search & Compact Filter Pills */}
      <div className="p-3.5 border-b border-border space-y-2.5 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-background border border-border text-xs font-medium text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Single Clean Pill Filter Row */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {(
            [
              { id: "ALL", label: "Tất cả" },
              { id: "EASY", label: "Dễ" },
              { id: "MEDIUM", label: "TB" },
              { id: "HARD", label: "Khó" },
              { id: "UNLEARNED", label: "Chưa học" },
            ] as const
          ).map((tab) => {
            const active = filterMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterMode(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-2.5 scrollbar-thin">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Không tìm thấy câu hỏi phù hợp
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredQuestions.map((q) => {
              const isActive = selectedQuestion?.id === q.id;
              const isDone = completedIds.has(q.id);
              const realIndex = questionsView.findIndex((x) => x.id === q.id);

              return (
                <li key={q.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedId(q.id);
                      onSelectExtra?.();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(q.id);
                        onSelectExtra?.();
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-start gap-2.5 cursor-pointer group ${
                      isActive
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-foreground/80 hover:bg-muted/70 hover:text-foreground font-medium"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleted(q.id);
                      }}
                      className="mt-0.5 shrink-0 cursor-pointer"
                      title={isDone ? "Đã học" : "Đánh dấu đã học"}
                    >
                      {isDone ? (
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isActive ? "text-primary" : "text-success"
                          }`}
                        />
                      ) : (
                        <Circle
                          className={`w-3.5 h-3.5 ${
                            isActive
                              ? "text-primary fill-primary/20"
                              : "text-text-muted/50 group-hover:text-primary"
                          }`}
                        />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="leading-snug break-words">
                        {realIndex + 1}. {q.displayQuestion}
                      </p>
                      {q.isPremium && (
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          {premiumBadge(q.isPremium, q.isAccess)}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center px-4">
        <div className="text-center p-8 rounded-2xl border border-border bg-surface max-w-md w-full">
          <h1 className="text-lg font-bold text-foreground mb-3">
            {t("interviewPage.noQuestionSetTitle")}
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("interviewPage.back")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
      {/* Sticky Top Title & Actions Bar — follows scroll together with the Question List */}
      <div className="sticky top-14 lg:top-16 z-20 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={`/interview/${topicSlug}`}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("interviewPage.back")}</span>
              </Link>
            </Button>

            <h1
              className="text-sm sm:text-base md:text-lg font-bold text-foreground truncate"
              title={setTitle}
            >
              {setTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {questionsView.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-background border border-border text-xs font-medium text-text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <span className="tabular-nums font-semibold text-foreground">
                  {completedCount}/{questionsView.length}
                </span>
                <span className="text-[11px] text-text-muted">
                  ({progressPct}%)
                </span>
              </div>
            )}

            <Button asChild size="sm">
              <Link
                href={`/interview/contribute?questionSetId=${questionSet.id}&questionSetTitle=${encodeURIComponent(setTitle)}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("interviewPage.addQuestion")}</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileListOpen(true)}
              className="lg:hidden"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>
                {completedCount}/{questionsView.length}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 py-5">
        {/* 2-Column Card Workspace */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Left Column: Question List Card */}
          <aside className="hidden lg:flex lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-[8.25rem] lg:max-h-[calc(100vh-9.5rem)] rounded-2xl border border-border bg-surface overflow-hidden flex-col shadow-2xs">
            {renderSidebarContent()}
          </aside>

          {/* Right Column: Question & Answer Card */}
          <main className="flex-1 w-full min-w-0">
            {selectedQuestion ? (
              <article className="bg-surface rounded-2xl border border-border p-4 sm:p-6 md:p-8 shadow-2xs">
                {/* Question Header */}
                <header className="mb-6 pb-5 border-b border-border">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-3.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-soft text-primary">
                        Câu {selectedIndex + 1}/{questionsView.length}
                      </span>
                      {difficultyBadge(selectedQuestion.difficulty)}
                      {premiumBadge(
                        selectedQuestion.isPremium,
                        selectedQuestion.isAccess
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCompleted(selectedQuestion.id)}
                      className={`inline-flex items-center gap-1.5 h-8 px-3.5 text-xs font-semibold rounded-full border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                        completedIds.has(selectedQuestion.id)
                          ? "bg-success-soft text-success border-success/30 hover:bg-success/15 focus-visible:ring-success/30"
                          : "bg-surface text-text-muted hover:text-foreground hover:bg-muted/60 border-border focus-visible:ring-primary/20"
                      }`}
                    >
                      {completedIds.has(selectedQuestion.id) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      )}
                      <span>
                        {completedIds.has(selectedQuestion.id)
                          ? "Đã học"
                          : "Đánh dấu đã học"}
                      </span>
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                    {selectedQuestion.displayQuestion}
                  </h2>
                </header>

                {/* Question Answer / Locked State */}
                {selectedQuestion.isPremium &&
                selectedQuestion.isAccess === false ? (
                  <div className="my-6 rounded-2xl border border-border bg-background/60 p-8 sm:p-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Crown className="h-7 w-7" />
                    </div>

                    <h3 className="mt-4 text-base sm:text-lg font-bold text-foreground">
                      {t("interviewPage.premiumRequiredTitle") ||
                        "Nội dung dành cho tài khoản Premium"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                      {t("interviewPage.premiumRequiredDesc") ||
                        "Vui lòng nâng cấp tài khoản để xem câu trả lời mẫu và mẹo phỏng vấn chuyên sâu."}
                    </p>

                    <Link
                      href="/pricing"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-primary-hover shadow-xs"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>
                        {t("interviewPage.upgradeNowBtn") || "Nâng cấp ngay"}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <PublicMarkdownRenderer
                      content={cleanedAnswer}
                      className="prose prose-slate dark:prose-invert max-w-none"
                    />

                    {selectedQuestion.displayTips && (
                      <section className="rounded-2xl border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Lightbulb className="w-4.5 h-4.5 text-warning shrink-0" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-warning">
                            {t("interviewPage.goodTips")}
                          </h3>
                        </div>
                        <PublicMarkdownRenderer
                          content={selectedQuestion.displayTips}
                          className="prose prose-sm dark:prose-invert max-w-none"
                        />
                      </section>
                    )}
                  </div>
                )}

                {/* Prev / Next Question Navigation Buttons */}
                <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrev}
                    disabled={!prevQuestion}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!nextQuestion}
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </article>
            ) : (
              <div className="bg-surface rounded-2xl border border-border p-12 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-background border border-border flex items-center justify-center text-text-muted">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">
                  {t("interviewPage.noQuestions")}
                </h3>
                <p className="text-sm text-text-muted">
                  {t("interviewPage.emptySetDesc")}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Question List Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity ${
          isMobileListOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsMobileListOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-surface border-l border-border shadow-2xl transform transition-transform ${
            isMobileListOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Danh sách câu hỏi
              </h3>
              <p className="text-[11px] text-text-muted">
                Đã học {completedCount}/{questionsView.length} ({progressPct}%)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileListOpen(false)}
              className="p-1.5 text-text-muted hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[calc(100%-57px)]">
            {renderSidebarContent(() => setIsMobileListOpen(false))}
          </div>
        </div>
      </div>
    </div>
  );
}
