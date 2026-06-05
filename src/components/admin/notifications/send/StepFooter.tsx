"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface StepFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  isFinal?: boolean;
  isSubmitting?: boolean;
}

export default function StepFooter({
  onBack,
  onNext,
  nextLabel = "Tiếp tục",
  isFinal,
  isSubmitting,
}: StepFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      ) : (
        <span />
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFinal ? <Send className="h-4 w-4" /> : null}
          {nextLabel}
          {!isFinal && <ArrowRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
