"use client";

import { Search, RotateCcw, X, LayoutList, LayoutGrid } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/select";
import { ChallengeLevel, ChallengeStatus } from "@/types/challenge";

interface ChallengeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: ChallengeStatus | "";
  onStatusChange: (val: ChallengeStatus | "") => void;
  level: ChallengeLevel | "";
  onLevelChange: (val: ChallengeLevel | "") => void;
  onReset: () => void;
  filteredCount?: number;
  viewMode?: "table" | "grid";
  onViewModeChange?: (mode: "table" | "grid") => void;
}

export default function ChallengeFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  level,
  onLevelChange,
  onReset,
  filteredCount,
  viewMode = "grid",
  onViewModeChange,
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
    <div className="relative z-20 rounded-2xl border border-border bg-surface p-4 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên thử thách, slug hoặc mô tả..."
            className="flex h-10 w-full rounded-xl border border-border bg-background/60 py-2 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters + Reset + View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-44">
            <FilterSelect
              value={status}
              options={statusOptions}
              onChange={onStatusChange}
              placeholder="Trạng thái"
              size="md"
            />
          </div>

          <div className="w-full sm:w-40">
            <FilterSelect
              value={level}
              options={levelOptions}
              onChange={onLevelChange}
              placeholder="Cấp độ"
              size="md"
            />
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center gap-1.5 px-3.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl border border-border transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          )}

          {typeof filteredCount === "number" && (
            <span className="hidden xl:inline-flex items-center px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Hiển thị <strong className="mx-1 text-foreground">{filteredCount}</strong> kết quả
            </span>
          )}

          {onViewModeChange && (
            <div className="inline-flex h-10 items-center rounded-xl border border-border bg-muted/50 p-1 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-surface text-primary shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chế độ thẻ lưới"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Thẻ</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-surface text-primary shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Chế độ bảng"
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Bảng</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
