"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailTemplatesSearchBarProps {
  searchQuery: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function EmailTemplatesSearchBar({
  searchQuery,
  onChange,
  onClear,
}: EmailTemplatesSearchBarProps) {
  const hasQuery = searchQuery.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Bộ lọc
          </h3>
        </div>
        {hasQuery && (
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

      <div className="p-4 lg:p-5">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tìm theo tên mẫu thư hoặc tiêu đề email..."
            className="block w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>
    </div>
  );
}
