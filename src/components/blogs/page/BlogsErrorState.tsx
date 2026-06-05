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
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center shadow-sm dark:border-rose-900/40 dark:bg-rose-900/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        <RotateCw className="h-4 w-4" />
        {retryLabel}
      </button>
    </div>
  );
}
