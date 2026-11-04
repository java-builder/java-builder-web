"use client";

import { SlidersHorizontal } from "lucide-react";

export type CourseStatusFilter = "ALL" | "LEARNING" | "COMPLETED";

interface MyCoursesFilterProps {
  filter: CourseStatusFilter;
  onChange: (id: CourseStatusFilter) => void;
  filterLabel: string;
  labels: Record<CourseStatusFilter, string>;
  counts: Record<CourseStatusFilter, number>;
}

const OPTIONS: CourseStatusFilter[] = ["ALL", "LEARNING", "COMPLETED"];

export default function MyCoursesFilter({
  filter,
  onChange,
  filterLabel,
  labels,
  counts,
}: MyCoursesFilterProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] dark:border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A1F]/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF5A1F]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {filterLabel}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-4 sm:p-5">
        {OPTIONS.map((id) => {
          const isActive = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                isActive
                  ? "bg-[#FF5A1F] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#222938] dark:text-gray-300 dark:hover:bg-[#2a3346] border border-[#E8E8E8] dark:border-border"
              }`}
            >
              <span>{labels[id]}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white text-gray-600 dark:bg-surface dark:text-gray-300"
                }`}
              >
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
