import type { JobStatus, JobType } from "@/types/scheduled-job";

export type Tone = "amber" | "blue" | "emerald" | "rose" | "gray";

export const STATUS_LABELS: Record<JobStatus, string> = {
  PENDING: "Chờ chạy",
  RUNNING: "Đang chạy",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

export const STATUS_TONE: Record<JobStatus, Tone> = {
  PENDING: "amber",
  RUNNING: "blue",
  COMPLETED: "emerald",
  FAILED: "rose",
  CANCELLED: "gray",
};

export const TONE_BADGE: Record<Tone, string> = {
  amber:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800",
  blue: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800",
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800",
  rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-800",
  gray: "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-700 dark:text-gray-300",
};

export const TONE_DOT: Record<Tone, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  gray: "bg-gray-400",
};

export const TONE_VALUE_TEXT: Record<Tone, string> = {
  amber: "text-amber-600 dark:text-amber-400",
  blue: "text-blue-600 dark:text-blue-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  rose: "text-rose-600 dark:text-rose-400",
  gray: "text-gray-700 dark:text-gray-300",
};

export const JOB_TYPES: { value: JobType | ""; label: string }[] = [
  { value: "", label: "Tất cả loại" },
  { value: "EMAIL", label: "Email" },
  { value: "NOTIFICATION", label: "Notification" },
  { value: "REPORT", label: "Report" },
  { value: "CLEANUP", label: "Cleanup" },
  { value: "SYNC", label: "Sync" },
];

export const formatJobDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
