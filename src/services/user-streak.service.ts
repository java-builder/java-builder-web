import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import { UserStreak } from "@/types/user-streak";

const API_ENDPOINTS = {
  MY_STREAK: "/api/v1/user-streak/me",
};

export const userStreakService = {
  /**
   * Lấy thông tin streak học tập của user hiện tại
   */
  async getMyStreak(): Promise<ApiResponse<UserStreak>> {
    const response = await apiClient.get(API_ENDPOINTS.MY_STREAK);
    return response.data;
  },
};
