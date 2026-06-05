"use client";

export default function SubscriptionLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <div className="h-6 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      <div className="h-40 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
    </div>
  );
}
