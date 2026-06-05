"use client";

import { ListChecks } from "lucide-react";
import { ReactNode } from "react";

interface MyContributionsListCardProps {
  title: string;
  countLabel: string;
  count: number;
  children: ReactNode;
}

export default function MyContributionsListCard({
  title,
  countLabel,
  count,
  children,
}: MyContributionsListCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <ListChecks className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-300">
          <span className="tabular-nums">{count.toLocaleString("vi-VN")}</span>
          <span>{countLabel}</span>
        </span>
      </div>
      {children}
    </div>
  );
}
