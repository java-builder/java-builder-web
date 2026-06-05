import { apiClient } from '@/api/axios';
import { API } from '@/api/api';
import { ApiResponse, PageResponse } from '@/types/api';
import {
  ExerciseSubmissionRequest,
  ExerciseSubmissionResponse,
  ExerciseSubmissionSummaryResponse,
  ExerciseSubmissionStatisticsResponse,
  ExerciseSubmissionOverviewResponse,
  ExerciseSubmissionDetailResponse,
  ExerciseSubmissionFilters
} from '@/types/exercise-submission';

export const exerciseSubmissionApi = {
  /**
   * Start an exercise - Create a new submission
   * POST /api/v1/exercise-submission/{exerciseId}/start
   */
  startExercise: async (exerciseId: string): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
    const response = await apiClient.post(`${API.START_EXERCISE}/${exerciseId}/start`);
    return response.data;
  },

  /**
   * Submit exercise answers
   * POST /api/v1/exercise-submission/{submissionId}/submit
   */
  submitExercise: async (
    submissionId: string,
    data: ExerciseSubmissionRequest
  ): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
    const response = await apiClient.post(`${API.SUBMIT_EXERCISE}/${submissionId}/submit`, data);
    return response.data;
  },

  /**
   * Get my exercise submissions (student view)
   * GET /api/v1/exercise-submission/my-exercises
   */
  getMyExercises: async (
    page: number = 1,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<ExerciseSubmissionSummaryResponse>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await apiClient.get(`${API.MY_EXERCISES}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get my exercise statistics (student view)
   * GET /api/v1/exercise-submission/my-statistics
   */
  getMyStatistics: async (): Promise<ApiResponse<ExerciseSubmissionStatisticsResponse>> => {
    const response = await apiClient.get(API.MY_STATISTICS);
    return response.data;
  },

  /**
   * Get all exercise submissions with filters (admin view)
   * GET /api/v1/exercise-submission
   */
  getExerciseSubmissions: async (
    filters: ExerciseSubmissionFilters = {}
  ): Promise<ApiResponse<PageResponse<ExerciseSubmissionOverviewResponse>>> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.exerciseTitle) params.append('exerciseTitle', filters.exerciseTitle.trim());
    if (filters.keyword) params.append('keywork', filters.keyword.trim()); // Note: backend uses 'keywork' (typo)

    const response = await apiClient.get(`${API.GET_EXERCISE_SUBMISSIONS}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get submission by ID
   * GET /api/v1/exercise-submission/{submissionId}
   */
  getSubmissionById: async (submissionId: string): Promise<ApiResponse<ExerciseSubmissionDetailResponse>> => {
    const response = await apiClient.get(`${API.GET_SUBMISSION_BY_ID}/${submissionId}`);
    return response.data;
  },

  /**
   * Get user's submissions for a specific exercise
   * GET /api/v1/exercise-submission/users/{userId}/exercise/{exerciseId}
   */
  getUserExerciseSubmissions: async (
    userId: string,
    exerciseId: string,
    page: number = 1,
    size: number = 20
  ): Promise<ApiResponse<PageResponse<ExerciseSubmissionSummaryResponse>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await apiClient.get(
      `${API.GET_USER_EXERCISE_SUBMISSIONS}/${userId}/exercise/${exerciseId}?${params.toString()}`
    );
    return response.data;
  }
};
