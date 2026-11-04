"use client";

export default function MyCoursesLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <div className="h-6 w-56  rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-72  rounded bg-gray-100 dark:bg-slate-700/60" />
      </div>
      <div className="h-20 rounded-2xl border border-[#E8E8E8] dark:border-border bg-white shadow-xs dark:bg-surface" />
      <div className="h-16 rounded-2xl border border-[#E8E8E8] dark:border-border bg-white shadow-xs dark:bg-surface" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white shadow-xs dark:bg-surface"
          >
            <div className="aspect-video bg-gray-100 dark:bg-slate-700" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-full rounded bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-9 rounded-xl bg-gray-100 dark:bg-slate-700/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
