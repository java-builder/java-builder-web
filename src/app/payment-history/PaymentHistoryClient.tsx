"use client";

import { useState, useMemo } from "react";
import { useMyPaymentHistory } from "@/hooks/usePayment";
import { PaymentStatus, TransactionType } from "@/types/payment";
import { formatReadableDate } from "@/utils/dateUtils";
import { Pagination } from "@/components/ui/pagination";
import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  ReceiptText,
  WalletCards,
  XCircle,
  Search,
  Copy,
  Check,
} from "lucide-react";

const formatCurrency = (value: number, dateLocale: string) =>
  new Intl.NumberFormat(dateLocale, {
    style: "currency",
    currency: "VND",
  }).format(value);

const StatusBadge = ({
  status,
  t,
}: {
  status: PaymentStatus;
  t: ReturnType<typeof useI18n>["t"];
}) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return {
          color:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          text: t("paymentHistoryPage.success"),
          icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />,
        };
      case PaymentStatus.PENDING:
        return {
          color:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          text: t("paymentHistoryPage.pending"),
          icon: <Clock3 className="h-3.5 w-3.5 shrink-0" />,
        };
      case PaymentStatus.FAILED:
        return {
          color:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          text: t("paymentHistoryPage.failed"),
          icon: <XCircle className="h-3.5 w-3.5 shrink-0" />,
        };
      case PaymentStatus.CANCELLED:
        return {
          color: "bg-muted text-muted-foreground border-border",
          text: t("paymentHistoryPage.cancelled"),
          icon: <XCircle className="h-3.5 w-3.5 shrink-0" />,
        };
      case PaymentStatus.EXPIRED:
        return {
          color:
            "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
          text: t("paymentHistoryPage.expired"),
          icon: <Clock3 className="h-3.5 w-3.5 shrink-0" />,
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          text: status,
          icon: <ReceiptText className="h-3.5 w-3.5 shrink-0" />,
        };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

const TransactionTypeBadge = ({
  type,
  t,
}: {
  type: TransactionType;
  t: ReturnType<typeof useI18n>["t"];
}) => {
  const getTypeConfig = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYIN:
        return {
          color:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          text: t("paymentHistoryPage.typePayment"),
          icon: <ArrowDownToLine className="h-3 w-3 shrink-0" />,
        };
      case TransactionType.PAYOUT:
        return {
          color:
            "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
          text: t("paymentHistoryPage.typeWithdraw"),
          icon: <ArrowUpRight className="h-3 w-3 shrink-0" />,
        };
      case TransactionType.SUBSCRIPTION:
        return {
          color:
            "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
          text: t("paymentHistoryPage.typeSubscribe"),
          icon: <WalletCards className="h-3 w-3 shrink-0" />,
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          text: type,
          icon: <ReceiptText className="h-3 w-3 shrink-0" />,
        };
    }
  };

  const config = getTypeConfig(type);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

type StatusFilter = "ALL" | "SUCCESS" | "PENDING" | "OTHER";

export default function PaymentHistoryPage() {
  const { locale, t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data, isLoading } = useMyPaymentHistory(currentPage, 10);
  const payments = useMemo(() => data?.data ?? [], [data?.data]);

  const successfulPayments = useMemo(
    () => payments.filter((p) => p.paymentStatus === PaymentStatus.SUCCESS),
    [payments]
  );
  const pendingPayments = useMemo(
    () => payments.filter((p) => p.paymentStatus === PaymentStatus.PENDING),
    [payments]
  );
  const totalPaid = useMemo(
    () => successfulPayments.reduce((total, p) => total + p.totalPrice, 0),
    [successfulPayments]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "SUCCESS"
            ? payment.paymentStatus === PaymentStatus.SUCCESS
            : statusFilter === "PENDING"
              ? payment.paymentStatus === PaymentStatus.PENDING
              : payment.paymentStatus !== PaymentStatus.SUCCESS &&
                payment.paymentStatus !== PaymentStatus.PENDING;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;

      const codeMatch = String(payment.paymentCode || "")
        .toLowerCase()
        .includes(q);
      const itemMatch = String(payment.paymentItem?.itemName || "")
        .toLowerCase()
        .includes(q);
      const descMatch = String(payment.description || "")
        .toLowerCase()
        .includes(q);

      return matchesStatus && (codeMatch || itemMatch || descMatch);
    });
  }, [payments, statusFilter, searchQuery]);

  const dateLocale =
    locale === "vi"
      ? "vi-VN"
      : locale === "en"
        ? "en-US"
        : locale === "ja"
          ? "ja-JP"
          : "ko-KR";

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t("paymentHistoryPage.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("paymentHistoryPage.subtitle")}
            </p>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {t("paymentHistoryPage.transactions")}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary border border-primary/15">
                <ReceiptText className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-foreground tabular-nums">
              {isLoading ? "—" : (data?.totalElements ?? 0)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Đã thanh toán
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <WalletCards className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-extrabold text-primary tabular-nums truncate">
              {isLoading ? "—" : formatCurrency(totalPaid, dateLocale)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {t("paymentHistoryPage.success")}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {isLoading ? "—" : successfulPayments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {t("paymentHistoryPage.pending")}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock3 className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {isLoading ? "—" : pendingPayments.length}
            </p>
          </div>
        </div>

        {/* Main Transactions Card */}
        <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
          {/* Card Header & Filter Toolbar */}
          <div className="flex flex-col gap-3.5 border-b border-border p-4 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft border border-primary/15 text-primary">
                <ReceiptText className="h-3.5 w-3.5" />
              </span>
              <h2 className="text-sm font-bold text-foreground">
                {t("paymentHistoryPage.listTitle")}
              </h2>
              {!isLoading && (
                <span className="inline-flex items-center rounded-full bg-primary-soft border border-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary tabular-nums">
                  {filteredPayments.length}
                </span>
              )}
            </div>

            {!isLoading && payments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search input */}
                <div className="relative flex-1 sm:flex-initial sm:w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã GD hoặc nội dung..."
                    className="h-9 w-full rounded-full border border-border bg-background pl-8 pr-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Status filter pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: "ALL", label: "Tất cả" },
                      { id: "SUCCESS", label: t("paymentHistoryPage.success") },
                      { id: "PENDING", label: t("paymentHistoryPage.pending") },
                      { id: "OTHER", label: "Khác" },
                    ] as const
                  ).map((tab) => {
                    const active = statusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="divide-y divide-border p-4 sm:p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 pt-4 first:pt-0"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-48" />
                    <div className="h-3.5 bg-muted rounded w-64" />
                  </div>
                  <div className="h-6 bg-muted rounded-full w-24" />
                  <div className="h-5 bg-muted rounded w-28" />
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-soft border border-primary/15 text-primary rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">
                {t("paymentHistoryPage.emptyTitle")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("paymentHistoryPage.emptyDesc")}
              </p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-muted-foreground">
                Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Zero-Scroll Table */}
              <div className="hidden lg:block">
                <table className="w-full table-fixed divide-y divide-border">
                  <thead className="bg-background/60">
                    <tr>
                      <th className="w-[16%] px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("paymentHistoryPage.tableCode")}
                      </th>
                      <th className="w-[34%] px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("paymentHistoryPage.tableContent")}
                      </th>
                      <th className="w-[15%] px-4 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("paymentHistoryPage.tableType")}
                      </th>
                      <th className="w-[17%] px-4 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("paymentHistoryPage.tableStatus")}
                      </th>
                      <th className="w-[18%] px-5 py-3.5 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {t("paymentHistoryPage.tableAmount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {filteredPayments.map((payment) => {
                      const codeStr = String(payment.paymentCode);
                      const isCopied = copiedCode === codeStr;
                      const itemTitle =
                        payment.paymentItem?.itemName ||
                        payment.description ||
                        "—";
                      const showSubDesc =
                        payment.description &&
                        payment.paymentItem?.itemName &&
                        payment.description !== payment.paymentItem.itemName;

                      return (
                        <tr
                          key={payment.id}
                          className="hover:bg-background/60 transition-colors group"
                        >
                          {/* Code + Date */}
                          <td className="px-5 py-4 align-middle">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-foreground truncate">
                                #{codeStr}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(codeStr)}
                                className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer shrink-0"
                                title="Sao chép mã giao dịch"
                              >
                                {isCopied ? (
                                  <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
                              <CalendarDays className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {formatReadableDate(payment.createdAt, dateLocale)}
                              </span>
                            </div>
                          </td>

                          {/* Content */}
                          <td className="px-5 py-4 align-middle">
                            <p
                              className="text-sm font-bold text-foreground line-clamp-1"
                              title={itemTitle}
                            >
                              {itemTitle}
                            </p>
                            {showSubDesc && (
                              <p
                                className="mt-0.5 text-xs text-muted-foreground line-clamp-1"
                                title={payment.description}
                              >
                                {payment.description}
                              </p>
                            )}
                          </td>

                          {/* Type */}
                          <td className="px-4 py-4 align-middle">
                            <TransactionTypeBadge
                              type={payment.transactionType}
                              t={t}
                            />
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4 align-middle">
                            <StatusBadge
                              status={payment.paymentStatus}
                              t={t}
                            />
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 align-middle text-right">
                            <span className="text-sm font-extrabold tabular-nums text-foreground">
                              {formatCurrency(payment.totalPrice, dateLocale)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet & Mobile Card List (< lg) */}
              <div className="divide-y divide-border lg:hidden">
                {filteredPayments.map((payment) => {
                  const codeStr = String(payment.paymentCode);
                  const isCopied = copiedCode === codeStr;
                  const itemTitle =
                    payment.paymentItem?.itemName ||
                    payment.description ||
                    "—";

                  return (
                    <div
                      key={payment.id}
                      className="p-4 sm:px-6 hover:bg-background/50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground bg-background border border-border px-2.5 py-1 rounded-lg">
                            #{codeStr}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(codeStr)}
                            className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary transition-colors"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <TransactionTypeBadge
                            type={payment.transactionType}
                            t={t}
                          />
                        </div>
                        <StatusBadge status={payment.paymentStatus} t={t} />
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground line-clamp-2">
                            {itemTitle}
                          </p>
                          {payment.description &&
                            payment.paymentItem?.itemName && (
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                {payment.description}
                              </p>
                            )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-extrabold text-foreground tabular-nums">
                            {formatCurrency(payment.totalPrice, dateLocale)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>
                          {formatReadableDate(payment.createdAt, dateLocale)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data && data.totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-border bg-background/40">
                  <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    pageSize={data.pageSize}
                    onPageChange={handlePageChange}
                    itemName={t("paymentHistoryPage.transactionItem")}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
