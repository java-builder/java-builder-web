import {
  CheckCircle2,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export interface StatusTone {
  pill: string;
  dot: string;
  icon: LucideIcon;
}

export const getStatusTone = (status: string): StatusTone => {
  switch (status) {
    case "APPROVED":
      return {
        pill:
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
      };
    case "REJECTED":
      return {
        pill:
          "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40",
        dot: "bg-rose-500",
        icon: XCircle,
      };
    case "PENDING":
    default:
      return {
        pill:
          "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/40",
        dot: "bg-amber-500",
        icon: Clock,
      };
  }
};

export const getDifficultyTone = (difficulty: string): string => {
  switch (difficulty) {
    case "EASY":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800/40";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/40";
    case "HARD":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40";
    default:
      return "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:ring-slate-600";
  }
};

export const LEVEL_LABELS: Record<string, string> = {
  INTERN: "Intern",
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MIDDLE: "Middle",
  SENIOR: "Senior",
};
