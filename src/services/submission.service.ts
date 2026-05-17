import { apiClient } from '@/api/axios';
import { API } from '@/api/api';
import { 
  ExerciseSubmissionResponse, 
  ExerciseSubmissionRequest
} from '@/types/submission';
import { ApiResponse } from '@/types/api';

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
  }
};
