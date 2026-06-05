import { CourseLevel } from "@/types/course";

export interface LevelTone {
  pill: string;
}

export const getLevelTone = (level?: CourseLevel): LevelTone => {
  switch (level) {
    case CourseLevel.BEGINNER:
      return {
        pill:
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40",
      };
    case CourseLevel.INTERMEDIATE:
      return {
        pill:
          "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/40",
      };
    case CourseLevel.ADVANCED:
      return {
        pill:
          "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40",
      };
    case CourseLevel.EXPERT:
      return {
        pill:
          "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-800/40",
      };
    default:
      return {
        pill:
          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:ring-slate-600",
      };
  }
};

export const getProgressTone = (progress: number): string => {
  if (progress >= 100) return "bg-emerald-500";
  if (progress >= 50) return "bg-accent";
  if (progress > 0) return "bg-amber-500";
  return "bg-gray-300 dark:bg-slate-600";
};
