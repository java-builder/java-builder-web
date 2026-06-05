"use client";

export default function StudyLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
        </div>
        <div className="h-14 w-full max-w-md animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
      </div>

      {/* Filter skeleton */}
      <div className="h-32 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800"
          />
        ))}
      </div>

      {/* Timeline skeleton */}
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
