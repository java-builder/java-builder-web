"use client";

import { SearchX } from "lucide-react";

interface QuestionSetEmptyStateProps {
  title: string;
  description: string;
}

export default function QuestionSetEmptyState({
  title,
  description,
}: QuestionSetEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-xs sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        {description}
      </p>
    </div>
  );
}
