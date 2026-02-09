import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { UserSession, UserSessionStatistics } from "@/types/session";
import { API } from "@/api/api";

export interface UserSessionSearchParams {
  page?: number;
  size?: number;
  filters?: string;
}

export const userSessionApi = {
  getUserSessions: async (params: UserSessionSearchParams = {}) => {
    const queryParams: Record<string, string | number> = {
      page: params.page || 1,
      size: params.size || 20,
    };

    if (params.filters) {
      queryParams.filters = params.filters;
    }

    const response = await apiClient.get<
      ApiResponse<PageResponse<UserSession>>
    >(API.GET_USER_SESSIONS, {
      params: queryParams,
    });
    return response.data;
  },

  revokeSession: async (sessionId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`${API.REVOKE_SESSION}/${sessionId}`);
    return response.data;
  },

  revokeAllUserSessions: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/v1/tokens/users/${userId}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get<ApiResponse<UserSessionStatistics>>('/api/v1/user-sessions/statistics');
    return response.data;
  },
};
