"use client";

import { useState } from "react";
import { useMyPaymentHistory } from "@/hooks/usePayment";
import { PaymentStatus, TransactionType } from "@/types/payment";
import { formatReadableDate } from "@/utils/dateUtils";
import { Pagination } from "@/components/ui/Pagination";
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
} from "lucide-react";

const formatCurrency = (value: number, dateLocale: string) =>
  new Intl.NumberFormat(dateLocale, {
    style: "currency",
    currency: "VND",
  }).format(value);

const StatusBadge = ({ status, t }: { status: PaymentStatus; t: ReturnType<typeof useI18n>["t"] }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return {
          color:
            "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
          text: t("paymentHistoryPage.success"),
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };
      case PaymentStatus.PENDING:
        return {
          color:
            "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
          text: t("paymentHistoryPage.pending"),
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };
      case PaymentStatus.FAILED:
        return {
          color:
            "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
          text: t("paymentHistoryPage.failed"),
          icon: <XCircle className="h-3.5 w-3.5" />,
        };
      case PaymentStatus.CANCELLED:
        return {
          color:
            "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700/60 dark:text-slate-300 dark:ring-slate-400/20",
          text: t("paymentHistoryPage.cancelled"),
          icon: <XCircle className="h-3.5 w-3.5" />,
        };
      case PaymentStatus.EXPIRED:
        return {
          color:
            "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-400/20",
          text: t("paymentHistoryPage.expired"),
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };
      default:
        return {
          color:
            "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700/60 dark:text-slate-300 dark:ring-slate-400/20",
          text: status,
          icon: <ReceiptText className="h-3.5 w-3.5" />,
        };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

const TransactionTypeBadge = ({ type, t }: { type: TransactionType; t: ReturnType<typeof useI18n>["t"] }) => {
  const getTypeConfig = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PAYIN:
        return {
          color:
            "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20",
          text: t("paymentHistoryPage.typePayment"),
          icon: <ArrowDownToLine className="h-3.5 w-3.5" />,
        };
      case TransactionType.PAYOUT:
        return {
          color:
            "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
          text: t("paymentHistoryPage.typeWithdraw"),
          icon: <ArrowUpRight className="h-3.5 w-3.5" />,
        };
      case TransactionType.SUBSCRIPTION:
        return {
          color:
            "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20",
          text: t("paymentHistoryPage.typeSubscribe"),
          icon: <WalletCards className="h-3.5 w-3.5" />,
        };
      default:
        return {
          color:
            "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700/60 dark:text-slate-300 dark:ring-slate-400/20",
          text: type,
          icon: <ReceiptText className="h-3.5 w-3.5" />,
        };
    }
  };

  const config = getTypeConfig(type);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

export default function PaymentHistoryPage() {
  const { locale, t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useMyPaymentHistory(currentPage, 10);
  const payments = data?.data ?? [];
  const successfulPayments = payments.filter(
    (payment) => payment.paymentStatus === PaymentStatus.SUCCESS
  );
  const pendingPayments = payments.filter(
    (payment) => payment.paymentStatus === PaymentStatus.PENDING
  );
  const totalPaid = successfulPayments.reduce(
    (total, payment) => total + payment.totalPrice,
    0
  );

  const dateLocale = locale === "vi" ? "vi-VN" : locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "ko-KR";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {t("paymentHistoryPage.title")}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t("paymentHistoryPage.subtitle")}
                </p>
              </div>
            </div>

            {!isLoading && payments.length > 0 && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{data?.totalElements ?? 0}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.transactions")}</div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{successfulPayments.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.success")}</div>
                </div>
                <div className="w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">{pendingPayments.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.pending")}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 animate-pulse">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableCode")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableContent")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableType")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableAmount")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableStatus")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableDate")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-muted rounded w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted rounded w-48 mb-2" />
                        <div className="h-3.5 bg-muted rounded w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-muted rounded w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-muted rounded w-24 ml-auto" />
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
          ) : payments.length > 0 ? (
            <>
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <ReceiptText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("paymentHistoryPage.listTitle")}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("paymentHistoryPage.totalPaid").replace("{amount}", formatCurrency(totalPaid, dateLocale))}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                    <WalletCards className="w-4 h-4" />
                    {data?.totalElements ?? 0} {t("paymentHistoryPage.transactionItem")}
                  </div>
                </div>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableCode")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableContent")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableType")}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableAmount")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableStatus")}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("paymentHistoryPage.tableDate")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                          #{payment.paymentCode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-sm">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {payment.courseTitle || payment.subscriptionPlanName || payment.description || "-"}
                            </p>
                            {payment.description && (
                              <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                {payment.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TransactionTypeBadge type={payment.transactionType} t={t} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(payment.totalPrice, dateLocale)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={payment.paymentStatus} t={t} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatReadableDate(payment.createdAt, dateLocale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.tableCode")}</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">#{payment.paymentCode}</p>
                      </div>
                      <StatusBadge status={payment.paymentStatus} t={t} />
                    </div>
                    <div className="mt-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {payment.courseTitle || payment.subscriptionPlanName || payment.description || "-"}
                      </p>
                      {payment.description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{payment.description}</p>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-slate-700 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.tableType")}</p>
                        <div className="mt-1">
                          <TransactionTypeBadge type={payment.transactionType} t={t} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("paymentHistoryPage.tableAmount")}</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">{formatCurrency(payment.totalPrice, dateLocale)}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <CalendarDays className="h-4 w-4" />
                        {formatReadableDate(payment.createdAt, dateLocale)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700">
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
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-24 h-24 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t("paymentHistoryPage.emptyTitle")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t("paymentHistoryPage.emptyDesc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
