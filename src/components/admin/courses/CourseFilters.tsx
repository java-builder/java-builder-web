"use client";

import { Search, SlidersHorizontal, Video, FileText, Layers, X, LayoutGrid } from "lucide-react";
import { CourseFormat } from "@/types/course";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

export type CourseFormatFilterType = CourseFormat | "ALL";

interface CourseFiltersProps {
  search: string;
  levelFilter: string;
  formatFilter: CourseFormatFilterType;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onFormatChange: (value: CourseFormatFilterType) => void;
  onClearFilters: () => void;
}

export const CourseFilters = ({
  search,
  levelFilter,
  formatFilter,
  onSearchChange,
  onLevelChange,
  onFormatChange,
  onClearFilters,
}: CourseFiltersProps) => {
  const { t } = useI18n();
  const hasActiveFilters = Boolean(search.trim() || levelFilter !== "all" || formatFilter !== "ALL");

  const levelOptions: FilterOption[] = [
    { value: "all", label: t("admin.courses.filterAllLevels") },
    { value: "BEGINNER", label: "Cơ bản" },
    { value: "INTERMEDIATE", label: "Trung cấp" },
    { value: "ADVANCED", label: "Nâng cao" },
    { value: "EXPERT", label: "Chuyên gia" },
  ];

  const formatButtons = [
    { value: "ALL" as const, label: "Tất cả", icon: LayoutGrid, activeColor: "text-blue-500" },
    { value: CourseFormat.VIDEO, label: t("admin.courses.tabVideo"), icon: Video, activeColor: "text-accent" },
    { value: CourseFormat.TEXT, label: t("admin.courses.tabText"), icon: FileText, activeColor: "text-emerald-500" },
    { value: CourseFormat.MIXED, label: "Mixed", icon: Layers, activeColor: "text-purple-500" },
  ];

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Filter Header & Search */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 pr-2 border-r border-border/80">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {t("admin.userSubscriptions.filterAllStatus")}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={t("admin.courses.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>
        </div>

        {/* Center: Format Selector */}
        <div className="flex h-9 items-center gap-1 rounded-md border border-input bg-muted/40 p-1 shadow-xs">
          {formatButtons.map((btn) => {
            const isActive = formatFilter === btn.value;
            const Icon = btn.icon;
            return (
              <button
                key={btn.value}
                type="button"
                onClick={() => onFormatChange(btn.value)}
                className={`flex h-7 items-center gap-1.5 px-3 text-sm font-medium rounded transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? btn.activeColor : "text-muted-foreground/70"
                  }`}
                />
                <span className="whitespace-nowrap">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Level Filter Dropdown & Clear */}
        <div className="flex items-center gap-2">
          <div className="w-44">
            <FilterSelect
              value={levelFilter}
              onChange={onLevelChange}
              options={levelOptions}
              placeholder={t("admin.courses.filterAllLevels")}
              align="right"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground h-9 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t("admin.payments.clearFilters")}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
