import { apiClient } from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";

export interface NotificationDetailResponse {
  id: string;
  title: string;
  content: string;
  link: string;
  read: boolean;
  senderName: string;
  avatar: string | null;
  createdAt: string;
}

export interface SendAdminNotificationRequest {
  title: string;
  content: string;
  link?: string;
  recipientIds: string[];
}

export interface SendNotificationResponse {
  totalRecipients: number;
  message: string;
}

export const notificationApi = {
  getMyNotifications: async (page: number = 1, size?: number) => {
    const params: { page: number; size?: number } = { page };
    if (size) {
      params.size = size;
    }
    const response = await apiClient.get<
      ApiResponse<PageResponse<NotificationDetailResponse>>
    >("/api/v1/notifications", {
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
    >("/api/v1/notifications/unread", {
      params,
    });
    return response.data;
  },

  markAsRead: async (ids: string[]) => {
    if (ids.length === 0) return;
    const response = await apiClient.post<ApiResponse<number>>(
      "/api/v1/notifications/mark-read",
      { ids },
    );
    return response.data;
  },

  sendAdminNotification: async (data: SendAdminNotificationRequest) => {
    const response = await apiClient.post<ApiResponse<SendNotificationResponse>>(
      "/api/v1/notifications/admin/send",
      data,
    );
    return response.data;
  },
};
