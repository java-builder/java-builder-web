import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import {
  ChatbotRequest,
  ExplainQuestionRequest,
  ExplainQuestionResponse,
} from "@/types/chatbot";
import { API } from "@/api/api";

export const chatbotApi = {
  chat: async (data: ChatbotRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      API.CHATBOT_CHAT,
      data,
    );
    return response.data;
  },

  explainQuestion: async (data: ExplainQuestionRequest) => {
    const response = await apiClient.post<ApiResponse<ExplainQuestionResponse>>(
      API.CHATBOT_EXPLAIN_QUESTION,
      data,
    );
    return response.data;
  },
};
