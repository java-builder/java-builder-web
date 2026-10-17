"use client";

import { Search, SlidersHorizontal, RotateCcw, X } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { ChallengeLevel, ChallengeStatus } from "@/types/challenge";

interface ChallengeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: ChallengeStatus | "";
  onStatusChange: (val: ChallengeStatus | "") => void;
  level: ChallengeLevel | "";
  onLevelChange: (val: ChallengeLevel | "") => void;
  onReset: () => void;
}

export default function ChallengeFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  level,
  onLevelChange,
  onReset,
}: ChallengeFiltersProps) {
  const statusOptions: FilterOption<ChallengeStatus | "">[] = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Đang mở (Active)" },
    { value: "INACTIVE", label: "Tạm ẩn (Inactive)" },
  ];

  const levelOptions: FilterOption<ChallengeLevel | "">[] = [
    { value: "", label: "Tất cả cấp độ" },
    { value: "INTERN", label: "Intern" },
    { value: "FRESHER", label: "Fresher" },
    { value: "JUNIOR", label: "Junior" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
  ];

  const hasFilter = Boolean(search.trim()) || Boolean(status) || Boolean(level);

  return (
    <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Filter header & Search */}
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 pr-3 border-r border-border/80 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Bộ lọc
            </span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm theo tên thử thách..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-8 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Selects & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-44">
            <FilterSelect
              value={status}
              options={statusOptions}
              onChange={onStatusChange}
              placeholder="Trạng thái"
              size="sm"
            />
          </div>

          <div className="w-full sm:w-40">
            <FilterSelect
              value={level}
              options={levelOptions}
              onChange={onLevelChange}
              placeholder="Cấp độ"
              size="sm"
            />
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
