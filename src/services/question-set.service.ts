import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  CreateQuestionSetRequest,
  UpdateQuestionSetRequest,
  ListQuestionSetResponse,
} from "@/types/question-set";

export const questionSetService = {
  createQuestionSet: async (topicId: string, data: CreateQuestionSetRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
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

  updateQuestionSet: async (questionSetId: string, data: UpdateQuestionSetRequest) => {
    const response = await apiClient.put<ApiResponse<void>>(
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
