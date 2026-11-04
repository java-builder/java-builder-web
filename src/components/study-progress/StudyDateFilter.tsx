"use client";

import { SlidersHorizontal } from "lucide-react";
import { DateTimePicker } from "@/components/ui/date-time-picker";

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
  onClear?: () => void;
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
}: StudyDateFilterProps) {
  return (
    <div className="relative z-20 rounded-2xl border border-border bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {filterLabel}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-soft border border-primary/15 px-3 py-1 text-xs font-bold text-primary">
          <span className="tabular-nums">
            {totalElements.toLocaleString("vi-VN")}
          </span>
          <span>{totalLabel}</span>
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_OPTIONS.map((id) => {
            const isActive = filter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onQuickFilter(id)}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {quickLabels[id]}
              </button>
            );
          })}
        </div>

        {/* Custom date */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="text-xs font-semibold text-muted-foreground">
            {customDateLabel}
          </span>
          <div className="relative flex-1 min-w-[200px] sm:flex-initial">
            <DateTimePicker
              value={selectedDate}
              onChange={onCustomDateChange}
              placeholder={customPlaceholder || "Chọn ngày tùy chỉnh..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
