import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { API } from "@/api/api";
import { ActiveUserResponse } from "@/types/active-user";

export const activeUserService = {
  getActiveUsers: async (page: number = 1, size: number = 20) => {
    const response = await apiClient.get<ApiResponse<PageResponse<ActiveUserResponse>>>(
      API.ACTIVE_USERS,
      { params: { page, size } }
    );
    return response.data;
  },
};
