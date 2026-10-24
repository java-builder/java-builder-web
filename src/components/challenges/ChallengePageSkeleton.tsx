"use client";

import { ChallengeDayDetailSkeleton } from "./ChallengeDayDetailSkeleton";

export function ChallengePageSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors animate-pulse">
      {/* 1. Header Skeleton */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-3 rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-36 rounded bg-gray-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Hero */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 rounded-full bg-accent/20 dark:bg-accent/30" />
                <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-slate-800" />
              </div>
              <div className="h-9 sm:h-11 w-3/4 rounded-xl bg-gray-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded-lg bg-gray-100 dark:bg-slate-800/60" />
              <div className="h-4 w-2/3 rounded-lg bg-gray-100 dark:bg-slate-800/60" />

              {/* Stats badges */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <div className="h-7 w-28 rounded-lg bg-gray-100 dark:bg-slate-800/80" />
                <div className="h-7 w-28 rounded-lg bg-gray-100 dark:bg-slate-800/80" />
                <div className="h-7 w-32 rounded-lg bg-gray-100 dark:bg-slate-800/80" />
              </div>
            </div>

            {/* Right Card / CTA */}
            <div className="lg:col-span-4">
              <div className="h-32 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 p-5 space-y-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Workspace Skeleton */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roadmap Toolbar & Grid Skeleton */}
            <div className="rounded-xl border border-gray-200/90 bg-white dark:border-slate-800 dark:bg-slate-900">
              {/* Toolbar */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-800" />
                  <div className="h-5 w-36 rounded bg-gray-200 dark:bg-slate-800" />
                </div>
                <div className="h-10 w-44 rounded-lg bg-gray-100 dark:bg-slate-800" />
              </div>
              {/* Days Grid */}
              <div className="p-4 sm:p-5 flex flex-wrap gap-2.5">
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-14 sm:w-16 h-12 sm:h-13 rounded-lg border border-gray-200/70 bg-gray-100/70 dark:border-slate-800 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-1.5"
                  >
                    <div className="h-2.5 w-6 rounded bg-gray-200 dark:bg-slate-700" />
                    <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* Day Detail Skeleton */}
            <ChallengeDayDetailSkeleton />
          </div>

          {/* Right Column (1 col): Purchase Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5">
              <div className="h-6 w-32 rounded bg-gray-200 dark:bg-slate-800" />
              <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-slate-800" />
              <div className="space-y-2.5 pt-2">
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-slate-800/60" />
                <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-slate-800/60" />
                <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-slate-800/60" />
              </div>
              <div className="h-11 w-full rounded-xl bg-accent/30 dark:bg-accent/40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
