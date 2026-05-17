import { useState, useCallback } from 'react';
import { ExerciseFilters } from '@/types/exercise';

const DEFAULT_PAGE_SIZE = 12;

export const useExerciseFilters = (initialFilters?: Partial<ExerciseFilters>) => {
  const [filters, setFilters] = useState<ExerciseFilters>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    ...initialFilters,
  });

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<ExerciseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 when filters change
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return {
    filters,
    handlePageChange,
    handleFilterChange,
    resetFilters,
  };
};
