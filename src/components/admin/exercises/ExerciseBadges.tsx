import { ExerciseStatus, ExerciseType, Difficulty } from "@/types/exercise";

interface ExerciseTypeBadgeProps {
  type: ExerciseType;
}

export const ExerciseTypeBadge = ({ type }: ExerciseTypeBadgeProps) => {
  const colors: Record<ExerciseType, string> = {
    [ExerciseType.MULTIPLE_CHOICE]: "bg-blue-100 text-blue-800",
    [ExerciseType.ESSAY]: "bg-green-100 text-green-800",
    [ExerciseType.CODING]: "bg-purple-100 text-purple-800",
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
    [Difficulty.EASY]: "bg-green-100 text-green-800",
    [Difficulty.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [Difficulty.HARD]: "bg-red-100 text-red-800",
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
    [ExerciseStatus.DRAFT]: "bg-gray-100 text-gray-800",
    [ExerciseStatus.PUBLISHED]: "bg-green-100 text-green-800",
    [ExerciseStatus.ARCHIVED]: "bg-red-100 text-red-800",
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
