"use client";

import { BookOpen, ChevronRight, Tag } from "lucide-react";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { getDifficultyTone, getStatusTone, LEVEL_LABELS } from "./helpers";

interface ContributionListItemProps {
  contribution: QuestionContributionDetailResponse;
  formattedDate: string;
  statusLabel: string;
  difficultyLabel: string;
  reviewedByText?: string;
  rejectReasonLabel: string;
  onView: () => void;
}

export default function ContributionListItem({
  contribution,
  formattedDate,
  statusLabel,
  difficultyLabel,
  reviewedByText,
  rejectReasonLabel,
  onView,
}: ContributionListItemProps) {
  const statusTone = getStatusTone(contribution.status);
  const difficultyTone = getDifficultyTone(contribution.difficulty);
  const StatusIcon = statusTone.icon;

  return (
    <button
      type="button"
      onClick={onView}
      className="group flex w-full flex-col gap-3 px-4 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-slate-700/40 sm:px-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-gray-900 transition group-hover:text-accent dark:text-white">
          {contribution.question}
        </h3>
        <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 transition group-hover:text-accent" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusTone.pill}`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusLabel}
        </span>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${difficultyTone}`}
        >
          {difficultyLabel}
        </span>
        {contribution.level && (
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300">
            <Tag className="h-3 w-3" />
            {LEVEL_LABELS[contribution.level] || contribution.level}
          </span>
        )}
        <span className="ml-auto text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
      </div>

      {contribution.questionSetTitle && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{contribution.questionSetTitle}</span>
        </div>
      )}

      {contribution.status === "APPROVED" && reviewedByText && (
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          {reviewedByText}
        </p>
      )}

      {contribution.status === "REJECTED" && contribution.rejectReason && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 dark:border-rose-900/40 dark:bg-rose-900/20">
          <p className="text-xs text-rose-700 dark:text-rose-400">
            <span className="font-semibold">{rejectReasonLabel}</span>{" "}
            {contribution.rejectReason}
          </p>
        </div>
      )}
    </button>
  );
}
