import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useExerciseNavigation = () => {
  const router = useRouter();

  const navigateToExercise = useCallback((slug: string) => {
    router.push(`/exercises/${slug}`);
  }, [router]);

  const navigateToExerciseList = useCallback(() => {
    router.push('/exercises');
  }, [router]);

  const navigateToExerciseDetail = useCallback((id: string) => {
    router.push(`/exercises/${id}`);
  }, [router]);

  return {
    navigateToExercise,
    navigateToExerciseList,
    navigateToExerciseDetail,
  };
};
