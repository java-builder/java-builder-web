"use client";

import { Loader2, Search, X } from "lucide-react";
import { StreakStatus } from "@/types/user-streak";

interface UserStreakSearchBarProps {
  search: string;
  debouncedSearch: string;
  selectedStatus: StreakStatus | "ALL";
  onSearch: (value: string) => void;
  onStatusChange: (status: StreakStatus | "ALL") => void;
}

export const UserStreakSearchBar = ({
  search,
  debouncedSearch,
  selectedStatus,
  onSearch,
  onStatusChange,
}: UserStreakSearchBarProps) => {
  const isDebouncing = search !== debouncedSearch;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Nhập tên, email hoặc user ID..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {isDebouncing ? (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent" />
        ) : search ? (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-0.5 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs overflow-x-auto max-w-full shrink-0">
        {(
          [
            { label: "Tất cả", value: "ALL" },
            { label: "Đã duy trì", value: "ACTIVE_TODAY" },
            { label: "Nguy cơ", value: "AT_RISK" },
            { label: "Đã mất", value: "BROKEN" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`px-3 py-1 rounded-lg transition-all font-medium ${
              selectedStatus === tab.value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
