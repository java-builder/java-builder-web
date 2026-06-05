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
  expandedQuestions: Set<string>;
  chatbotOpen: Record<string, boolean>;
  onChangeFilter: (filter: QuestionFilter) => void;
  onToggleQuestion: (questionId: string) => void;
  onToggleChatbot: (questionId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export default function QuestionListSection({
  questions,
  filteredQuestions,
  counts,
  activeFilter,
  expandedQuestions,
  chatbotOpen,
  onChangeFilter,
  onToggleQuestion,
  onToggleChatbot,
  onExpandAll,
  onCollapseAll,
}: QuestionListSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-700 px-4 py-3 sm:px-5">
        <div className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1">
          {(Object.keys(QUESTION_FILTER_LABELS) as QuestionFilter[]).map((key) => {
            const isActive = activeFilter === key;
            const count = counts[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeFilter(key)}
                className={`inline-flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {QUESTION_FILTER_LABELS[key]}
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                    isActive
                      ? "bg-accent/20 text-accent"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs">
          <button
            onClick={onExpandAll}
            className="rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Mở rộng tất cả
          </button>
          <span className="text-gray-300 dark:text-slate-600">|</span>
          <button
            onClick={onCollapseAll}
            className="rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {filteredQuestions.length === 0 && (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <ListChecks className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có câu hỏi nào trong bộ lọc này.
            </p>
          </div>
        )}

        {filteredQuestions.map((questionResult) => {
          const originalIndex = questions.findIndex(
            (q) => q.questionId === questionResult.questionId
          );
          return (
            <QuestionItem
              key={questionResult.questionId}
              questionResult={questionResult}
              questionNumber={originalIndex + 1}
              isExpanded={expandedQuestions.has(questionResult.questionId)}
              isAiOpen={!!chatbotOpen[questionResult.questionId]}
              onToggleExpand={onToggleQuestion}
              onToggleAi={onToggleChatbot}
            />
          );
        })}
      </div>
    </div>
  );
}
