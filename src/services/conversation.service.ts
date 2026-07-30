import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { API } from "@/api/api";
import {
  CreateConversationRequest,
  CreateConversationResponse,
  ConversationDetailResponse,
} from "@/types/conversation";

export const conversationApi = {
  createConversation: async (payload: CreateConversationRequest) => {
    const response = await apiClient.post<ApiResponse<CreateConversationResponse>>(
      API.CONVERSATION,
      payload
    );
    return response.data;
  },

  getMyConversations: async (page: number = 1, size: number = 10) => {
    const response = await apiClient.get<ApiResponse<PageResponse<ConversationDetailResponse>>>(
      API.CONVERSATION_MY,
      { params: { page, size } }
    );
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<number>>(
      API.CONVERSATION_UNREAD_COUNT
    );
    return response.data;
  },

  markAsRead: async (conversationId: string) => {
    const response = await apiClient.put<ApiResponse<void>>(
      API.CONVERSATION_MARK_READ(conversationId)
    );
    return response.data;
  },

  clearHistory: async (conversationId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      API.CONVERSATION_CLEAR_HISTORY(conversationId)
    );
    return response.data;
  },
};
