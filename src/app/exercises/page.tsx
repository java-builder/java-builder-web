"use client";

import { useMemo } from 'react';
import { useExercises } from '@/hooks/useExercises';
import { useExerciseFilters } from '@/hooks/useExerciseFilters';
import { useExerciseNavigation } from '@/hooks/useExerciseNavigation';
import { ExerciseStatus } from '@/types/exercise';
import { Pagination } from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ExerciseListHeader from '@/components/exercises/ExerciseListHeader';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import ExerciseEmptyState from '@/components/exercises/ExerciseEmptyState';
import { getRandomQuote } from '@/utils/motivationalQuotes';
import { useI18n } from '@/contexts/I18nContext';

export default function ExercisesPage() {
  const { t } = useI18n();
  // Custom hooks
  const { filters, handlePageChange } = useExerciseFilters();
  const { navigateToExercise } = useExerciseNavigation();
  const { data: exercisesData, isLoading } = useExercises(filters);

  // Get motivational quote
  const quote = useMemo(() => getRandomQuote(), []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Lọc chỉ bài tập đã published
  const publishedExercises = exercisesData?.data?.filter(
    exercise => exercise.status === ExerciseStatus.PUBLISHED
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-900">
      {/* Header */}
      <ExerciseListHeader totalExercises={exercisesData?.totalElements || 0} quote={quote} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Danh sách bài tập */}
        {publishedExercises.length > 0 ? (
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
              <div className="flex justify-center">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                  <Pagination
                    currentPage={exercisesData.currentPage}
                    totalPages={exercisesData.totalPages}
                    totalElements={exercisesData.totalElements}
                    pageSize={exercisesData.pageSize}
                    onPageChange={handlePageChange}
                    itemName={t("exercisesPage.exerciseItemName")}
                  />
                </div>
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