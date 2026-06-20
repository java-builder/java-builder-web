import { ExerciseStatus, ExerciseType, Difficulty } from "@/types/exercise";

interface ExerciseTypeBadgeProps {
  type: ExerciseType;
}

export const ExerciseTypeBadge = ({ type }: ExerciseTypeBadgeProps) => {
  const colors: Record<ExerciseType, string> = {
    [ExerciseType.MULTIPLE_CHOICE]: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    [ExerciseType.ESSAY]: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    [ExerciseType.CODING]: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  };

  const labels: Record<ExerciseType, string> = {
    [ExerciseType.MULTIPLE_CHOICE]: "Trắc nghiệm",
    [ExerciseType.ESSAY]: "Tự luận",
    [ExerciseType.CODING]: "Lập trình",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type]}`}>
      {labels[type]}
    </span>
  );
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const colors: Record<Difficulty, string> = {
    [Difficulty.EASY]: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    [Difficulty.MEDIUM]: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    [Difficulty.HARD]: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const labels: Record<Difficulty, string> = {
    [Difficulty.EASY]: "Dễ",
    [Difficulty.MEDIUM]: "Trung bình",
    [Difficulty.HARD]: "Khó",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};

interface ExerciseStatusBadgeProps {
  status: ExerciseStatus;
}

export const ExerciseStatusBadge = ({ status }: ExerciseStatusBadgeProps) => {
  const colors: Record<ExerciseStatus, string> = {
    [ExerciseStatus.DRAFT]: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    [ExerciseStatus.PUBLISHED]: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    [ExerciseStatus.ARCHIVED]: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };

  const labels: Record<ExerciseStatus, string> = {
    [ExerciseStatus.DRAFT]: "Nháp",
    [ExerciseStatus.PUBLISHED]: "Đã xuất bản",
    [ExerciseStatus.ARCHIVED]: "Đã lưu trữ",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};
