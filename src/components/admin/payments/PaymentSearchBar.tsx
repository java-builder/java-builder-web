"use client";

import { Calendar, Hash, RotateCw, Search, SlidersHorizontal, X } from "lucide-react";
import { PaymentStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";

interface PaymentSearchBarProps {
  orderCode: string;
  startDate: string;
  endDate: string;
  status: string;
  isLoading: boolean;
  onOrderCodeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export const PaymentSearchBar = ({
  orderCode,
  startDate,
  endDate,
  status,
  isLoading,
  onOrderCodeChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onRefresh,
  onClearFilters,
}: PaymentSearchBarProps) => {
  const activeFilterCount = [orderCode, startDate, endDate, status].filter(
    Boolean
  ).length;
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Bộ lọc
          </h3>
          {hasFilters && (
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              {activeFilterCount} đang áp dụng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground h-8"
            >
              <X className="h-3.5 w-3.5" />
              Xóa lọc
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 h-8"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Order code */}
        <Field label="Mã đơn hàng">
          <div className="relative">
            <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="number"
              placeholder="Nhập mã đơn..."
              value={orderCode}
              onChange={(e) => onOrderCodeChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-8 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
          </div>
        </Field>

        {/* Status */}
        <Field label="Trạng thái">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent py-1 pl-8 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            >
              <option value="">Tất cả</option>
              <option value={PaymentStatus.SUCCESS}>Thành công</option>
              <option value={PaymentStatus.PENDING}>Đang xử lý</option>
              <option value={PaymentStatus.FAILED}>Thất bại</option>
              <option value={PaymentStatus.CANCELLED}>Đã hủy</option>
              <option value={PaymentStatus.EXPIRED}>Hết hạn</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60"
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
        </Field>

        {/* Start date */}
        <Field label="Từ ngày">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pl-8 pr-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
          </div>
        </Field>

        {/* End date */}
        <Field label="Đến ngày">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pl-8 pr-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
          </div>
        </Field>
      </div>
    </div>
  );
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
