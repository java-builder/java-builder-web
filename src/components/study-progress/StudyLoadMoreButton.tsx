"use client";

import { ChevronDown, Loader2 } from "lucide-react";

interface StudyLoadMoreButtonProps {
  isLoading: boolean;
  loadingLabel: string;
  buttonLabel: string;
  pageInfo: string;
  onClick: () => void;
}

export default function StudyLoadMoreButton({
  isLoading,
  loadingLabel,
  buttonLabel,
  pageInfo,
  onClick,
}: StudyLoadMoreButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{buttonLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
        {pageInfo}
      </p>
    </div>
  );
}
