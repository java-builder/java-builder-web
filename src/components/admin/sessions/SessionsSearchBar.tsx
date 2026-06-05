"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

interface SessionsSearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SessionsSearchBar = ({
  query,
  onChange,
  onClear,
}: SessionsSearchBarProps) => {
  const hasQuery = query.length > 0;

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
        {hasQuery && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Xoá lọc
          </button>
        )}
      </div>

      <div className="p-4 lg:p-5">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Tìm kiếm phiên
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm theo trình duyệt, IP, thiết bị, hệ điều hành..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
        <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Có thể tìm kiếm theo nhiều thuộc tính của phiên truy cập
        </p>
      </div>
    </div>
  );
};
