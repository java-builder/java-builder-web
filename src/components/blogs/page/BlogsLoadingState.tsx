"use client";

export default function BlogsLoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs animate-pulse"
        >
          <div className="aspect-video bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3.5 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
