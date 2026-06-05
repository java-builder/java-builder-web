"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface MyContributionsHeaderProps {
  title: string;
  subtitle: string;
  contributeLabel: string;
  contributeHref?: string;
}

export default function MyContributionsHeader({
  title,
  subtitle,
  contributeLabel,
  contributeHref = "/interview/contribute",
}: MyContributionsHeaderProps) {
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
        href={contributeHref}
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        <Plus className="h-4 w-4" />
        {contributeLabel}
      </Link>
    </div>
  );
}
