"use client";

import { ExerciseSummaryResponse } from '@/types/exercise';
import { ExerciseTypeBadge, DifficultyBadge } from './ExerciseBadges';
import { formatReadableDate } from '@/utils/dateUtils';
import { useI18n } from '@/contexts/I18nContext';

interface ExerciseCardProps {
  exercise: ExerciseSummaryResponse;
  onClick: (slug: string) => void;
}

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const { t } = useI18n();

  return (
    <div
      onClick={() => onClick(exercise.slug)}
      className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-cyan-500 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
              {exercise.title}
            </h3>
          </div>
          <DifficultyBadge difficulty={exercise.difficulty} />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 leading-relaxed">
          {exercise.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <ExerciseTypeBadge type={exercise.exerciseType} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-slate-300">
            <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{exercise.timeLimit}</span>
            <span className="ml-1">{t("exercisesPage.timeSuffix")}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-slate-300">
            <svg className="w-4 h-4 mr-2 text-green-500 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="font-medium">{exercise.maxScore}</span>
            <span className="ml-1">{t("exercisesPage.pointsSuffix")}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="text-xs text-gray-500 dark:text-slate-400">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatReadableDate(exercise.publishedAt)}
          </div>
          
          <div className="flex items-center text-blue-600 dark:text-cyan-300 group-hover:text-blue-700 dark:group-hover:text-cyan-200 font-medium text-sm transition-colors">
            <span>{t("exercisesPage.btnSolve")}</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
