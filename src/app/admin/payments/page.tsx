"use client";

import { useState } from "react";
import { useAllPayments } from "@/hooks/usePayment";
import { PaymentSearchBar } from "@/components/admin/payments/PaymentSearchBar";
import { PaymentTableRow } from "@/components/admin/payments/PaymentTableRow";
import { PaymentMobileCard } from "@/components/admin/payments/PaymentMobileCard";
import { PaymentDetailModal } from "@/components/admin/payments/PaymentDetailModal";
import { Pagination } from "@/components/ui/Pagination";
import { PaymentDetailResponse, PaymentStatus } from "@/types/payment";

const COLUMN_HEADERS: { label: string; align?: "left" | "right"; hiddenUntilXl?: boolean }[] = [
  { label: "Mã đơn" },
  { label: "Người dùng" },
  { label: "Sản phẩm" },
  { label: "Loại" },
  { label: "Số tiền", align: "right" },
  { label: "Trạng thái" },
  { label: "Ngày tạo", hiddenUntilXl: true },
];

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCode, setOrderCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetailResponse | null>(null);

  const { data, isLoading, refetch } = useAllPayments({
    page: currentPage,
    size: 10,
    orderCode: orderCode ? Number(orderCode) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
  });

  const handleClearFilters = () => {
    setOrderCode("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCurrentPage(1);
  };

  const payments = data?.data ?? [];
  const hasData = payments.length > 0;

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Quản lý thanh toán
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Xem và quản lý tất cả giao dịch thanh toán trong hệ thống
          </p>
        </div>
        {data && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Tổng{" "}
            <span className="tabular-nums">
              {data.totalElements.toLocaleString("vi-VN")}
            </span>{" "}
            giao dịch
          </span>
        )}
      </div>

      <PaymentSearchBar
        orderCode={orderCode}
        startDate={startDate}
        endDate={endDate}
        status={status}
        isLoading={isLoading}
        onOrderCodeChange={setOrderCode}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onStatusChange={(value) => setStatus(value as PaymentStatus | "")}
        onRefresh={refetch}
        onClearFilters={handleClearFilters}
      />

      {/* Loading inline notice */}
      {isLoading && data && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-accent">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* Initial loading */}
      {isLoading && !data && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang tải giao dịch...
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasData && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            Không có giao dịch nào
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Chưa có giao dịch thanh toán phù hợp với bộ lọc
          </p>
        </div>
      )}

      {/* Mobile cards (hiển thị < md) */}
      {hasData && (
        <div className="space-y-3 md:hidden">
          {payments.map((payment) => (
            <PaymentMobileCard
              key={payment.id}
              payment={payment}
              onClick={setSelectedPayment}
            />
          ))}
        </div>
      )}

      {/* Desktop table (hiển thị >= md) */}
      {hasData && (
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 md:block">
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-slate-700">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[22%]" />
              <col className="w-[10%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="hidden xl:table-column xl:w-[12%]" />
            </colgroup>
            <thead className="bg-gray-50 dark:bg-slate-900/40">
              <tr>
                {COLUMN_HEADERS.map((col) => (
                  <th
                    key={col.label}
                    className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${col.hiddenUntilXl ? "hidden xl:table-cell" : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {payments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  onClick={setSelectedPayment}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 0 && hasData && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          pageSize={data.pageSize}
          onPageChange={setCurrentPage}
          itemName="giao dịch"
        />
      )}

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
