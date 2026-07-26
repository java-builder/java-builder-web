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
};
