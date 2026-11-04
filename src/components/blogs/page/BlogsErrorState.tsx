"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

interface BlogsErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

export default function BlogsErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: BlogsErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#171717] dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B] dark:text-slate-400">
        {description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all shadow-xs cursor-pointer active:scale-95"
      >
        <RotateCw className="h-4 w-4" />
        {retryLabel}
      </button>
    </div>
  );
}
