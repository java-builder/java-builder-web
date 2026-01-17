import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { API } from "@/api/api";

import {
  NotificationDetailResponse,
  SendAdminNotificationRequest,
  SendNotificationResponse,
} from "@/types/notification";

export const notificationApi = {
  getMyNotifications: async (page: number = 1, size?: number) => {
    const params: { page: number; size?: number } = { page };
    if (size) {
      params.size = size;
    }
    const response = await apiClient.get<
      ApiResponse<PageResponse<NotificationDetailResponse>>
    >(API.GET_NOTIFICATIONS, {
      params,
    });
    return response.data;
  },

  getUnreadNotifications: async (page: number = 1, size?: number) => {
    const params: { page: number; size?: number } = { page };
    if (size) {
      params.size = size;
    }
    const response = await apiClient.get<
      ApiResponse<PageResponse<NotificationDetailResponse>>
    >(API.GET_UNREAD_NOTIFICATIONS, {
      params,
    });
    return response.data;
  },

  markAsRead: async (ids: string[]) => {
    if (ids.length === 0) return;
    const response = await apiClient.post<ApiResponse<number>>(
      API.NOTIFICATIONS_MARK_READ,
      { ids },
    );
    return response.data;
  },

  sendAdminNotification: async (data: SendAdminNotificationRequest) => {
    const response = await apiClient.post<ApiResponse<SendNotificationResponse>>(
      API.NOTIFICATIONS_ADMIN_SEND,
      data,
    );
    return response.data;
  },
};
