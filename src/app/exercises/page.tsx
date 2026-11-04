"use client";

import { useMemo } from 'react';
import { useExercises } from '@/hooks/useExercises';
import { useExerciseFilters } from '@/hooks/useExerciseFilters';
import { useExerciseNavigation } from '@/hooks/useExerciseNavigation';
import { ExerciseStatus } from '@/types/exercise';
import { Pagination } from '@/components/ui/pagination';
import ExerciseListHeader from '@/components/exercises/ExerciseListHeader';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import ExerciseEmptyState from '@/components/exercises/ExerciseEmptyState';
import { getRandomQuote } from '@/utils/motivationalQuotes';
import { useI18n } from '@/contexts/I18nContext';

export default function ExercisesPage() {
  const { t } = useI18n();
  const { filters, handlePageChange } = useExerciseFilters();
  const { navigateToExercise } = useExerciseNavigation();
  const { data: exercisesData, isLoading } = useExercises(filters);

  const quote = useMemo(() => getRandomQuote(), []);

  const publishedExercises = exercisesData?.data?.filter(
    exercise => exercise.status === ExerciseStatus.PUBLISHED
  ) || [];

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background transition-colors pb-16">
      {/* Header */}
      <ExerciseListHeader totalExercises={isLoading ? 0 : (exercisesData?.totalElements || 0)} quote={quote} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Danh sách bài tập */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-surface rounded-2xl shadow-xs border border-[#E8E8E8] dark:border-border overflow-hidden p-6 space-y-4 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                </div>
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E8] dark:border-border">
                  <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-24" />
                  <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : publishedExercises.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {publishedExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={navigateToExercise}
                />
              ))}
            </div>

            {/* Pagination */}
            {exercisesData && exercisesData.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={exercisesData.currentPage}
                  totalPages={exercisesData.totalPages}
                  totalElements={exercisesData.totalElements}
                  pageSize={exercisesData.pageSize}
                  onPageChange={handlePageChange}
                  itemName={t("exercisesPage.exerciseItemName")}
                />
              </div>
            )}
          </>
        ) : (
          <ExerciseEmptyState />
        )}
      </div>
    </div>
  );
}
