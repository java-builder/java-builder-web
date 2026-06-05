"use client";

import { Quote } from "lucide-react";

interface StudyHeaderProps {
  title: string;
  subtitle: string;
  quote?: { quote: string; author: string };
}

export default function StudyHeader({ title, subtitle, quote }: StudyHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      {quote && (
        <div className="flex max-w-md items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Quote className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="line-clamp-2 text-xs italic leading-relaxed text-gray-700 dark:text-gray-300">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-accent">
              — {quote.author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
