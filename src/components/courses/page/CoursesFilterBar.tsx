"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { CourseLevel } from "@/types/course";

interface CoursesFilterBarProps {
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearchSubmit: () => void;
  level: CourseLevel | "";
  onLevelChange: (level: CourseLevel | "") => void;
  totalElements: number;
  filterLabel: string;
  searchPlaceholder: string;
  totalLabel: string;
  labels: {
    all: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  };
}

interface ChipOption {
  id: CourseLevel | "";
  label: string;
}

export default function CoursesFilterBar({
  searchText,
  onSearchTextChange,
  onSearchSubmit,
  level,
  onLevelChange,
  totalElements,
  filterLabel,
  searchPlaceholder,
  totalLabel,
  labels,
}: CoursesFilterBarProps) {
  const options: ChipOption[] = [
    { id: "", label: labels.all },
    { id: CourseLevel.BEGINNER, label: labels.beginner },
    { id: CourseLevel.INTERMEDIATE, label: labels.intermediate },
    { id: CourseLevel.ADVANCED, label: labels.advanced },
    { id: CourseLevel.EXPERT, label: labels.expert },
  ];

  const hasFilter = Boolean(searchText) || level !== "";

  const handleClear = () => {
    onSearchTextChange("");
    onLevelChange("");
    onSearchSubmit();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] dark:border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0E8] dark:bg-orange-950/40 text-[#FF5A1F]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717] dark:text-white">
            {filterLabel}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#F8F8F8] dark:bg-slate-800 border border-[#E8E8E8] dark:border-border px-3 py-0.5 text-xs font-semibold text-[#171717] dark:text-slate-200">
            <span className="tabular-nums font-bold">
              {totalElements.toLocaleString("vi-VN")}
            </span>
            <span className="text-[#64748B] dark:text-slate-400">{totalLabel}</span>
          </span>
          {hasFilter && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#64748B] transition hover:bg-[#FFF0E8] dark:bg-primary/15 hover:text-[#FF5A1F] dark:hover:bg-slate-800 cursor-pointer"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-background py-2.5 pl-10 pr-3 text-sm text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] transition focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 shadow-2xs"
            />
          </label>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {options.map((option) => {
            const isActive = level === option.id;
            return (
              <button
                key={option.id || "all"}
                type="button"
                onClick={() => onLevelChange(option.id)}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF5A1F] text-white shadow-xs font-bold"
                    : "bg-[#F8F8F8] dark:bg-slate-800 text-[#171717] dark:text-slate-200 border border-[#E8E8E8] dark:border-border hover:bg-[#FFF0E8] hover:text-[#FF5A1F] dark:hover:bg-slate-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
