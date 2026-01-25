import { apiClient } from "@/api/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import { Question, Answer } from "@/types/question";
import { API } from "@/api/api";

interface QuestionListParams {
  page?: number;
  size?: number;
  title?: string;
  content?: string;
}

export const questionApi = {
  list: async (params: QuestionListParams = {}) => {
    const response = await apiClient.get<ApiResponse<PageResponse<Question>>>(API.GET_BLOGS.replace("/blogs", "/questions"), {
      params,
    });
    return response.data;
  },

  create: async (data: Partial<Question>) => {
    const response = await apiClient.post<ApiResponse<Question>>(API.CREATE_COMMENT.replace("/comments", "/questions"), data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Question>>(`/api/v1/questions/${id}`);
    return response.data;
  },

  createAnswer: async (questionId: string, data: Partial<Answer>) => {
    const response = await apiClient.post<ApiResponse<Answer>>(`/api/v1/questions/${questionId}/answers`, data);
    return response.data;
  },
};



