export interface NotificationDetailResponse {
    id: string;
    title: string;
    content: string;
    link: string;
    thumbnail?: string | null;
    isRead: boolean;
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

export interface NotificationItem {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    avatar?: string | null;
    senderName?: string;
    link?: string;
}
