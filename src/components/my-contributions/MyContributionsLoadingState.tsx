"use client";

export default function MyContributionsLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <div className="h-6 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
      </div>
      <div className="h-20 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      <div className="h-16 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-700/60"
          />
        ))}
      </div>
    </div>
  );
}
