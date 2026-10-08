import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { ActivityType, UserDailyActivity, UserDailyActivityStats } from "@/types/user-activity";
import { API } from "@/api/api";

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
      params.date = date.split(/[ T]/)[0];
    }

    const response = await apiClient.get(API.USER_DAILY_ACTIVITY_MY, {
      params,
    });
    return response.data;
  },

  /**
   * Lấy danh sách hoạt động của toàn bộ hệ thống (Dành cho Admin)
   * @param page - Trang hiện tại (mặc định: 1)
   * @param size - Số lượng item mỗi trang (mặc định: 50)
   * @param activityType - Lọc theo loại hoạt động
   * @param from - Từ ngày (format: YYYY-MM-DD)
   * @param to - Đến ngày (format: YYYY-MM-DD)
   */
  async getAllActivities(
    page: number = 1,
    size: number = 50,
    activityType?: ActivityType | string,
    from?: string,
    to?: string
  ): Promise<ApiResponse<PageResponse<UserDailyActivity>>> {
    const params: Record<string, string | number> = {
      page,
      size,
    };

    if (activityType && activityType !== "ALL") {
      params.activityType = activityType;
    }

    if (from) {
      params.from = from.split(/[ T]/)[0];
    }

    if (to) {
      params.to = to.split(/[ T]/)[0];
    }

    const response = await apiClient.get(API.USER_DAILY_ACTIVITY_ALL, {
      params,
    });
    return response.data;
  },

  /**
   * Lấy thống kê hoạt động của toàn hệ thống (Dành cho Admin)
   * @param from - Từ ngày (format: YYYY-MM-DD)
   * @param to - Đến ngày (format: YYYY-MM-DD)
   */
  async getActivityStats(
    from?: string,
    to?: string
  ): Promise<ApiResponse<UserDailyActivityStats>> {
    const params: Record<string, string> = {};

    if (from) {
      params.from = from.split(/[ T]/)[0];
    }

    if (to) {
      params.to = to.split(/[ T]/)[0];
    }

    const response = await apiClient.get(API.USER_DAILY_ACTIVITY_ADMIN_STATS, {
      params,
    });
    return response.data;
  },
};
