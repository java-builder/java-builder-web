"use client";

import { Loader2, Search, X, RotateCcw } from "lucide-react";
import { ActivityType } from "@/types/user-activity";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";

interface DailyActivitySearchBarProps {
  search: string;
  debouncedSearch: string;
  selectedType: ActivityType | "ALL";
  fromDate: string;
  toDate: string;
  onSearch: (value: string) => void;
  onTypeChange: (type: ActivityType | "ALL") => void;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onResetFilters: () => void;
}

export const DailyActivitySearchBar = ({
  search,
  debouncedSearch,
  selectedType,
  fromDate,
  toDate,
  onSearch,
  onTypeChange,
  onFromDateChange,
  onToDateChange,
  onResetFilters,
}: DailyActivitySearchBarProps) => {
  const { t } = useI18n();
  const isDebouncing = search !== debouncedSearch;
  const hasActiveFilters = Boolean(
    search || selectedType !== "ALL" || fromDate || toDate
  );

  const typeOptions: { label: string; value: ActivityType | "ALL" }[] = [
    { label: t("admin.dailyActivities.filterAllTypes"), value: "ALL" },
    { label: t("admin.dailyActivities.statLessons"), value: ActivityType.VIEW_LESSON },
    { label: t("admin.dailyActivities.statBlogs"), value: ActivityType.READ_BLOG },
    { label: t("admin.dailyActivities.statExercises"), value: ActivityType.SUBMIT_EXERCISE },
  ];

  return (
    <div className="space-y-3 bg-card border border-border p-4 rounded-xl shadow-sm">
      {/* Top row: Search input + Date Range + Reset */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("admin.dailyActivities.searchPlaceholder")}
            className="flex h-9 w-full rounded-lg border border-input bg-background/50 px-3 pl-9 pr-9 text-xs shadow-none transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/40"
          />
          {isDebouncing ? (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent" />
          ) : search ? (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Date Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* From Date */}
          <div className="w-full sm:w-44">
            <DateTimePicker
              value={fromDate}
              onChange={onFromDateChange}
              placeholder={t("admin.dailyActivities.fromDate") + "..."}
              showTime={false}
              presetType="start"
            />
          </div>

          {/* To Date */}
          <div className="w-full sm:w-44">
            <DateTimePicker
              value={toDate}
              onChange={onToDateChange}
              placeholder={t("admin.dailyActivities.toDate") + "..."}
              showTime={false}
              align="right"
              presetType="end"
            />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer rounded-lg"
              title={t("admin.dailyActivities.clearDateFilter")}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("admin.dailyActivities.clearDateFilter")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Type Filter Pills */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs overflow-x-auto max-w-full">
        {typeOptions.map((tab) => {
          const isActive = selectedType === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTypeChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap cursor-pointer text-xs ${
                isActive
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
