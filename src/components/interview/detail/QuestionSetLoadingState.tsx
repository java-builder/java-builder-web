"use client";

export default function QuestionSetLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="h-40 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      <div className="h-20 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800"
          />
        ))}
      </div>
    </div>
  );
}
