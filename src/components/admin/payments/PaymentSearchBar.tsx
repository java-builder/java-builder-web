"use client";

import { Calendar, Hash, RotateCw, Search, SlidersHorizontal, X } from "lucide-react";
import { PaymentStatus } from "@/types/payment";

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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
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
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <X className="h-3.5 w-3.5" />
              Xóa lọc
            </button>
          )}
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
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:p-5">
        {/* Order code */}
        <Field label="Mã đơn hàng">
          <div className="relative">
            <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Nhập mã đơn..."
              value={orderCode}
              onChange={(e) => onOrderCodeChange(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>
        </Field>

        {/* Status */}
        <Field label="Trạng thái">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-8 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
            >
              <option value="">Tất cả</option>
              <option value={PaymentStatus.SUCCESS}>Thành công</option>
              <option value={PaymentStatus.PENDING}>Đang xử lý</option>
              <option value={PaymentStatus.FAILED}>Thất bại</option>
              <option value={PaymentStatus.CANCELLED}>Đã hủy</option>
              <option value={PaymentStatus.EXPIRED}>Hết hạn</option>
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
        </Field>

        {/* Start date */}
        <Field label="Từ ngày">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="block w-full min-w-0 rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-2 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
            />
          </div>
        </Field>

        {/* End date */}
        <Field label="Đến ngày">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="block w-full min-w-0 rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-2 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
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
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}
