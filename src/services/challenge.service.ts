import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import { EnrolledStudentResponse } from "@/types/enrollment";
import {
  ChallengeResponse,
  ChallengeDetailResponse,
  ChallengePhaseResponse,
  ChallengeDayResponse,
  ChallengeDayDetailResponse,
  ChallengeTaskResponse,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  CreateChallengePhaseRequest,
  UpdateChallengePhaseRequest,
  CreateChallengeDayRequest,
  UpdateChallengeDayRequest,
  CreateChallengeTaskRequest,
  UpdateChallengeTaskRequest,
  ChallengeStatus,
  ChallengeProgressResponse,
} from "@/types/challenge";

export const challengeService = {
  // CHALLENGES
  getChallenges: async (status?: ChallengeStatus, page = 1, size = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<ChallengeResponse>>>(API.CHALLENGES, {
      params: { status, page, size },
    });
    return response.data;
  },

  getChallengeById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ChallengeResponse>>(API.CHALLENGE_BY_ID(id));
    return response.data;
  },

  getChallengeBySlug: async (slug: string, day?: number) => {
    const response = await apiClient.get<ApiResponse<ChallengeDetailResponse>>(API.CHALLENGE_BY_SLUG(slug), {
      params: day ? { day } : undefined,
    });
    return response.data;
  },

  createChallenge: async (data: CreateChallengeRequest) => {
    const response = await apiClient.post<ApiResponse<ChallengeResponse>>(API.CHALLENGES, data);
    return response.data;
  },

  updateChallenge: async (id: string, data: UpdateChallengeRequest) => {
    const response = await apiClient.put<ApiResponse<ChallengeResponse>>(API.CHALLENGE_BY_ID(id), data);
    return response.data;
  },

  deleteChallenge: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(API.CHALLENGE_BY_ID(id));
    return response.data;
  },

  // PHASES
  createPhase: async (data: CreateChallengePhaseRequest) => {
    const response = await apiClient.post<ApiResponse<ChallengePhaseResponse>>(API.CHALLENGE_PHASES, data);
    return response.data;
  },

  updatePhase: async (id: string, data: UpdateChallengePhaseRequest) => {
    const response = await apiClient.put<ApiResponse<ChallengePhaseResponse>>(API.CHALLENGE_PHASE_BY_ID(id), data);
    return response.data;
  },

  deletePhase: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(API.CHALLENGE_PHASE_BY_ID(id));
    return response.data;
  },

  getPhasesByChallengeId: async (challengeId: string) => {
    const response = await apiClient.get<ApiResponse<ChallengePhaseResponse[]>>(API.CHALLENGE_PHASES_BY_CHALLENGE(challengeId));
    return response.data;
  },

  getPhaseDetailById: async (phaseId: string) => {
    const response = await apiClient.get<ApiResponse<ChallengePhaseResponse>>(API.CHALLENGE_PHASE_BY_ID(phaseId));
    return response.data;
  },

  // DAYS
  createDay: async (data: CreateChallengeDayRequest) => {
    const response = await apiClient.post<ApiResponse<ChallengeDayResponse>>(API.CHALLENGE_DAYS, data);
    return response.data;
  },

  updateDay: async (id: string, data: UpdateChallengeDayRequest) => {
    const response = await apiClient.put<ApiResponse<ChallengeDayResponse>>(API.CHALLENGE_DAY_BY_ID(id), data);
    return response.data;
  },

  deleteDay: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(API.CHALLENGE_DAY_BY_ID(id));
    return response.data;
  },

  getDaysByChallengeId: async (challengeId: string) => {
    const response = await apiClient.get<ApiResponse<ChallengeDayResponse[]>>(API.CHALLENGE_DAYS_BY_CHALLENGE(challengeId));
    return response.data;
  },

  // TASKS
  createTask: async (data: CreateChallengeTaskRequest) => {
    const response = await apiClient.post<ApiResponse<ChallengeTaskResponse>>(API.CHALLENGE_TASKS, data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateChallengeTaskRequest) => {
    const response = await apiClient.put<ApiResponse<ChallengeTaskResponse>>(API.CHALLENGE_TASK_BY_ID(id), data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(API.CHALLENGE_TASK_BY_ID(id));
    return response.data;
  },

  getTasksByDayId: async (dayId: string) => {
    const response = await apiClient.get<ApiResponse<ChallengeTaskResponse[]>>(API.CHALLENGE_TASKS_BY_DAY(dayId));
    return response.data;
  },

  // PROGRESS (PERSISTED TO DB)
  getProgress: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<ChallengeProgressResponse>>(
      API.CHALLENGE_PROGRESS_BY_SLUG(slug)
    );
    return response.data;
  },

  toggleTask: async (taskId: string) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      API.CHALLENGE_PROGRESS_TOGGLE_TASK(taskId)
    );
    return response.data;
  },

  completeDay: async (slug: string, dayNumber: number, completed?: boolean) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      API.CHALLENGE_PROGRESS_COMPLETE_DAY(slug, dayNumber),
      null,
      completed !== undefined ? { params: { completed } } : undefined
    );
    return response.data;
  },

  getDayDetailById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ChallengeDayDetailResponse>>(
      API.CHALLENGE_DAY_BY_ID(id)
    );
    return response.data;
  },

  checkEnrollment: async (challengeId: string) => {
    const response = await apiClient.get<ApiResponse<boolean>>(
      API.CHALLENGE_ENROLLMENT_CHECK(challengeId)
    );
    return response.data;
  },

  enrollFree: async (challengeId: string) => {
    const response = await apiClient.post<ApiResponse<void>>(
      API.CHALLENGE_ENROLL_FREE(challengeId)
    );
    return response.data;
  },

  getChallengeEnrollments: async (
    challengeId: string,
    page: number = 1,
    size: number = 20,
    search?: string
  ) => {
    const response = await apiClient.get<ApiResponse<PageResponse<EnrolledStudentResponse>>>(
      API.CHALLENGE_ENROLLMENT_STUDENTS(challengeId),
      {
        params: {
          page,
          size,
          ...(search ? { search } : {}),
        },
      }
    );
    return response.data;
  },

  unenrollStudent: async (enrollmentId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      API.CHALLENGE_UNENROLL(enrollmentId)
    );
    return response.data;
  },
};
