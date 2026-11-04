"use client";

import { ExerciseSummaryResponse } from '@/types/exercise';
import { ExerciseTypeBadge, DifficultyBadge } from './ExerciseBadges';
import { formatReadableDate } from '@/utils/dateUtils';
import { useI18n } from '@/contexts/I18nContext';
import { Clock, Award, ArrowRight } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseSummaryResponse;
  onClick: (slug: string) => void;
}

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const { t } = useI18n();

  return (
    <article
      onClick={() => onClick(exercise.slug)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5 cursor-pointer"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#171717] dark:text-white line-clamp-2 group-hover:text-[#FF5A1F] transition-colors leading-snug">
              {exercise.title}
            </h3>
          </div>
          <div className="shrink-0">
            <DifficultyBadge difficulty={exercise.difficulty} />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {exercise.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <ExerciseTypeBadge type={exercise.exerciseType} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-semibold text-[#64748B] dark:text-slate-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-[#FF5A1F]" />
            <span>{exercise.timeLimit} {t("exercisesPage.timeSuffix")}</span>
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1.5 text-emerald-500" />
            <span>{exercise.maxScore} {t("exercisesPage.pointsSuffix")}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3.5 border-t border-[#E8E8E8] dark:border-border flex items-center justify-between">
        <span className="text-xs text-[#64748B] dark:text-slate-400">
          {formatReadableDate(exercise.publishedAt)}
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A1F] group-hover:text-[#e04b16] transition-colors">
          <span>{t("exercisesPage.btnSolve")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </article>
  );
}
