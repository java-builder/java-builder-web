"use client";

import { ExerciseType, Difficulty } from '@/types/exercise';
import { useI18n } from '@/contexts/I18nContext';

interface ExerciseTypeBadgeProps {
  type: ExerciseType;
}

export const ExerciseTypeBadge = ({ type }: ExerciseTypeBadgeProps) => {
  const { t } = useI18n();

  const colors = {
    [ExerciseType.MULTIPLE_CHOICE]: 'bg-[#FFF0E8] text-[#FF5A1F] border-[#FFD8C7] dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
    [ExerciseType.ESSAY]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    [ExerciseType.CODING]: 'bg-[#26344D]/10 text-[#26344D] border-[#26344D]/20 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  };

  const labels = {
    [ExerciseType.MULTIPLE_CHOICE]: t("exercisesPage.typeMultipleChoice"),
    [ExerciseType.ESSAY]: t("exercisesPage.typeEssay"),
    [ExerciseType.CODING]: t("exercisesPage.typeCoding"),
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
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colors[type]}`}>
      {icons[type]}
      {labels[type]}
    </span>
  );
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  const { t } = useI18n();

  const colors = {
    [Difficulty.EASY]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    [Difficulty.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    [Difficulty.HARD]: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
  };

  const labels = {
    [Difficulty.EASY]: t("exercisesPage.filterEasy"),
    [Difficulty.MEDIUM]: t("exercisesPage.filterMedium"),
    [Difficulty.HARD]: t("exercisesPage.filterHard"),
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};
