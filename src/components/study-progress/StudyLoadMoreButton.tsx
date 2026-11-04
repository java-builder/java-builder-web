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
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{buttonLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-xs tabular-nums text-muted-foreground font-medium">
        {pageInfo}
      </p>
    </div>
  );
}
