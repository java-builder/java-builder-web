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
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-4 sm:p-5">
        {OPTIONS.map((id) => {
          const isActive = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
              }`}
            >
              <span>{labels[id]}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white text-gray-600 dark:bg-slate-800 dark:text-gray-300"
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
