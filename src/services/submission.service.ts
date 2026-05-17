import { apiClient } from '@/api/axios';
import { API } from '@/api/api';
import { 
  ExerciseSubmissionResponse, 
  ExerciseSubmissionRequest,
  ExerciseSubmissionSummaryResponse,
  ExerciseSubmissionStatisticsResponse
} from '@/types/submission';
import { ApiResponse, PageResponse } from '@/types/api';

export const submissionApi = {
  // Bắt đầu làm bài tập
  startExercise: async (exerciseId: string): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
    const response = await apiClient.post(`${API.START_EXERCISE}/${exerciseId}/start`);
    return response.data;
  },

  // Nộp bài tập
  submitExercise: async (data: ExerciseSubmissionRequest): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
    const response = await apiClient.post(`${API.SUBMIT_EXERCISE}/${data.submissionId}/submit`, {
      answers: data.answers
    });
    return response.data;
  },

  // Xem kết quả submission
  getSubmissionResult: async (submissionId: string): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
    const response = await apiClient.get(`${API.START_EXERCISE}/${submissionId}`);
    return response.data;
  },

  // Lấy danh sách bài tập đã làm
  getMyExercises: async (page: number = 1): Promise<ApiResponse<PageResponse<ExerciseSubmissionSummaryResponse>>> => {
    const response = await apiClient.get(`${API.MY_EXERCISES}?page=${page}`);
    return response.data;
  },

  // Lấy thống kê tổng hợp
  getMyStatistics: async (): Promise<ApiResponse<ExerciseSubmissionStatisticsResponse>> => {
    const response = await apiClient.get(API.MY_STATISTICS);
    return response.data;
  }
};
