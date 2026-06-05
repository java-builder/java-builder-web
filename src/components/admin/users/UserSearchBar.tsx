"use client";

import { Loader2, RotateCw, Search, SlidersHorizontal } from "lucide-react";

interface UserSearchBarProps {
  search: string;
  debouncedSearch: string;
  isLoading: boolean;
  onSearch: (value: string) => void;
  onRefresh: () => void;
}

export const UserSearchBar = ({
  search,
  debouncedSearch,
  isLoading,
  onSearch,
  onRefresh,
}: UserSearchBarProps) => {
  const isDebouncing = search !== debouncedSearch;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Bộ lọc
          </h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      <div className="p-4 lg:p-5">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tìm kiếm người dùng
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Nhập tên, email hoặc username..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-9 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          {isDebouncing && (
            <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-accent" />
          )}
        </div>
      </div>
    </div>
  );
};
