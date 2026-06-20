"use client";

import { RotateCw, SlidersHorizontal, X } from "lucide-react";
import type { JobType } from "@/types/scheduled-job";
import { JOB_TYPES } from "./helpers";
import { Button } from "@/components/ui/button";

interface JobFiltersProps {
  jobType: JobType | "";
  hasActiveFilters: boolean;
  isLoading: boolean;
  onJobTypeChange: (value: JobType | "") => void;
  onClear: () => void;
  onRefresh: () => void;
}

export default function JobFilters({
  jobType,
  hasActiveFilters,
  isLoading,
  onJobTypeChange,
  onClear,
  onRefresh,
}: JobFiltersProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Bộ lọc
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="gap-1 text-muted-foreground hover:text-foreground h-8"
            >
              <X className="h-3.5 w-3.5" />
              Xóa lọc
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 h-8"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:p-5">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Loại job
          </label>
          <div className="relative">
            <select
              value={jobType}
              onChange={(e) => onJobTypeChange(e.target.value as JobType | "")}
              className="block w-full appearance-none rounded-lg border border-input bg-background py-2 pl-3 pr-8 text-sm text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              {JOB_TYPES.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
