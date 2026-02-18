import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { UserSessionDetailResponse, UserSessionStatisticsResponse } from "@/types/userSession";

const API_BASE = "/api/v1/user-sessions";

export const userSessionService = {
  getMySessions: async (page: number = 1, size: number = 20) => {
    const response = await apiClient.get<ApiResponse<PageResponse<UserSessionDetailResponse>>>(
      `${API_BASE}/me`,
      { params: { page, size } }
    );
    return response.data;
  },

  revokeSession: async (sessionId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API_BASE}/${sessionId}`
    );
    return response.data;
  },

  getUserSessions: async (page: number = 1, size: number = 20, filters?: string) => {
    const response = await apiClient.get<ApiResponse<PageResponse<UserSessionDetailResponse>>>(
      API_BASE,
      { params: { page, size, filters } }
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<UserSessionStatisticsResponse>>(
      `${API_BASE}/statistics`
    );
    return response.data;
  },
};
