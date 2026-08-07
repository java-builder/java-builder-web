"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { CertificateStatus } from "@/types/certificate";

export type StatusFilterType = "ALL" | CertificateStatus;

interface MyCertificatesFilterProps {
  filter: StatusFilterType;
  onChangeFilter: (status: StatusFilterType) => void;
  searchCode: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  counts: Record<StatusFilterType, number>;
}

const OPTIONS: StatusFilterType[] = ["ALL", "ISSUED", "EXPIRED", "REVOKED"];

const LABELS: Record<StatusFilterType, string> = {
  ALL: "Tất cả",
  ISSUED: "Đã cấp chính thức",
  EXPIRED: "Hết hạn",
  REVOKED: "Đã thu hồi",
};

export default function MyCertificatesFilter({
  filter,
  onChangeFilter,
  searchCode,
  onSearchChange,
  onSearchSubmit,
  counts,
}: MyCertificatesFilterProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Bộ lọc & Tìm kiếm
          </h3>
        </div>

        {/* Search Input */}
        <form onSubmit={onSearchSubmit} className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo mã chứng chỉ hoặc tên..."
            className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors shadow-xs"
          />
          {searchCode && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-4 sm:p-5">
        {OPTIONS.map((id) => {
          const isActive = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeFilter(id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98] cursor-pointer ${
                isActive
                  ? "bg-accent text-white shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <span>{LABELS[id]}</span>
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-background text-foreground border border-border"
                }`}
              >
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
