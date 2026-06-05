export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type StatusTone = "emerald" | "rose" | "gray";

export const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; tone: StatusTone }
> = {
  ACTIVE: { label: "Đang hoạt động", tone: "emerald" },
  EXPIRED: { label: "Hết hạn", tone: "gray" },
  CANCELLED: { label: "Đã hủy", tone: "rose" },
};

export const TONE_BADGE: Record<StatusTone, string> = {
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800",
  rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800",
  gray: "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-300",
};

export const TONE_DOT: Record<StatusTone, string> = {
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  gray: "bg-gray-400",
};

export function getDaysRemainingTone(days: number): string {
  if (days <= 0) return "text-gray-500 dark:text-gray-400";
  if (days <= 7) return "text-rose-600 dark:text-rose-400";
  if (days <= 30) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}
