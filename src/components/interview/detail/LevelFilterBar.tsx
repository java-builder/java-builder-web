"use client";

import { SlidersHorizontal } from "lucide-react";
import { LEVEL_LABELS, LEVEL_OPTIONS, LevelOption } from "./helpers";

interface LevelFilterBarProps {
  selected: LevelOption;
  onChange: (level: LevelOption) => void;
  filterLabel: string;
  allLabel: string;
  totalCount: number;
  countLabel: string;
}

export default function LevelFilterBar({
  selected,
  onChange,
  filterLabel,
  allLabel,
  totalCount,
  countLabel,
}: LevelFilterBarProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {filterLabel}
          </h3>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-text-secondary border border-border">
          <span className="tabular-nums text-foreground">
            {totalCount.toLocaleString("vi-VN")}
          </span>
          <span>{countLabel}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4 sm:px-5">
        {LEVEL_OPTIONS.map((level) => {
          const isActive = selected === level;
          const label =
            level === "all" ? allLabel : LEVEL_LABELS[level] || level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-text-secondary hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
