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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {filterLabel}
          </h3>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
          <span className="tabular-nums">
            {totalCount.toLocaleString("vi-VN")}
          </span>
          <span>{countLabel}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-4 sm:p-5">
        {LEVEL_OPTIONS.map((level) => {
          const isActive = selected === level;
          const label =
            level === "all" ? allLabel : LEVEL_LABELS[level] || level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
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
