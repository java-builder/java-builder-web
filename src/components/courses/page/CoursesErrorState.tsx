"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

interface CoursesErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

export default function CoursesErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: CoursesErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-950/40 bg-red-50/50 dark:bg-red-950/20 p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#171717] dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
        {description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-5 py-2.5 text-xs font-semibold text-white transition active:scale-[0.98] cursor-pointer shadow-xs"
      >
        <RotateCw className="h-3.5 w-3.5" />
        {retryLabel}
      </button>
    </div>
  );
}
