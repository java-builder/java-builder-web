"use client";

export default function InterviewLoadingState() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700" />
              <div className="space-y-1.5 text-right">
                <div className="ml-auto h-6 w-10 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
                <div className="ml-auto h-3 w-14 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-14 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-5 w-14 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-5 w-14 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
