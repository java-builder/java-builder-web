import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  UserStreak,
  AdminUserStreak,
  UserStreakStats,
  StreakStatus,
  StreakLeaderboard,
} from "@/types/user-streak";
import { fcmService } from "@/services/fcm.service";

const API_ENDPOINTS = {
  MY_STREAK: "/api/v1/user-streak/me",
  ADMIN_ALL: "/api/v1/user-streak/admin/all",
  ADMIN_STATS: "/api/v1/user-streak/admin/stats",
  LEADERBOARD: "/api/v1/user-streak/leaderboard",
};

export const userStreakService = {
  /**
   * Lấy thông tin streak học tập của user hiện tại
   */
  async getMyStreak(): Promise<ApiResponse<UserStreak>> {
    const response = await apiClient.get(API_ENDPOINTS.MY_STREAK);
    return response.data;
  },

  /**
   * Lấy Bảng xếp hạng Top 10 Streak & Hạng của user hiện tại
   */
  async getLeaderboard(): Promise<ApiResponse<StreakLeaderboard>> {
    const response = await apiClient.get(API_ENDPOINTS.LEADERBOARD);
    return response.data;
  },

  /**
   * Lấy danh sách phân trang streak người dùng (Admin)
   */
  async getAdminUserStreaks(
    page: number = 1,
    size: number = 20,
    query?: string,
    status?: StreakStatus | "ALL"
  ): Promise<ApiResponse<PageResponse<AdminUserStreak>>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN_ALL, {
      params: { page, size, query, status },
    });
    return response.data;
  },

  /**
   * Lấy tổng quan thống kê streak (Admin)
   */
  async getStreakStats(): Promise<ApiResponse<UserStreakStats>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN_STATS);
    return response.data;
  },

  /**
   * Gửi thông báo Push nhắc nhở giữ chuỗi cho user qua FCM
   */
  async sendStreakReminder(
    userIds?: string[],
    title?: string,
    body?: string
  ) {
    return await fcmService.sendFCMPush({
      title: title || "🔥 Nhắc nhở giữ chuỗi Streak học tập!",
      body: body || "Bạn còn ít giờ nữa để làm bài tập và duy trì chuỗi học tập hôm nay. Đừng bỏ lỡ nhé!",
      clickUrl: "/study-progress",
      targetAudience: userIds && userIds.length > 0 ? "Cá nhân cụ thể" : "Tất cả học viên",
      targetUserIds: userIds,
    });
  },
};


