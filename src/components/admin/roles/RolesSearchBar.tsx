"use client";

import { Search, X } from "lucide-react";

interface RolesSearchBarProps {
  searchQuery: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function RolesSearchBar({
  searchQuery,
  onChange,
  onClear,
}: RolesSearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm kiếm role theo tên..."
        className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500"
      />
      {searchQuery && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
