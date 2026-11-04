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
    <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary border border-primary/15">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {!hasDateFilter && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-5 py-2.5 text-sm font-semibold text-primary-foreground transition shadow-xs active:scale-95"
          >
            <BookOpen className="h-4 w-4" />
            {exploreCoursesLabel}
          </Link>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface hover:border-primary/40 hover:text-primary text-foreground px-5 py-2.5 text-sm font-semibold transition active:scale-95"
          >
            <ClipboardList className="h-4 w-4" />
            {doExercisesLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
