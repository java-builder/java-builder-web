"use client";

import { RotateCw, SlidersHorizontal, X } from "lucide-react";
import type { JobType } from "@/types/scheduled-job";
import { JOB_TYPES } from "./helpers";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterSelect";

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
    <div className="relative z-20 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Filter icon + Dropdown + Quick Category Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pr-2 sm:border-r sm:border-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Bộ lọc
            </span>
          </div>

          {/* Job Type Dropdown */}
          <div className="w-52">
            <FilterSelect
              value={jobType}
              onChange={(val) => onJobTypeChange(val as JobType | "")}
              options={JOB_TYPES}
              placeholder="Tất cả loại job"
            />
          </div>

          {/* Quick filter chips */}
          <div className="hidden md:flex items-center gap-1">
            {JOB_TYPES.filter((t) => t.value !== "").map((t) => {
              const isActive = jobType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onJobTypeChange(isActive ? "" : (t.value as JobType))}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-white shadow-sm font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Clear & Refresh Buttons */}
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
    </div>
  );
}
