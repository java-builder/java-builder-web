import { SubmissionStatus } from "@/types/exercise-submission";

export type StatusTone = "emerald" | "blue" | "rose" | "amber";

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; tone: StatusTone }
> = {
  PASSED: { label: "Đạt yêu cầu", tone: "emerald" },
  COMPLETED: { label: "Hoàn thành", tone: "blue" },
  FAILED: { label: "Chưa đạt", tone: "rose" },
  IN_PROGRESS: { label: "Đang làm", tone: "amber" },
};

export const TONE_BADGE: Record<StatusTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
};

export const TONE_DOT: Record<StatusTone, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

export function getScoreTone(percentage: number): string {
  if (percentage >= 80) return "text-emerald-600";
  if (percentage >= 50) return "text-blue-600";
  return "text-rose-600";
}
