import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  CreateQuestionSetRequest,
  UpdateQuestionSetRequest,
  ListQuestionSetResponse,
  QuestionSetDetailResponse,
} from "@/types/question-set";

export const questionSetService = {
  createQuestionSet: async (topicId: string, data: CreateQuestionSetRequest) => {
    const response = await apiClient.post<ApiResponse<QuestionSetDetailResponse>>(
      `${API.CREATE_QUESTION_SET}/${topicId}`,
      data
    );
    return response.data;
  },

  getAllQuestionSets: async () => {
    const response = await apiClient.get<ApiResponse<ListQuestionSetResponse>>(
      API.GET_QUESTION_SETS
    );
    return response.data;
  },

  getQuestionSetsByTopicSlug: async (topicSlug: string) => {
    const response = await apiClient.get<ApiResponse<ListQuestionSetResponse>>(
      `${API.GET_QUESTION_SETS}/topic/${topicSlug}`
    );
    return response.data;
  },

  getQuestionSetBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<QuestionSetDetailResponse>>(
      `${API.GET_QUESTION_SET_BY_SLUG}/${slug}`
    );
    return response.data;
  },

  // Lấy đầy đủ translations cho admin edit
  getQuestionSetForAdmin: async (questionSetId: string) => {
    const response = await apiClient.get<ApiResponse<QuestionSetDetailResponse>>(
      `${API.GET_QUESTION_SET_FOR_ADMIN}/${questionSetId}`
    );
    return response.data;
  },

  updateQuestionSet: async (questionSetId: string, data: UpdateQuestionSetRequest) => {
    const response = await apiClient.put<ApiResponse<QuestionSetDetailResponse>>(
      `${API.UPDATE_QUESTION_SET}/${questionSetId}`,
      data
    );
    return response.data;
  },

  deleteQuestionSet: async (questionSetId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_QUESTION_SET}/${questionSetId}`
    );
    return response.data;
  },
};
