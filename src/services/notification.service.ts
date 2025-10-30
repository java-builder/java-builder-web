import { apiClient } from '@/lib/axios';
import { ApiResponse, PageResponse } from '@/types/api';

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

export const notificationApi = {
    getMyNotifications: async () => {
        const response = await apiClient.get<ApiResponse<PageResponse<NotificationDetailResponse>>>('/api/v1/notifications');
        return response.data;
    },
};
