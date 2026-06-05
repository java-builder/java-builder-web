"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

interface NoSubscriptionStateProps {
  title: string;
  description: string;
  viewPlansLabel: string;
}

export default function NoSubscriptionState({
  title,
  description,
  viewPlansLabel,
}: NoSubscriptionStateProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Crown className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <Link
        href="/pricing"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        <Sparkles className="h-4 w-4" />
        {viewPlansLabel}
      </Link>
    </div>
  );
}
