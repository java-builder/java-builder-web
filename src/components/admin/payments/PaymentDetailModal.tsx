"use client";

import { ReactNode, useEffect } from "react";
import {
  Calendar,
  CreditCard,
  Hash,
  Mail,
  Package,
  ScrollText,
  Trash2,
  User,
  Wallet,
  X,
} from "lucide-react";
import {
  PaymentDetailResponse,
  PaymentGateWay,
  PaymentMethod,
  PaymentStatus,
  TransactionType,
} from "@/types/payment";
import { formatApiDate } from "@/utils/dateUtils";

interface PaymentDetailModalProps {
  payment: PaymentDetailResponse;
  onClose: () => void;
  onDelete?: (payment: PaymentDetailResponse) => void;
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; tone: "emerald" | "amber" | "rose" | "gray" | "orange" }
> = {
  [PaymentStatus.SUCCESS]: { label: "Thành công", tone: "emerald" },
  [PaymentStatus.PENDING]: { label: "Đang xử lý", tone: "amber" },
  [PaymentStatus.FAILED]: { label: "Thất bại", tone: "rose" },
  [PaymentStatus.CANCELLED]: { label: "Đã hủy", tone: "gray" },
  [PaymentStatus.EXPIRED]: { label: "Hết hạn", tone: "orange" },
};

const STATUS_TONE: Record<"emerald" | "amber" | "rose" | "gray" | "orange", string> = {
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400",
  gray: "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-300",
  orange:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
};

const STATUS_DOT: Record<"emerald" | "amber" | "rose" | "gray" | "orange", string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  gray: "bg-gray-400",
  orange: "bg-orange-500",
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

const getPaymentMethodText = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.ONLINE_BANKING:
      return "Chuyển khoản ngân hàng";
    default:
      return method;
  }
};

const getPaymentGatewayText = (gateway: PaymentGateWay) => {
  switch (gateway) {
    case PaymentGateWay.PAYOS:
      return "PayOS";
    default:
      return gateway;
  }
};

export const PaymentDetailModal = ({
  payment,
  onClose,
  onDelete,
}: PaymentDetailModalProps) => {
  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const statusCfg = STATUS_CONFIG[payment.paymentStatus] ?? STATUS_CONFIG.PENDING;
  const productName = payment.courseTitle || payment.subscriptionPlanName;
  const productLabel = payment.courseTitle ? "Khóa học" : "Gói đăng ký";
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(payment.totalPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                Chi tiết thanh toán
              </h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span className="font-mono tabular-nums">{payment.paymentCode}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
            {/* Hero amount */}
            <div className="border-b border-border bg-gradient-to-br from-accent/5 to-transparent px-5 py-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Số tiền giao dịch
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                    {formattedAmount}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_TONE[statusCfg.tone]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[statusCfg.tone]}`}
                    />
                    {statusCfg.label}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TYPE_TONE[payment.transactionType]}`}
                  >
                    {TYPE_LABEL[payment.transactionType] ?? payment.transactionType}
                  </span>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="divide-y divide-border">
              {/* User */}
              <Section
                icon={<User className="h-3.5 w-3.5" />}
                title="Thông tin người dùng"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Tên người dùng" value={payment.userName} />
                  <Field
                    label="Email"
                    value={payment.userEmail}
                    icon={<Mail className="h-3.5 w-3.5 text-muted-foreground" />}
                    breakAll
                  />
                </div>
              </Section>

              {/* Transaction info */}
              <Section
                icon={<CreditCard className="h-3.5 w-3.5" />}
                title="Thông tin giao dịch"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Phương thức"
                    value={getPaymentMethodText(payment.paymentMethod)}
                    icon={<Wallet className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                  <Field
                    label="Cổng thanh toán"
                    value={getPaymentGatewayText(payment.paymentGateway)}
                  />
                  <Field
                    label="Loại giao dịch"
                    value={TYPE_LABEL[payment.transactionType] ?? payment.transactionType}
                  />
                </div>
              </Section>

              {/* Product */}
              {productName && (
                <Section
                  icon={<Package className="h-3.5 w-3.5" />}
                  title="Sản phẩm"
                >
                  <Field label={productLabel} value={productName} />
                </Section>
              )}

              {/* Description */}
              {payment.description && (
                <Section
                  icon={<ScrollText className="h-3.5 w-3.5" />}
                  title="Mô tả"
                >
                  <p className="text-sm leading-relaxed text-foreground">
                    {payment.description}
                  </p>
                </Section>
              )}

              {/* Timeline */}
              <Section
                icon={<Calendar className="h-3.5 w-3.5" />}
                title="Thời gian"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Ngày tạo"
                    value={formatApiDate(payment.createdAt)}
                    mono
                  />
                  <Field
                    label="Cập nhật lần cuối"
                    value={formatApiDate(payment.updatedAt)}
                    mono
                  />
                </div>
              </Section>
            </div>

            {/* Footer action if EXPIRED */}
            {payment.paymentStatus === PaymentStatus.EXPIRED && onDelete && (
              <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/10 px-5 py-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(payment);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa giao dịch hết hạn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  icon,
  breakAll,
  mono,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  breakAll?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        {icon}
        <p
          className={`text-sm font-medium text-foreground ${breakAll ? "break-all" : ""
            } ${mono ? "font-mono tabular-nums" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
