"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, X, Tag } from "lucide-react";
import { CategoryDetailResponse } from "@/types/category";
import { FilterSelect } from "@/components/ui/select";

interface BlogsFilterBarProps {
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearchSubmit: () => void;
  categorySlug: string | "ALL";
  onCategoryChange: (slug: string | "ALL") => void;
  categories: CategoryDetailResponse[];
  totalElements: number;
  filterLabel: string;
  searchPlaceholder: string;
  totalLabel: string;
  allLabel: string;
}

export default function BlogsFilterBar({
  searchText,
  onSearchTextChange,
  onSearchSubmit,
  categorySlug,
  onCategoryChange,
  categories,
  totalElements,
  filterLabel,
  searchPlaceholder,
  totalLabel,
  allLabel,
}: BlogsFilterBarProps) {
  const hasFilter = Boolean(searchText) || categorySlug !== "ALL";

  const handleClear = () => {
    onSearchTextChange("");
    onCategoryChange("ALL");
    onSearchSubmit();
  };

  const categoryOptions = useMemo(() => {
    return [
      { value: "", label: allLabel || "Tất cả danh mục" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ];
  }, [categories, allLabel]);

  return (
    <div className="relative z-20 rounded-2xl border border-border bg-surface shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {filterLabel}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary-soft border border-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="tabular-nums">
              {totalElements.toLocaleString("vi-VN")}
            </span>
            <span>{totalLabel}</span>
          </span>
          {hasFilter && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
              title="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Search Input + Category Dropdown with Search */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="sm:col-span-7 lg:col-span-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
            >
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => onSearchTextChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="block w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                />
              </label>
            </form>
          </div>

          {/* Category Dropdown with Live Search Input inside */}
          <div className="sm:col-span-5 lg:col-span-4">
            <FilterSelect
              value={categorySlug === "ALL" ? "" : categorySlug}
              onChange={(val) => onCategoryChange(val ? String(val) : "ALL")}
              options={categoryOptions}
              placeholder={allLabel || "Tất cả danh mục"}
              icon={<Tag className="h-4 w-4 text-primary shrink-0" />}
              searchable={true}
              searchPlaceholder="Tìm kiếm danh mục..."
              clearable={categorySlug !== "ALL"}
              size="md"
              triggerClassName="h-10.5 rounded-xl border-border bg-background"
              align="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
