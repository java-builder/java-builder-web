import { ExerciseType, Difficulty } from '@/types/exercise';

interface ExerciseTypeBadgeProps {
  type: ExerciseType;
}

export const ExerciseTypeBadge = ({ type }: ExerciseTypeBadgeProps) => {
  const colors = {
    [ExerciseType.MULTIPLE_CHOICE]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ExerciseType.ESSAY]: 'bg-green-100 text-green-800 border-green-200',
    [ExerciseType.CODING]: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const labels = {
    [ExerciseType.MULTIPLE_CHOICE]: 'Trắc nghiệm',
    [ExerciseType.ESSAY]: 'Tự luận',
    [ExerciseType.CODING]: 'Lập trình',
  };

  const icons = {
    [ExerciseType.MULTIPLE_CHOICE]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    [ExerciseType.ESSAY]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    ),
    [ExerciseType.CODING]: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[type]}`}>
      {icons[type]}
      {labels[type]}
    </span>
  );
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const colors = {
    [Difficulty.EASY]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [Difficulty.MEDIUM]: 'bg-amber-100 text-amber-800 border-amber-200',
    [Difficulty.HARD]: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const labels = {
    [Difficulty.EASY]: 'Dễ',
    [Difficulty.MEDIUM]: 'Trung bình',
    [Difficulty.HARD]: 'Khó',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};
