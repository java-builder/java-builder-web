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
