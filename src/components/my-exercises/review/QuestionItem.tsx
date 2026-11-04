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

  const statusBadge = isCorrect
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    : hasAnswer
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";

  const StatusIcon = isCorrect ? CheckCircle2 : hasAnswer ? XCircle : MinusCircle;
  const statusLabel = isCorrect ? "Đúng" : hasAnswer ? "Sai" : "Bỏ qua";

  return (
    <div
      id={`question-${questionResult.questionId}`}
      className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs transition-colors"
    >
      {/* Card Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-primary-soft border border-primary/15 px-2.5 py-1 text-xs font-extrabold text-primary">
            Câu {questionNumber}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadge}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{statusLabel}</span>
          </span>

          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-muted-foreground tabular-nums">
            {questionResult.score} điểm
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExplainOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft hover:bg-primary hover:text-primary-foreground px-3.5 py-1 text-xs font-semibold text-primary transition cursor-pointer active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Giải thích với AI</span>
        </button>
      </div>

      {/* Question Content */}
      <div className="mt-4 font-semibold text-foreground">
        <PublicMarkdownRenderer
          content={questionResult.content}
          className="prose-sm sm:prose max-w-none text-foreground [&>p]:my-1.5"
        />
      </div>

      {/* Options */}
      <div className="mt-4 space-y-2.5">
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
        <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <MinusCircle className="h-4 w-4 shrink-0" />
          <span>Bạn đã bỏ qua câu hỏi này.</span>
        </div>
      )}

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

  let containerClass = "border-border bg-background/50";
  let letterBadgeClass =
    "border-border bg-surface text-muted-foreground";
  let textClass = "text-foreground/85";
  let badge: { label: string; className: string; correct: boolean } | null = null;

  if (isCorrectOption) {
    containerClass =
      "border-emerald-500/40 bg-emerald-500/10";
    letterBadgeClass =
      "border-emerald-500 bg-emerald-500 text-white";
    textClass = "text-foreground font-semibold";
    badge = {
      label: isUserSelected ? "Bạn chọn • Đúng" : "Đáp án đúng",
      correct: true,
      className:
        "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    };
  } else if (isUserSelected) {
    containerClass =
      "border-rose-500/40 bg-rose-500/10";
    letterBadgeClass =
      "border-rose-500 bg-rose-500 text-white";
    textClass = "text-foreground font-medium";
    badge = {
      label: "Bạn chọn • Sai",
      correct: false,
      className:
        "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
    };
  }

  return (
    <div
      className={`flex flex-wrap items-start gap-3 rounded-xl border p-3.5 sm:flex-nowrap sm:items-center transition-colors ${containerClass}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${letterBadgeClass}`}
      >
        {optionLetter}
      </span>

      <div className={`min-w-0 flex-1 text-sm leading-relaxed ${textClass}`}>
        <PublicMarkdownRenderer
          content={content}
          className="prose-sm sm:prose max-w-none [&>p]:mb-0 [&>p]:inline"
        />
      </div>

      {badge && (
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}
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
