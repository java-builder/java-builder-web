"use client";

import Link from "next/link";
import { Award, Compass } from "lucide-react";

interface MyCertificatesEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
}

export default function MyCertificatesEmptyState({
  title,
  description,
  actionLabel,
}: MyCertificatesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Award className="h-8 w-8" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <Link
        href="/courses"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 shadow-sm"
      >
        <Compass className="h-4 w-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
