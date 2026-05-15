import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { UserDailyActivity } from "@/types/user-activity";

const API_ENDPOINTS = {
  MY_ACTIVITIES: "/api/v1/user-daily-activity/me",
};

export const userActivityService = {
  /**
   * Lấy danh sách hoạt động học tập của user hiện tại
   * @param page - Trang hiện tại (mặc định: 1)
   * @param size - Số lượng item mỗi trang (mặc định: 10)
   * @param date - Lọc theo ngày (optional, format: YYYY-MM-DD)
   */
  async getMyActivities(
    page: number = 1,
    size: number = 10,
    date?: string
  ): Promise<ApiResponse<PageResponse<UserDailyActivity>>> {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (date) {
      params.date = date;
    }

    const response = await apiClient.get(API_ENDPOINTS.MY_ACTIVITIES, {
      params,
    });
    return response.data;
  },
};
