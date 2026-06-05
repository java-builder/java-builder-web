"use client";

import Link from "next/link";
import { BookOpen, ClipboardList, Inbox } from "lucide-react";

interface StudyEmptyStateProps {
  hasDateFilter: boolean;
  title: string;
  description: string;
  exploreCoursesLabel: string;
  doExercisesLabel: string;
}

export default function StudyEmptyState({
  hasDateFilter,
  title,
  description,
  exploreCoursesLabel,
  doExercisesLabel,
}: StudyEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>

      {!hasDateFilter && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            <BookOpen className="h-4 w-4" />
            {exploreCoursesLabel}
          </Link>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
          >
            <ClipboardList className="h-4 w-4" />
            {doExercisesLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
