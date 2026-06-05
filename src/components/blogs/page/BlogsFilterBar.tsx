"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryDetailResponse } from "@/types/category";

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

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
            <span className="tabular-nums">
              {totalElements.toLocaleString("vi-VN")}
            </span>
            <span>{totalLabel}</span>
          </span>
          {hasFilter && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </label>
        </form>

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onCategoryChange("ALL")}
              className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                categorySlug === "ALL"
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              {allLabel}
            </button>
            {categories.map((cat) => {
              const active = categorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-accent text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
