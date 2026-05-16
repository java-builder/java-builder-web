import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseApi } from '@/services/exercise.service';
import { CreateExerciseRequest, ExerciseFilters } from '@/types/exercise';
import { toast } from 'react-hot-toast';

export const useExercises = (filters: ExerciseFilters = {}) => {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => exerciseApi.getExercises(filters),
    select: (data) => data.data,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseRequest) => exerciseApi.createExercise(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success(response.message || 'Tạo bài tập thành công!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo bài tập');
    },
  });
};