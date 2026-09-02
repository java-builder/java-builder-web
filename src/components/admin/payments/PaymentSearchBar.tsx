"use client";

import { Hash, RotateCw, Search, SlidersHorizontal, X } from "lucide-react";
import { PaymentStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { CustomSelect, SelectOption } from "@/components/ui/CustomSelect";
import { useI18n } from "@/contexts/I18nContext";

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
  const { t } = useI18n();

  const statusOptions: SelectOption[] = [
    { value: "", label: t("admin.documents.filterAllTypes") },
    {
      value: PaymentStatus.SUCCESS,
      label: t("admin.payments.statusSuccess"),
      badge: <span className="h-2 w-2 rounded-full bg-emerald-500" />,
    },
    {
      value: PaymentStatus.PENDING,
      label: t("admin.payments.statusPending"),
      badge: <span className="h-2 w-2 rounded-full bg-amber-500" />,
    },
    {
      value: PaymentStatus.FAILED,
      label: t("admin.payments.statusFailed"),
      badge: <span className="h-2 w-2 rounded-full bg-rose-500" />,
    },
    {
      value: PaymentStatus.CANCELLED,
      label: t("admin.payments.statusCancelled"),
      badge: <span className="h-2 w-2 rounded-full bg-gray-400" />,
    },
    {
      value: PaymentStatus.EXPIRED,
      label: t("admin.payments.statusExpired"),
      badge: <span className="h-2 w-2 rounded-full bg-orange-500" />,
    },
  ];

  const activeFilterCount = [orderCode, startDate, endDate, status].filter(
    Boolean
  ).length;
  const hasFilters = activeFilterCount > 0;



  return (
    <div className="relative z-20 rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 bg-muted/5 rounded-t-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.userSubscriptions.filterAllStatus")}
          </h3>
          {hasFilters && (
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground h-8 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              {t("admin.payments.clearFilters")}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 h-8 cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            {t("admin.questionContributions.refreshBtn")}
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
          <CustomSelect
            value={status}
            onChange={(val) => onStatusChange(String(val))}
            options={statusOptions}
            placeholder="Tất cả"
            icon={<Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />}
          />
        </Field>

        {/* Start date */}
        <Field label="Từ ngày">
          <DateTimePicker
            value={startDate}
            onChange={onStartDateChange}
            placeholder="Chọn ngày bắt đầu..."
            presetType="start"
          />
        </Field>

        {/* End date */}
        <Field label="Đến ngày">
          <DateTimePicker
            value={endDate}
            onChange={onEndDateChange}
            placeholder="Chọn ngày kết thúc..."
            align="right"
            presetType="end"
          />
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
