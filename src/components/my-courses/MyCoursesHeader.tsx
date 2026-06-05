"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

interface MyCoursesHeaderProps {
  title: string;
  subtitle: string;
  exploreLabel: string;
}

export default function MyCoursesHeader({
  title,
  subtitle,
  exploreLabel,
}: MyCoursesHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <Link
        href="/courses"
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
      >
        <Compass className="h-4 w-4" />
        {exploreLabel}
      </Link>
    </div>
  );
}
