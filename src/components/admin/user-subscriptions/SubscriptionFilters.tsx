"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionFiltersProps {
  searchInput: string;
  status: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export default function SubscriptionFilters({
  searchInput,
  status,
  onSearchInputChange,
  onSearch,
  onStatusChange,
  onClear,
  hasActiveFilters,
}: SubscriptionFiltersProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Bộ lọc
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-1 text-muted-foreground hover:text-foreground h-8"
          >
            <X className="h-3.5 w-3.5" />
            Xóa lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-4 lg:p-5">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trạng thái
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-sm text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tìm kiếm
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="Tìm theo tên hoặc email..."
                className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button
              variant="accent"
              size="default"
              onClick={onSearch}
              className="gap-1.5 h-[38px]"
            >
              <Search className="h-3.5 w-3.5" />
              Tìm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
