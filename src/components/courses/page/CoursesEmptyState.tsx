"use client";

import { BookOpen } from "lucide-react";

interface CoursesEmptyStateProps {
  title: string;
  description: string;
}

export default function CoursesEmptyState({
  title,
  description,
}: CoursesEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E8] dark:bg-orange-950/40 text-[#FF5A1F]">
        <BookOpen className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#171717] dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
