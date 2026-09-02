"use client";

import {
  PaymentDetailResponse,
  PaymentStatus,
  TransactionType,
} from "@/types/payment";
import { formatLocaleString } from "@/utils/dateUtils";

const STATUS_TONE: Record<PaymentStatus | "DEFAULT", string> = {
  [PaymentStatus.SUCCESS]:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  [PaymentStatus.PENDING]:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  [PaymentStatus.FAILED]:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
  [PaymentStatus.CANCELLED]:
    "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-300",
  [PaymentStatus.EXPIRED]:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  DEFAULT: "bg-gray-100 text-gray-700 ring-gray-200",
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.SUCCESS]: "Thành công",
  [PaymentStatus.PENDING]: "Đang xử lý",
  [PaymentStatus.FAILED]: "Thất bại",
  [PaymentStatus.CANCELLED]: "Đã hủy",
  [PaymentStatus.EXPIRED]: "Hết hạn",
};

const TYPE_LABEL: Record<TransactionType, string> = {
  [TransactionType.PAYIN]: "Thanh toán",
  [TransactionType.PAYOUT]: "Rút tiền",
  [TransactionType.SUBSCRIPTION]: "Đăng ký",
};

const TYPE_TONE: Record<TransactionType, string> = {
  [TransactionType.PAYIN]:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  [TransactionType.PAYOUT]:
    "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  [TransactionType.SUBSCRIPTION]:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
};

import { Trash2 } from "lucide-react";

interface PaymentMobileCardProps {
  payment: PaymentDetailResponse;
  onClick: (payment: PaymentDetailResponse) => void;
  onDelete?: (payment: PaymentDetailResponse) => void;
}

export const PaymentMobileCard = ({ payment, onClick, onDelete }: PaymentMobileCardProps) => {
  const isExpired = payment.paymentStatus === PaymentStatus.EXPIRED;
  const productName =
    payment.courseTitle || payment.subscriptionPlanName || "—";
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(payment.totalPrice);

  return (
    <div
      onClick={() => onClick(payment)}
      className="cursor-pointer block w-full rounded-xl border border-border bg-card p-4 text-left transition hover:border-accent hover:shadow-sm"
    >
      {/* Top row: order code + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
            #{payment.paymentCode}
          </div>
          <div className="mt-1 truncate text-sm font-semibold text-foreground">
            {payment.userName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {payment.userEmail}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${STATUS_TONE[payment.paymentStatus] ?? STATUS_TONE.DEFAULT}`}
          >
            {STATUS_LABEL[payment.paymentStatus] ?? payment.paymentStatus}
          </span>
          {isExpired && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(payment);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              title="Xóa giao dịch hết hạn"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Detail rows */}
      <dl className="mt-3 grid grid-cols-1 gap-y-1.5 border-t border-border pt-3 text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="flex-shrink-0 text-muted-foreground">Sản phẩm</dt>
          <dd className="min-w-0 flex-1 truncate text-right font-medium text-foreground">
            {productName}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="flex-shrink-0 text-muted-foreground">Loại</dt>
          <dd className="text-right">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${TYPE_TONE[payment.transactionType]}`}
            >
              {TYPE_LABEL[payment.transactionType] ?? payment.transactionType}
            </span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="flex-shrink-0 text-muted-foreground">Số tiền</dt>
          <dd className="text-right text-sm font-semibold tabular-nums text-foreground">
            {formattedAmount}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="flex-shrink-0 text-muted-foreground">Ngày tạo</dt>
          <dd className="text-right tabular-nums text-muted-foreground">
            {formatLocaleString(payment.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
};
