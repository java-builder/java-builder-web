"use client";

import { useState } from "react";
import {
  useAllPayments,
  useDeleteExpiredPayment,
  useDeleteAllExpiredPayments,
} from "@/hooks/usePayment";
import { PaymentSearchBar } from "@/components/admin/payments/PaymentSearchBar";
import { PaymentTableRow } from "@/components/admin/payments/PaymentTableRow";
import { PaymentMobileCard } from "@/components/admin/payments/PaymentMobileCard";
import { PaymentDetailModal } from "@/components/admin/payments/PaymentDetailModal";
import { Pagination } from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";
import { PaymentDetailResponse, PaymentStatus } from "@/types/payment";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { useI18n } from "@/contexts/I18nContext";

export default function PaymentsPage() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCode, setOrderCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetailResponse | null>(null);

  // Delete modal state
  const [singleDeleteModal, setSingleDeleteModal] = useState<{
    isOpen: boolean;
    payment: PaymentDetailResponse | null;
  }>({
    isOpen: false,
    payment: null,
  });
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const { data, isLoading, refetch } = useAllPayments({
    page: currentPage,
    size: 10,
    orderCode: orderCode ? Number(orderCode) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
  });

  const deleteExpiredMutation = useDeleteExpiredPayment();
  const deleteAllExpiredMutation = useDeleteAllExpiredPayments();

  const handleClearFilters = () => {
    setOrderCode("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteModal.payment) return;
    try {
      await deleteExpiredMutation.mutateAsync(singleDeleteModal.payment.id);
      toast.success(t("admin.payments.deleteSuccess"));
      setSingleDeleteModal({ isOpen: false, payment: null });
      if (selectedPayment?.id === singleDeleteModal.payment.id) {
        setSelectedPayment(null);
      }
    } catch (error: unknown) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : "Xóa giao dịch thất bại";
      toast.error(message);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      const res = await deleteAllExpiredMutation.mutateAsync();
      const count = res.data ?? 0;
      toast.success(
        t("admin.payments.deleteAllSuccess").replace("{count}", String(count))
      );
      setIsBulkDeleteModalOpen(false);
    } catch (error: unknown) {
      const message =
        isAxiosError<{ message?: string }>(error) && error.response?.data?.message
          ? error.response.data.message
          : "Xóa toàn bộ giao dịch thất bại";
      toast.error(message);
    }
  };

  const payments = data?.data ?? [];
  const hasData = payments.length > 0;

  const columnHeaders = [
    { label: t("admin.payments.colOrderCode") },
    { label: t("admin.payments.colUser") },
    { label: t("admin.payments.colProduct") },
    { label: t("admin.payments.colType") },
    { label: t("admin.payments.colAmount"), align: "right" as const },
    { label: t("admin.payments.colStatus") },
    { label: t("admin.payments.colCreatedAt"), hiddenUntilXl: true },
    { label: t("admin.payments.colActions"), align: "right" as const },
  ];

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {t("admin.payments.pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.payments.pageSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {t("admin.payments.totalTransactions").replace(
                "{count}",
                data.totalElements.toLocaleString()
              )}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBulkDeleteModalOpen(true)}
            className="gap-1.5 h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("admin.payments.deleteAllBtn")}
          </Button>
        </div>
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
        <div className="flex items-center gap-2 rounded-lg border border-accent/15 bg-accent/5 px-3 py-2 text-sm text-accent animate-pulse">
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* Initial loading */}
      {isLoading && !data && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full divide-y divide-border animate-pulse">
            <thead className="bg-muted/40">
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-muted rounded w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-transparent">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded w-36 mb-2" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-5 bg-muted rounded w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-muted rounded w-28" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasData && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-6 w-6 text-muted-foreground"
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
          <p className="text-base font-semibold text-foreground">
            Không có giao dịch nào
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
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
              onDelete={(p) => setSingleDeleteModal({ isOpen: true, payment: p })}
            />
          ))}
        </div>
      )}

      {/* Desktop table (hiển thị >= md) */}
      {hasData && (
        <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
          <table className="w-full table-fixed divide-y divide-border">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="hidden xl:table-column xl:w-[14%]" />
              <col className="w-[6%]" />
            </colgroup>
            <thead className="bg-muted/40">
              <tr>
                {columnHeaders.map((col) => (
                  <th
                    key={col.label}
                    className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${col.hiddenUntilXl ? "hidden xl:table-cell" : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-transparent">
              {payments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  onClick={setSelectedPayment}
                  onDelete={(p) => setSingleDeleteModal({ isOpen: true, payment: p })}
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
          onDelete={(p) => setSingleDeleteModal({ isOpen: true, payment: p })}
        />
      )}

      {/* Modal xác nhận xóa 1 giao dịch hết hạn */}
      <ConfirmModal
        isOpen={singleDeleteModal.isOpen}
        onClose={() => setSingleDeleteModal({ isOpen: false, payment: null })}
        onConfirm={handleConfirmSingleDelete}
        title={t("admin.payments.deleteSingleTitle")}
        message={t("admin.payments.deleteSingleConfirm").replace(
          "{code}",
          String(singleDeleteModal.payment?.paymentCode || "")
        )}
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteExpiredMutation.isPending}
      />

      {/* Modal xác nhận xóa toàn bộ giao dịch hết hạn */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title={t("admin.payments.deleteAllTitle")}
        message={t("admin.payments.deleteAllConfirm")}
        confirmText="Xóa tất cả hết hạn"
        cancelText="Hủy"
        type="danger"
        isLoading={deleteAllExpiredMutation.isPending}
      />
    </div>
  );
}
