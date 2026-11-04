"use client";

import { ListChecks } from "lucide-react";
import type { QuestionResultResponse } from "@/types/exercise-submission";
import {
  QUESTION_FILTER_LABELS,
  type QuestionCounts,
  type QuestionFilter,
} from "./types";
import QuestionItem from "./QuestionItem";

interface QuestionListSectionProps {
  questions: QuestionResultResponse[];
  filteredQuestions: QuestionResultResponse[];
  counts: QuestionCounts;
  activeFilter: QuestionFilter;
  onChangeFilter: (filter: QuestionFilter) => void;
}

export default function QuestionListSection({
  questions,
  filteredQuestions,
  counts,
  activeFilter,
  onChangeFilter,
}: QuestionListSectionProps) {
  return (
    <div className="space-y-4">
      {/* Filter Toolbar Card */}
      <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(Object.keys(QUESTION_FILTER_LABELS) as QuestionFilter[]).map((key) => {
            const isActive = activeFilter === key;
            const count = counts[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeFilter(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{QUESTION_FILTER_LABELS[key]}</span>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
                    isActive
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft border border-primary/15 text-primary">
            <ListChecks className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Không có câu hỏi nào trong bộ lọc này.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((questionResult) => {
            const originalIndex = questions.findIndex(
              (q) => q.questionId === questionResult.questionId
            );
            return (
              <QuestionItem
                key={questionResult.questionId}
                questionResult={questionResult}
                questionNumber={originalIndex + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
