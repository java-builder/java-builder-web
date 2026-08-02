"use client";

import { Loader2, RotateCw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { useI18n } from "@/contexts/I18nContext";

interface UserSearchBarProps {
  search: string;
  startDate: string;
  endDate: string;
  debouncedSearch: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export const UserSearchBar = ({
  search,
  startDate,
  endDate,
  debouncedSearch,
  isLoading,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onRefresh,
  onClearFilters,
}: UserSearchBarProps) => {
  const isDebouncing = search !== debouncedSearch;
  const activeFilterCount = [search, startDate, endDate].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0;

  const handleQuickRange = (range: "today" | "yesterday" | "7days" | "thisMonth" | "lastMonth") => {
    const now = new Date();
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    let start = new Date();
    let end = new Date();

    if (range === "today") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 0, 0);
    } else if (range === "yesterday") {
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 0, 0);
    } else if (range === "7days") {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 0, 0);
    } else if (range === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end.setHours(23, 59, 0, 0);
    } else if (range === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 0, 0);
    }

    onStartDateChange(formatDate(start));
    onEndDateChange(formatDate(end));
  };

  const { t } = useI18n();

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 bg-muted/5 rounded-t-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.common.search")}
          </h3>
          {hasFilters && (
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              {activeFilterCount}
            </span>
          )}

          {/* Quick Date Shortcuts */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 border-l border-border pl-3">
            <span className="text-xs text-muted-foreground font-medium">{t("admin.common.search")}:</span>
            <button
              type="button"
              onClick={() => handleQuickRange("today")}
              className="rounded-md border border-border/80 bg-background px-2 py-0.5 text-xs text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => handleQuickRange("7days")}
              className="rounded-md border border-border/80 bg-background px-2 py-0.5 text-xs text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
            >
              {t("admin.userSubscriptions.timeRange7days")}
            </button>
            <button
              type="button"
              onClick={() => handleQuickRange("thisMonth")}
              className="rounded-md border border-border/80 bg-background px-2 py-0.5 text-xs text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer"
            >
              {t("admin.userSubscriptions.timeRange30days")}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground h-8"
            >
              <X className="h-3.5 w-3.5" />
              {t("admin.users.clearFilter")}
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
            {t("admin.questionContributions.refreshBtn")}
          </Button>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-4">
        {/* Search input */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.common.search")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("admin.users.searchPlaceholder")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
            {isDebouncing && (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent" />
            )}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.users.dateFrom")}
          </label>
          <DateTimePicker
            value={startDate}
            onChange={onStartDateChange}
            placeholder="..."
            presetType="start"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("admin.users.dateTo")}
          </label>
          <DateTimePicker
            value={endDate}
            onChange={onEndDateChange}
            placeholder="..."
            align="right"
            presetType="end"
          />
        </div>
      </div>
    </div>
  );
};
