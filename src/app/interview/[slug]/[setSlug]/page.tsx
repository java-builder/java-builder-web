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
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { Crown, Sparkles, Gem } from "lucide-react";

const COMPLETED_STORAGE_KEY = "interview_completed_questions";

export default function InterviewSetPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.slug as string;
  const setSlug = params.setSlug as string;
  const { t, locale } = useI18n();

  const { questions, isLoading: isLoadingQuestions } = useInterviewQuestionsByQuestionSetSlug(setSlug);
  const { questionSets, isLoading: isLoadingSets } = useQuestionSets(topicSlug);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD">("ALL");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showOnlyUnlearned, setShowOnlyUnlearned] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${COMPLETED_STORAGE_KEY}_${setSlug}`);
      if (raw) setCompletedIds(new Set(JSON.parse(raw)));
    } catch { }
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
      } catch { }
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
    () => pickQuestionSetTranslation(questionSet?.translations, locale)?.title || questionSet?.slug || "",
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
      if (difficultyFilter !== "ALL" && item.difficulty !== difficultyFilter) return false;
      if (showOnlyUnlearned && completedIds.has(item.id)) return false;
      if (q && !item.displayQuestion.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [questionsView, searchText, difficultyFilter, showOnlyUnlearned, completedIds]);

  useEffect(() => {
    if (questionsView.length > 0 && !selectedId) {
      setSelectedId(questionsView[0].id);
    }
  }, [questionsView, selectedId]);

  const selectedQuestion = useMemo(
    () => questionsView.find((q) => q.id === selectedId) || questionsView[0] || null,
    [questionsView, selectedId]
  );

  const selectedIndex = useMemo(
    () => (selectedQuestion ? questionsView.findIndex((q) => q.id === selectedQuestion.id) : -1),
    [questionsView, selectedQuestion]
  );

  // Keyboard navigation (desktop only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (questionsView.length === 0) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (selectedIndex + 1) % questionsView.length;
        setSelectedId(questionsView[next].id);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (selectedIndex - 1 + questionsView.length) % questionsView.length;
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
      EASY: { color: "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10", label: t("exercisesPage.filterEasy") },
      MEDIUM: { color: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10", label: t("exercisesPage.filterMedium") },
      HARD: { color: "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10", label: t("exercisesPage.filterHard") },
    };
    const cfg = map[difficulty] || { color: "text-gray-600 bg-gray-100", label: difficulty };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${cfg.color}`}>
        {cfg.label}
      </span>
    );
  };

  const premiumBadge = (isPremium?: boolean, isAccess?: boolean) => {
    if (!isPremium) return null;
    if (isAccess === false) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t("interviewPage.lockedBadge") || "Locked"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
        <svg className="w-2.5 h-2.5 flex-shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        {t("interviewPage.premiumBadge") || "Premium"}
      </span>
    );
  };

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedId(questionsView[selectedIndex - 1].id);
  };
  const handleNext = () => {
    if (selectedIndex < questionsView.length - 1) setSelectedId(questionsView[selectedIndex + 1].id);
  };

  // Sidebar list content (shared giữa desktop + mobile drawer)
  const renderSidebarContent = (onSelectExtra?: () => void) => (
    <div className="flex flex-col h-full">
      {/* Search + filter */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700 space-y-2">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t("interviewPage.searchPlaceholder") || "Tìm câu hỏi..."}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${difficultyFilter === d
                ? "bg-accent text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
            >
              {d === "ALL" ? "Tất cả" : d === "EASY" ? "Dễ" : d === "MEDIUM" ? "TB" : "Khó"}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyUnlearned}
            onChange={(e) => setShowOnlyUnlearned(e.target.checked)}
            className="w-3.5 h-3.5 accent-accent rounded"
          />
          Chỉ hiện chưa học
        </label>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Không tìm thấy câu hỏi
          </div>
        ) : (
          <ul className="py-2">
            {filteredQuestions.map((q) => {
              const isActive = selectedQuestion?.id === q.id;
              const isDone = completedIds.has(q.id);
              const realIndex = questionsView.findIndex((x) => x.id === q.id);
              return (
                <li key={q.id}>
                  <button
                    onClick={() => {
                      setSelectedId(q.id);
                      onSelectExtra?.();
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-l-2 ${isActive
                      ? "bg-accent/5 dark:bg-accent/10 border-accent"
                      : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompleted(q.id);
                        }}
                        className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isDone
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 dark:border-slate-600 hover:border-accent"
                          }`}
                        title={isDone ? "Đã học" : "Đánh dấu đã học"}
                      >
                        {isDone && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <span className={`flex-shrink-0 text-xs font-mono mt-0.5 ${isActive ? "text-accent font-bold" : "text-gray-400 dark:text-gray-500"
                        }`}>
                        {String(realIndex + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className={`line-clamp-2 leading-snug ${isActive
                          ? "text-gray-900 dark:text-white font-medium"
                          : isDone
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-200"
                          }`}>
                          {q.displayQuestion}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          {difficultyBadge(q.difficulty)}
                          {premiumBadge(q.isPremium, q.isAccess)}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Keyboard hints (desktop only) */}
      <div className="hidden lg:block p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
        <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Câu trước</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-[10px] font-mono">K</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Câu sau</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-[10px] font-mono">J</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Đánh dấu học</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-[10px] font-mono">Space</kbd>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {t("interviewPage.noQuestionSetTitle")}
          </h1>
          <button onClick={() => router.back()} className="text-accent hover:underline text-sm font-medium">
            {t("interviewPage.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                title={t("interviewPage.back")}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {setTitle}
                </h1>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>
                    {selectedIndex >= 0 ? `Câu ${selectedIndex + 1}/${questionsView.length}` : `${questionsView.length} câu`}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {completedCount} đã học
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop: progress bar */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <div className="w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-600 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-accent w-9 text-right">{progressPct}%</span>
            </div>

            <Link
              href={`/interview/contribute?questionSetId=${questionSet.id}&questionSetTitle=${encodeURIComponent(setTitle)}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 dark:border-slate-600 hover:border-accent hover:text-accent rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("interviewPage.addQuestion")}
            </Link>

            <div className="hidden sm:block">
              <LanguageSwitcher variant="minimal" />
            </div>

            {/* Mobile: open list drawer */}
            <button
              onClick={() => setIsMobileListOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              {questionsView.length}
            </button>
          </div>

          {/* Mobile progress */}
          <div className="md:hidden mt-2 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-col">
            {renderSidebarContent()}
          </aside>

          {/* Main reading area */}
          <main className="min-w-0 bg-white dark:bg-slate-800 lg:bg-gray-50 lg:dark:bg-slate-900 pb-20 lg:pb-0">
            {selectedQuestion ? (
              <article className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-10">
                <header className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                    <span>#{String(selectedIndex + 1).padStart(2, "0")}</span>
                    <span>·</span>
                    <span>{selectedIndex + 1} / {questionsView.length}</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                    {selectedQuestion.displayQuestion}
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {difficultyBadge(selectedQuestion.difficulty)}
                    {selectedQuestion.isPremium && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${selectedQuestion.isAccess === false
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                        }`}>
                        {selectedQuestion.isAccess === false ? "🔒 " + (t("interviewPage.lockedBadge") || "Locked") : "✨ " + (t("interviewPage.premiumBadge") || "Premium")}
                      </span>
                    )}
                    <button
                      onClick={() => toggleCompleted(selectedQuestion.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all ${completedIds.has(selectedQuestion.id)
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                        }`}
                    >
                      {completedIds.has(selectedQuestion.id) ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Đã học
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Đánh dấu đã học
                        </>
                      )}
                    </button>
                  </div>
                </header>

                {selectedQuestion.isPremium && selectedQuestion.isAccess === false ? (
                  <div className="my-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/80 sm:p-14">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Crown className="h-7 w-7" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      {t("interviewPage.premiumRequiredTitle") || "Nội dung dành cho tài khoản Premium 🔒"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
                      {t("interviewPage.premiumRequiredDesc") || "Vui lòng nâng cấp tài khoản để xem câu trả lời mẫu và mẹo phỏng vấn."}
                    </p>

                    <Link
                      href="/pricing"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{t("interviewPage.upgradeNowBtn") || "Nâng cấp ngay"}</span>
                    </Link>
                  </div>
                ) : (
                  <>
                    <section className="mb-8">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-1 h-5 sm:h-6 bg-accent rounded-full" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("interviewPage.sampleAnswer")}
                        </h3>
                      </div>
                      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-headings:scroll-mt-20">
                        <PublicMarkdownRenderer content={selectedQuestion.displayAnswer} />
                      </div>
                    </section>

                    {selectedQuestion.displayTips && (
                      <section className="mb-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <div className="w-1 h-5 sm:h-6 bg-amber-500 rounded-full" />
                          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("interviewPage.goodTips")}
                          </h3>
                        </div>
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-4 sm:p-5">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <PublicMarkdownRenderer content={selectedQuestion.displayTips} />
                          </div>
                        </div>
                      </section>
                    )}
                  </>
                )}

                {/* Desktop nav */}
                <nav className="hidden lg:flex mt-12 pt-6 border-t border-gray-200 dark:border-slate-700 items-center justify-between gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={selectedIndex <= 0}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Câu trước
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={selectedIndex >= questionsView.length - 1}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Câu tiếp theo
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </article>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh] px-6">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {t("interviewPage.noQuestions")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("interviewPage.emptySetDesc")}
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      {selectedQuestion && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-3 py-2 grid grid-cols-3 gap-2 shadow-lg">
          <button
            onClick={handlePrev}
            disabled={selectedIndex <= 0}
            className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-md border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trước
          </button>

          <button
            onClick={() => setIsMobileListOpen(true)}
            className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Danh sách
          </button>

          <button
            onClick={handleNext}
            disabled={selectedIndex >= questionsView.length - 1}
            className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold rounded-md bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${isMobileListOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileListOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-800 shadow-xl transform transition-transform ${isMobileListOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Danh sách câu hỏi
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {completedCount}/{questionsView.length} đã học · {progressPct}%
              </p>
            </div>
            <button
              onClick={() => setIsMobileListOpen(false)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-[calc(100%-60px)]">
            {renderSidebarContent(() => setIsMobileListOpen(false))}
          </div>
        </div>
      </div>
    </div>
  );
}
