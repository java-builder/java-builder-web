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
    { value: CourseFormat.VIDEO, label: "Video", icon: Video, activeColor: "text-accent" },
    { value: CourseFormat.TEXT, label: "Văn bản", icon: FileText, activeColor: "text-emerald-500" },
    { value: CourseFormat.MIXED, label: "Hỗn hợp", icon: Layers, activeColor: "text-purple-500" },
  ];

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Filter Header & Search */}
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 pr-3 border-r border-border/80 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Bộ lọc
            </span>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={t("admin.courses.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-3 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>
        </div>

        {/* Right Controls Container: Format Selector & Level Filter */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 max-w-full">
          {/* Format Selector Tabs */}
          <div className="flex h-9 items-center gap-1 rounded-md border border-input bg-muted/40 p-1 shadow-xs max-w-full overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {formatButtons.map((btn) => {
              const isActive = formatFilter === btn.value;
              const Icon = btn.icon;
              return (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => onFormatChange(btn.value)}
                  className={`flex h-7 items-center gap-1.5 px-3 text-xs sm:text-sm font-medium rounded transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors ${
                      isActive ? btn.activeColor : "text-muted-foreground/70"
                    }`}
                  />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Level Filter Dropdown & Clear */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-36 sm:w-44">
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
                className="gap-1 text-muted-foreground hover:text-foreground h-9 cursor-pointer shrink-0"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("admin.payments.clearFilters")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
