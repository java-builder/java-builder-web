import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  ChatbotRequest,
  SuggestedBlogResponse,
  ChatbotResponse,
} from "@/types/chatbot";
import toast from "react-hot-toast";

export const chatbotApi = {
  /**
   * Ask a general question to the chatbot
   */
  askQuestion: async (
    request: ChatbotRequest,
  ): Promise<ApiResponse<ChatbotResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<ChatbotResponse>>(
        "/api/v1/chatbot",
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      toast.error("Không thể kết nối với AI. Vui lòng thử lại sau.");
      throw error;
    }
  },

  /**
   * Get blog suggestions based on user's question
   */
  suggestBlogs: async (
    request: ChatbotRequest,
  ): Promise<ApiResponse<SuggestedBlogResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<SuggestedBlogResponse>>(
        "/api/v1/chatbot/suggested-blogs",
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      toast.error("Không thể tìm kiếm bài viết. Vui lòng thử lại sau.");
      throw error;
    }
  },

  /**
   * Read and analyze an image
   */
  readImage: async (
    message: string,
    file: File,
  ): Promise<ApiResponse<string>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (message) {
        formData.append("message", message);
      }

      const response = await apiClient.post<ApiResponse<string>>(
        "/api/v1/chatbot/read-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      toast.error("Không thể đọc hình ảnh. Vui lòng thử lại sau.");
      throw error;
    }
  },
};
