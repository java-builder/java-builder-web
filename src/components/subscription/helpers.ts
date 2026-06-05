import { CheckCircle2, Clock, XCircle, type LucideIcon } from "lucide-react";

export interface StatusTone {
  pill: string;
  dot: string;
  icon: LucideIcon;
}

export const getSubscriptionStatusTone = (
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | string
): StatusTone => {
  switch (status) {
    case "ACTIVE":
      return {
        pill:
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
      };
    case "EXPIRED":
      return {
        pill:
          "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40",
        dot: "bg-rose-500",
        icon: XCircle,
      };
    case "CANCELLED":
    default:
      return {
        pill:
          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:ring-slate-600",
        dot: "bg-gray-400",
        icon: Clock,
      };
  }
};

export const getDaysLeftTone = (days: number): string => {
  if (days <= 0) return "text-rose-600 dark:text-rose-400";
  if (days <= 7) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
};
