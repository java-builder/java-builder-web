"use client";

import { useEffect } from "react";
import { BookOpen, FileText, Tag, X } from "lucide-react";
import { QuestionContributionDetailResponse } from "@/types/interview";
import {
  getDifficultyTone,
  getStatusTone,
  LEVEL_LABELS,
} from "./helpers";
import MarkdownTabs from "./MarkdownTabs";

interface ContributionDetailModalProps {
  contribution: QuestionContributionDetailResponse;
  formattedDate: string;
  reviewedByText?: string;
  statusLabel: string;
  difficultyLabel: string;
  labels: {
    title: string;
    subtitle: string;
    questionSet: string;
    question: string;
    answer: string;
    tips: string;
    rejectReason: string;
    markdown: string;
    preview: string;
    close: string;
  };
  onClose: () => void;
}

export default function ContributionDetailModal({
  contribution,
  formattedDate,
  reviewedByText,
  statusLabel,
  difficultyLabel,
  labels,
  onClose,
}: ContributionDetailModalProps) {
  const statusTone = getStatusTone(contribution.status);
  const difficultyTone = getDifficultyTone(contribution.difficulty);
  const StatusIcon = statusTone.icon;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {labels.title}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {labels.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone.pill}`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusLabel}
            </span>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${difficultyTone}`}
            >
              {difficultyLabel}
            </span>
            {contribution.level && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                <Tag className="h-3 w-3" />
                {LEVEL_LABELS[contribution.level] || contribution.level}
              </span>
            )}
            <span className="ml-auto text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>

          {/* Question set */}
          {contribution.questionSetTitle && (
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <BookOpen className="h-3 w-3" />
                {labels.questionSet}
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white">
                {contribution.questionSetTitle}
              </div>
            </div>
          )}

          {/* Question */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <FileText className="h-3 w-3" />
              {labels.question}
            </label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white">
              {contribution.question}
            </div>
          </div>

          {contribution.answer && (
            <MarkdownTabs
              label={labels.answer}
              content={contribution.answer}
              markdownLabel={labels.markdown}
              previewLabel={labels.preview}
              maxHeight="max-h-[400px]"
            />
          )}

          {contribution.tips && (
            <MarkdownTabs
              label={labels.tips}
              content={contribution.tips}
              markdownLabel={labels.markdown}
              previewLabel={labels.preview}
              maxHeight="max-h-[300px]"
            />
          )}

          {contribution.rejectReason && (
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {labels.rejectReason}
              </label>
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                {contribution.rejectReason}
              </div>
            </div>
          )}

          {reviewedByText && (
            <p className="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-slate-700 dark:text-gray-400">
              {reviewedByText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
