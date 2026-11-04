"use client";

import Link from "next/link";
import { BookOpen, Compass } from "lucide-react";

interface MyCoursesEmptyStateProps {
  title: string;
  description: string;
  exploreLabel: string;
}

export default function MyCoursesEmptyState({
  title,
  description,
  exploreLabel,
}: MyCoursesEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
        <BookOpen className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <Link
        href="/courses"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF5A1F]/25 active:scale-95 transition-all"
      >
        <Compass className="h-4 w-4" />
        {exploreLabel}
      </Link>
    </div>
  );
}
