"use client";

import Link from "next/link";
import { FileQuestion, Plus } from "lucide-react";

interface MyContributionsEmptyStateProps {
  title: string;
  description: string;
  contributeLabel: string;
  contributeHref?: string;
}

export default function MyContributionsEmptyState({
  title,
  description,
  contributeLabel,
  contributeHref = "/interview/contribute",
}: MyContributionsEmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <Link
        href={contributeHref}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        <Plus className="h-4 w-4" />
        {contributeLabel}
      </Link>
    </div>
  );
}
