export interface ToneStyle {
  pill: string;
}

export const getLevelTone = (level?: string): ToneStyle => {
  switch (level) {
    case "INTERN":
      return {
        pill:
          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600",
      };
    case "FRESHER":
      return {
        pill:
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/40",
      };
    case "JUNIOR":
      return {
        pill:
          "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-800/40",
      };
    case "MIDDLE":
      return {
        pill:
          "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-800/40",
      };
    case "SENIOR":
      return {
        pill:
          "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/40",
      };
    default:
      return {
        pill:
          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600",
      };
  }
};

export const getDifficultyTone = (difficulty?: string): ToneStyle => {
  switch (difficulty) {
    case "EASY":
      return {
        pill:
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/40",
      };
    case "MEDIUM":
      return {
        pill:
          "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/40",
      };
    case "HARD":
      return {
        pill:
          "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800/40",
      };
    default:
      return {
        pill:
          "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600",
      };
  }
};

export const LEVEL_LABELS: Record<string, string> = {
  INTERN: "Intern",
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MIDDLE: "Middle",
  SENIOR: "Senior",
};

export const LEVEL_OPTIONS = [
  "all",
  "INTERN",
  "FRESHER",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
] as const;
export type LevelOption = (typeof LEVEL_OPTIONS)[number];
