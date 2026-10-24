"use client";

export function ChallengeDayDetailSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="space-y-3 border-b border-gray-100 dark:border-slate-800 pb-5">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 rounded-lg bg-gray-200 dark:bg-slate-800" />
          <div className="h-6 w-36 rounded-lg bg-gray-100 dark:bg-slate-800/60" />
          <div className="h-6 w-24 rounded-lg bg-gray-100 dark:bg-slate-800/60 hidden sm:block" />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 pt-1">
          <div className="h-7 sm:h-8 w-3/5 rounded-lg bg-gray-200 dark:bg-slate-800" />
          <div className="h-4 w-4/5 rounded-lg bg-gray-100 dark:bg-slate-800/60" />
        </div>

        {/* Tech tags */}
        <div className="pt-2 flex items-center gap-2">
          <div className="h-4 w-20 rounded bg-gray-100 dark:bg-slate-800/60" />
          <div className="flex gap-1.5">
            <div className="h-5 w-16 rounded-md bg-gray-200 dark:bg-slate-800" />
            <div className="h-5 w-20 rounded-md bg-gray-200 dark:bg-slate-800" />
            <div className="h-5 w-14 rounded-md bg-gray-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* 2. Why Learn & Core Mission Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/30 p-4 sm:p-5 space-y-3">
          <div className="h-4 w-44 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-full rounded bg-gray-100 dark:bg-slate-800/60" />
            <div className="h-3.5 w-4/5 rounded bg-gray-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/30 p-4 sm:p-5 space-y-3">
          <div className="h-4 w-40 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-full rounded bg-gray-100 dark:bg-slate-800/60" />
            <div className="h-3.5 w-3/4 rounded bg-gray-100 dark:bg-slate-800/60" />
          </div>
        </div>
      </div>

      {/* 3. Task Summary Card Skeleton */}
      <div className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-800/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-slate-800" />
              <div className="h-3 w-64 rounded bg-gray-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="h-2 w-full max-w-md rounded-full bg-gray-200 dark:bg-slate-800" />
        </div>
        <div className="h-10 w-full sm:w-52 rounded-lg bg-gray-200 dark:bg-slate-800" />
      </div>

      {/* 4. Content Area Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="p-5 sm:p-6 rounded-xl bg-gray-50/70 border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800 space-y-3.5">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-slate-800/60" />
          <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-slate-800/60" />
          <div className="h-28 w-full rounded-lg bg-gray-200/60 dark:bg-slate-800/40 mt-4" />
          <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-slate-800/60" />
          <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-slate-800/60" />
        </div>
      </div>

      {/* 5. Navigation Skeleton */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-slate-800" />
          <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-full sm:w-44 rounded-lg bg-gray-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
