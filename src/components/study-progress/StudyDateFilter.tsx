"use client";

import { CalendarRange, SlidersHorizontal, X } from "lucide-react";

export type DateFilterId =
  | "today"
  | "yesterday"
  | "days3"
  | "week"
  | "month"
  | "6months"
  | "custom";

interface StudyDateFilterProps {
  filter: DateFilterId;
  selectedDate: string;
  totalElements: number;
  totalLabel: string;
  filterLabel: string;
  customDateLabel: string;
  customPlaceholder: string;
  quickLabels: Record<DateFilterId, string>;
  onQuickFilter: (filter: DateFilterId) => void;
  onCustomDateChange: (value: string) => void;
  onClear: () => void;
}

const QUICK_OPTIONS: DateFilterId[] = [
  "today",
  "yesterday",
  "days3",
  "week",
  "month",
  "6months",
];

export default function StudyDateFilter({
  filter,
  selectedDate,
  totalElements,
  totalLabel,
  filterLabel,
  customDateLabel,
  customPlaceholder,
  quickLabels,
  onQuickFilter,
  onCustomDateChange,
  onClear,
}: StudyDateFilterProps) {
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
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          <span className="tabular-nums">
            {totalElements.toLocaleString("vi-VN")}
          </span>
          <span>{totalLabel}</span>
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {QUICK_OPTIONS.map((id) => {
            const isActive = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onQuickFilter(id)}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-accent text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                }`}
              >
                {quickLabels[id]}
              </button>
            );
          })}
        </div>

        {/* Custom date */}
        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 dark:border-slate-700">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {customDateLabel}
          </span>
          <div className="relative flex-1 min-w-[180px] sm:flex-initial">
            <CalendarRange className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onCustomDateChange(e.target.value)}
              placeholder={customPlaceholder}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-8 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
            />
            {filter === "custom" && selectedDate && (
              <button
                type="button"
                onClick={onClear}
                className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-200"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
