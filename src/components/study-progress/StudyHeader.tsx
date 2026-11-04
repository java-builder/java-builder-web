"use client";

import { Quote } from "lucide-react";

interface StudyHeaderProps {
  title: string;
  subtitle: string;
  quote?: { quote: string; author: string };
}

export default function StudyHeader({ title, subtitle, quote }: StudyHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      </div>

      {quote && (
        <div className="flex max-w-md items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/15">
            <Quote className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="line-clamp-2 text-xs italic leading-relaxed text-foreground/90 font-medium">
              &ldquo;{quote.quote}&rdquo;
            </p>
            <p className="mt-1 text-[11px] font-semibold text-primary">
              — {quote.author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
