import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { UserSession } from "@/types/session";

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

    console.log("Calling API:", "/api/v1/user-sessions", queryParams);

    try {
      const response = await apiClient.get<
        ApiResponse<PageResponse<UserSession>>
      >("/api/v1/user-sessions", {
        params: queryParams,
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
