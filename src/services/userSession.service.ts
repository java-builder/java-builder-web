import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { UserSessionDetailResponse, UserSessionStatisticsResponse } from "@/types/userSession";
import { API } from "@/api/api";

export const userSessionService = {
  getMySessions: async (page: number = 1, size: number = 20) => {
    const response = await apiClient.get<ApiResponse<PageResponse<UserSessionDetailResponse>>>(
      API.USER_SESSION_MY,
      { params: { page, size } }
    );
    return response.data;
  },

  revokeSession: async (sessionId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.GET_USER_SESSIONS}/${sessionId}`
    );
    return response.data;
  },

  getUserSessions: async (page: number = 1, size: number = 20, filters?: string) => {
    const response = await apiClient.get<ApiResponse<PageResponse<UserSessionDetailResponse>>>(
      API.GET_USER_SESSIONS,
      { params: { page, size, filters } }
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<UserSessionStatisticsResponse>>(
      API.USER_SESSION_STATISTICS
    );
    return response.data;
  },
};
