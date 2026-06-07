"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Heart,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import type { ScoreTone } from "./helpers";
import type { QuestionCounts, QuestionFilter } from "./types";
import type { QuizAnalysisResponse } from "@/types/chatbot";

type Status = "idle" | "loading" | "done" | "error";

interface QuizAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: Status;
  analysis: QuizAnalysisResponse | null;
  errorMessage: string | null;
  scorePercentage: number;
  counts: QuestionCounts;
  tone: ScoreTone;
  onRunAnalysis: () => void;
  onJumpToFilter: (filter: QuestionFilter) => void;
}

export default function QuizAnalysisModal({
  isOpen,
  onClose,
  status,
  analysis,
  errorMessage,
  scorePercentage,
  counts,
  tone,
  onRunAnalysis,
  onJumpToFilter,
}: QuizAnalysisModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const handleJumpToFilter = (filter: QuestionFilter) => {
    onJumpToFilter(filter);
    onClose();
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quiz-analysis-modal"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-analysis-modal-title"
            className="relative my-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:my-8"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 sm:h-12 sm:w-12">
                    <Sparkles className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="quiz-analysis-modal-title"
                        className="text-base font-bold text-gray-900 dark:text-white sm:text-lg"
                      >
                        AI Coach — Phân tích bài làm
                      </h2>
                      {status === "done" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Hoàn tất
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                      Đánh giá điểm mạnh, điểm yếu và lộ trình ôn tập dựa trên kết quả bài làm
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Đóng"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Score summary bar */}
              {status === "done" && analysis && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 bg-gray-50/60 px-5 py-2.5 sm:px-6 dark:border-slate-700/50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Điểm:{" "}
                      <span className={`font-bold ${tone.text}`}>
                        {scorePercentage}%
                      </span>
                    </span>
                  </div>
                  <div className="h-3 w-px bg-gray-300 dark:bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Đúng:{" "}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {counts.correct}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Sai:{" "}
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        {counts.incorrect}
                      </span>
                    </span>
                  </div>
                  {counts.skipped > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 text-center text-[10px] font-bold text-amber-500">
                        —
                      </span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Bỏ qua:{" "}
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {counts.skipped}
                        </span>
                      </span>
                    </div>
                  )}
                  <span
                    className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone.chip}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${tone.bgFromRing}`} />
                    {tone.label}
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              {status === "loading" && <LoadingState />}
              {status === "error" && (
                <ErrorState message={errorMessage} onRetry={onRunAnalysis} />
              )}
              {status === "idle" && analysis === null && (
                <IdleState onRun={onRunAnalysis} />
              )}
              {status === "done" && analysis && (
                <DoneContent
                  analysis={analysis}
                  counts={counts}
                  onJumpToFilter={handleJumpToFilter}
                />
              )}
            </div>

            {/* Footer */}
            {status === "done" && (
              <div className="sticky bottom-0 border-t border-gray-200 bg-white px-5 py-3 sm:px-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-end">
                  <button
                    onClick={onClose}
                    className="ml-auto w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function IdleState({ onRun }: { onRun: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent/10" />
        <span className="absolute inset-2 rounded-full bg-accent/15" />
        <Sparkles className="relative h-7 w-7 text-accent" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        Bắt đầu phân tích chuyên sâu
      </h4>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        AI sẽ phân tích từng câu trả lời, đánh giá điểm mạnh — điểm yếu, và xây dựng lộ trình ôn tập riêng cho bạn.
      </p>
      <button
        type="button"
        onClick={onRun}
        className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/10 transition hover:shadow-lg hover:brightness-110"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <Sparkles className="relative h-4 w-4" />
        <span className="relative">Phân tích ngay</span>
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/20 opacity-75" />
        <span className="absolute inset-0 rounded-full bg-accent/10" />
        <Sparkles className="relative h-7 w-7 animate-pulse text-accent" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        AI đang phân tích bài làm...
      </h4>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Đang đối chiếu kết quả từng câu hỏi để đưa ra nhận xét chi tiết.
      </p>
      <div className="mt-6 w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
          <div className="h-full w-3/5 animate-pulse rounded-full bg-gradient-to-r from-accent to-accent-600" />
        </div>
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
          Thường mất vài giây...
        </p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
        <AlertTriangle className="h-7 w-7 text-rose-500 dark:text-rose-400" />
      </div>
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        Không thể phân tích
      </h4>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {message || "Đã xảy ra lỗi khi gọi AI. Vui lòng thử lại sau."}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        <RotateCcw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  );
}

/* ─── Done Content ────────────────────────────────────────────────────────── */

interface DoneContentProps {
  analysis: QuizAnalysisResponse;
  counts: QuestionCounts;
  onJumpToFilter: (filter: QuestionFilter) => void;
}

function DoneContent({ analysis, counts, onJumpToFilter }: DoneContentProps) {
  const needsImprovement = counts.incorrect + counts.skipped > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Overall Feedback */}
      <SectionCard
        icon={<Lightbulb className="h-4 w-4" />}
        iconBg="bg-accent/10"
        iconColor="text-accent"
        title="Nhận xét tổng thể"
      >
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {analysis.overallFeedback}
        </p>
      </SectionCard>

      {/* Strong / Weak Points */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Strong points */}
        <SectionCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
          title="Điểm mạnh"
          badge={
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {analysis.strongPoints.length}
            </span>
          }
        >
          {analysis.strongPoints.length === 0 ? (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              Chưa phát hiện điểm mạnh nổi bật.
            </p>
          ) : (
            <ul className="space-y-2">
              {analysis.strongPoints.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Weak points */}
        <SectionCard
          icon={<XCircle className="h-4 w-4" />}
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          iconColor="text-rose-600 dark:text-rose-400"
          title="Điểm cần cải thiện"
          badge={
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
              {analysis.weakPoints.length}
            </span>
          }
        >
          {analysis.weakPoints.length === 0 ? (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              Tuyệt vời! Không phát hiện điểm yếu đáng kể.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {analysis.weakPoints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              {needsImprovement && (
                <button
                  type="button"
                  onClick={() => onJumpToFilter("incorrect")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition hover:underline"
                >
                  Xem các câu chưa đạt
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </>
          )}
        </SectionCard>
      </div>

      {/* Study Suggestions */}
      {analysis.studySuggestions.length > 0 && (
        <SectionCard
          icon={<BookOpen className="h-4 w-4" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          title="Lộ trình ôn tập đề xuất"
          badge={
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {analysis.studySuggestions.length} bước
            </span>
          }
        >
          <ol className="space-y-3">
            {analysis.studySuggestions.map((s, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {idx + 1}
                </span>
                <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Practice Exercises */}
      {analysis.practiceExercises.length > 0 && (
        <SectionCard
          icon={<Dumbbell className="h-4 w-4" />}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          title="Bài tập thực hành"
          badge={
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {analysis.practiceExercises.length} bài
            </span>
          }
        >
          <div className="space-y-2.5">
            {analysis.practiceExercises.map((ex, idx) => (
              <PracticeItem key={idx} index={idx + 1} exercise={ex} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Encouragement */}
      {analysis.encouragement && (
        <div className="rounded-xl bg-gradient-to-br from-accent/5 via-accent/3 to-transparent p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Lời động viên từ AI Coach
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                &ldquo;{analysis.encouragement}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Shared Section Card ─────────────────────────────────────────────────── */

function SectionCard({
  icon,
  iconBg,
  iconColor,
  title,
  badge,
  children,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 sm:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </span>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          {title}
        </h4>
        {badge}
      </div>
      {children}
    </div>
  );
}

/* ─── Practice Item ───────────────────────────────────────────────────────── */

function PracticeItem({
  index,
  exercise,
}: {
  index: number;
  exercise: QuizAnalysisResponse["practiceExercises"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50 dark:border-slate-700 dark:bg-slate-900/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-100/60 dark:hover:bg-slate-900/40"
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {exercise.topic}
          </p>
          {!open && (
            <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
              {exercise.exercise}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 text-gray-400">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800/60">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Target className="h-3 w-3" />
              Đề bài
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {exercise.exercise}
            </p>
          </div>
          {exercise.hint && (
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 px-3.5 py-2.5 dark:border-amber-900/40 dark:bg-amber-900/10">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-3 w-3" />
                Gợi ý
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {exercise.hint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
