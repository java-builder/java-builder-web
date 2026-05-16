import { apiClient } from '@/api/axios';
import { API } from '@/api/api';
import { 
  CreateExerciseRequest, 
  CreateExerciseResponse, 
  ExerciseSummary, 
  ExerciseFilters,
  ExerciseDetail,
  SubmitExerciseRequest
} from '@/types/exercise';
import { ApiResponse, PageResponse } from '@/types/api';

export const exerciseApi = {
  // Tạo bài tập mới (Admin only)
  createExercise: async (data: CreateExerciseRequest): Promise<ApiResponse<CreateExerciseResponse>> => {
    const response = await apiClient.post(API.CREATE_EXERCISE, data);
    return response.data;
  },

  // Lấy danh sách bài tập với phân trang và tìm kiếm
  getExercises: async (filters: ExerciseFilters = {}): Promise<ApiResponse<PageResponse<ExerciseSummary>>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.title) params.append('title', filters.title);
    if (filters.exerciseType) params.append('exerciseType', filters.exerciseType);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);

    const response = await apiClient.get(`${API.GET_EXERCISES}?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết bài tập theo slug
  getExerciseBySlug: async (slug: string): Promise<ApiResponse<ExerciseDetail>> => {
    const response = await apiClient.get(`${API.GET_EXERCISES}/${slug}`);
    return response.data;
  },

  // Nộp bài tập
  submitExercise: async (data: SubmitExerciseRequest): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(API.SUBMIT_EXERCISE, data);
    return response.data;
  }
};