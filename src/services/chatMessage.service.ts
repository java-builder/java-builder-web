import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  ChatMessageRequest,
  ChatMessageResponse,
  MessageAttachmentRequest,
  BEAttachmentType,
} from "@/types/chatMessage";
import { fileApi } from "./course.service";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB limit

export const chatMessageApi = {
  // Gửi tin nhắn mới
  sendMessage: async (payload: ChatMessageRequest) => {
    const response = await apiClient.post<ApiResponse<ChatMessageResponse>>(
      API.CHAT_MESSAGES_SEND,
      payload
    );
    return response.data;
  },

  // Lấy lịch sử tin nhắn của hội thoại (phân trang)
  getMessagesByConversationId: async (
    conversationId: string,
    page: number = 1,
    size: number = 20
  ) => {
    const response = await apiClient.get<ApiResponse<PageResponse<ChatMessageResponse>>>(
      `${API.CHAT_MESSAGES}/${conversationId}`,
      { params: { page, size } }
    );
    return response.data;
  },

  // Helper upload file qua PreSigned URL với validate giới hạn 100MB
  uploadAttachmentWithPresign: async (file: File): Promise<MessageAttachmentRequest> => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Kích thước file (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 100MB!`);
    }

    const presignedRes = await fileApi.getPublicPresignedUrl(file.name);
    if (!presignedRes.data) {
      throw new Error("Không thể lấy PreSigned URL để tải file lên");
    }

    const { url, key } = presignedRes.data;

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });

    let attachmentType: BEAttachmentType = "FILE";
    if (file.type.startsWith("image/")) {
      attachmentType = "IMAGE";
    } else if (file.type.startsWith("video/")) {
      attachmentType = "VIDEO";
    } else if (file.type.startsWith("audio/")) {
      attachmentType = "AUDIO";
    }

    return {
      attachmentType,
      attachmentKey: key,
      attachmentName: file.name,
      attachmentSize: file.size,
      mimeType: file.type || "application/octet-stream",
    };
  },
};
