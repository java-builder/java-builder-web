"use client";

import { useState } from "react";
import {
  CheckCircle2,
  MinusCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { QuestionResultResponse } from "@/types/exercise-submission";
import ExplainQuestionModal from "./ExplainQuestionModal";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface QuestionItemProps {
  questionResult: QuestionResultResponse;
  questionNumber: number;
}

export default function QuestionItem({
  questionResult,
  questionNumber,
}: QuestionItemProps) {
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const isCorrect = questionResult.isCorrect;
  const userSelectedIds = questionResult.userSelectedOptionIds || [];
  const hasAnswer = userSelectedIds.length > 0;

  const numberBadge = isCorrect
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800"
    : hasAnswer
    ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800"
    : "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800";

  const StatusIcon = isCorrect ? CheckCircle2 : hasAnswer ? XCircle : MinusCircle;
  const statusLabel = isCorrect ? "Đúng" : hasAnswer ? "Sai" : "Bỏ qua";

  return (
    <div id={`question-${questionResult.questionId}`} className="scroll-mt-6">
      {/* Header */}
      <div className="px-4 pt-4 sm:px-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex flex-shrink-0 items-center pt-0.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums ring-1 ${numberBadge}`}
            >
              <StatusIcon className="h-3 w-3" />
              <span className="font-mono opacity-70">
                {String(questionNumber).padStart(2, "0")}
              </span>
              <span className="h-2.5 w-px bg-current opacity-30" />
              <span className="uppercase tracking-wide">{statusLabel}</span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-white">
                <PublicMarkdownRenderer
                  content={questionResult.content}
                  className="prose-sm sm:prose max-w-none text-gray-900 dark:text-white [&>p]:my-1"
                />
              </div>

              <span className="flex-shrink-0 rounded-md border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {questionResult.score} điểm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body — always visible */}
      <div className="px-4 pb-4 pt-3 sm:px-5">
        <div className="space-y-2">
          {questionResult.options
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((option, optionIndex) => (
              <OptionRow
                key={option.id}
                optionIndex={optionIndex}
                content={option.content}
                isCorrectOption={option.isCorrect}
                isUserSelected={userSelectedIds.includes(option.id)}
              />
            ))}
        </div>

        {!hasAnswer && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-400">
            <MinusCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>Bạn chưa trả lời câu hỏi này.</span>
          </div>
        )}

        {!isCorrect && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsExplainOpen(true)}
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-600 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative flex h-4 w-4 items-center justify-center">
                <Sparkles className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </span>
              <span className="relative">Giải thích với AI</span>
            </button>
          </div>
        )}
      </div>

      <ExplainQuestionModal
        isOpen={isExplainOpen}
        questionResult={questionResult}
        onClose={() => setIsExplainOpen(false)}
      />
    </div>
  );
}

interface OptionRowProps {
  optionIndex: number;
  content: string;
  isCorrectOption: boolean;
  isUserSelected: boolean;
}

function OptionRow({
  optionIndex,
  content,
  isCorrectOption,
  isUserSelected,
}: OptionRowProps) {
  const optionLetter = String.fromCharCode(65 + optionIndex);

  let containerClass =
    "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800";
  let letterClass = "text-gray-400 dark:text-gray-500";
  let textClass = "text-gray-700 dark:text-gray-300";
  let badge: { label: string; className: string; correct: boolean } | null = null;

  if (isCorrectOption) {
    containerClass =
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-900/10";
    letterClass = "text-emerald-700 dark:text-emerald-400";
    textClass = "text-gray-900 dark:text-white font-medium";
    badge = {
      label: isUserSelected ? "Bạn chọn (đúng)" : "Đáp án đúng",
      correct: true,
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  } else if (isUserSelected) {
    containerClass =
      "border-rose-200 bg-rose-50/60 dark:border-rose-800 dark:bg-rose-900/10";
    letterClass = "text-rose-700 dark:text-rose-400";
    textClass = "text-gray-900 dark:text-white";
    badge = {
      label: "Bạn đã chọn",
      correct: false,
      className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    };
  }

  return (
    <div
      className={`flex flex-wrap items-start gap-x-3 gap-y-2 rounded-lg border p-3 sm:flex-nowrap sm:items-center ${containerClass}`}
    >
      <span
        className={`font-mono text-xs font-semibold tracking-wide ${letterClass}`}
      >
        {optionLetter}.
      </span>
      <div className={`min-w-0 flex-1 text-sm leading-relaxed ${textClass}`}>
        <PublicMarkdownRenderer
          content={content}
          className="prose-sm sm:prose max-w-none [&>p]:mb-0 [&>p]:inline"
        />
      </div>
      {badge && (
        <span
          className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
        >
          {badge.correct ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {badge.label}
        </span>
      )}
    </div>
  );
}
