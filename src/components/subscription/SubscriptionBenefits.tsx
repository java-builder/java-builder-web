"use client";

import { Sparkles, Check } from "lucide-react";

interface SubscriptionBenefitsProps {
  title: string;
  items: string[];
}

export default function SubscriptionBenefits({
  title,
  items,
}: SubscriptionBenefitsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-slate-700">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800/40">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
