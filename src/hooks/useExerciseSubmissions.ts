import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseSubmissionApi } from '@/services/exercise-submission.service';
import { ExerciseSubmissionRequest, ExerciseSubmissionFilters } from '@/types/exercise-submission';
import { toast } from 'react-hot-toast';

/**
 * Hook to get exercise submissions for admin (with filters)
 */
export const useExerciseSubmissions = (filters: ExerciseSubmissionFilters = {}) => {
  return useQuery({
    queryKey: ['exercise-submissions', filters],
    queryFn: () => exerciseSubmissionApi.getExerciseSubmissions(filters),
    select: (data) => data.data,
  });
};

/**
 * Hook to start an exercise
 */
export const useStartExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => exerciseSubmissionApi.startExercise(exerciseId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['exercise-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['my-exercises'] });
      toast.success(response.message || 'Bắt đầu bài tập thành công!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu bài tập');
    },
  });
};

/**
 * Hook to submit exercise answers
 */
export const useSubmitExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: string; data: ExerciseSubmissionRequest }) =>
      exerciseSubmissionApi.submitExercise(submissionId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['exercise-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['my-exercises'] });
      queryClient.invalidateQueries({ queryKey: ['my-statistics'] });
      toast.success(response.message || 'Nộp bài thành công!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
    },
  });
};

/**
 * Hook to get my exercise submissions (student view)
 */
export const useMyExercises = (page: number = 1, size: number = 20) => {
  return useQuery({
    queryKey: ['my-exercises', page, size],
    queryFn: () => exerciseSubmissionApi.getMyExercises(page, size),
    select: (data) => data.data,
  });
};

/**
 * Hook to get my exercise statistics (student view)
 */
export const useMyStatistics = () => {
  return useQuery({
    queryKey: ['my-statistics'],
    queryFn: () => exerciseSubmissionApi.getMyStatistics(),
    select: (data) => data.data,
  });
};

/**
 * Hook to get submission by ID
 */
export const useSubmissionById = (submissionId: string) => {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => exerciseSubmissionApi.getSubmissionById(submissionId),
    select: (data) => data.data,
    enabled: !!submissionId,
  });
};

/**
 * Hook to get user's submissions for a specific exercise
 */
export const useUserExerciseSubmissions = (
  userId: string,
  exerciseId: string,
  page: number = 1,
  size: number = 20
) => {
  return useQuery({
    queryKey: ['user-exercise-submissions', userId, exerciseId, page, size],
    queryFn: () => exerciseSubmissionApi.getUserExerciseSubmissions(userId, exerciseId, page, size),
    select: (data) => data.data,
    enabled: !!userId && !!exerciseId,
  });
};
