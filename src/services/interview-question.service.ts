import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  CreateInterviewQuestionRequest,
  UpdateInterviewQuestionRequest,
  ListInterviewQuestionResponse,
  InterviewQuestionResponse,
} from "@/types/interview-question";

export const interviewQuestionService = {
  createInterviewQuestion: async (
    questionSetId: string,
    data: CreateInterviewQuestionRequest
  ) => {
    const response = await apiClient.post<ApiResponse<InterviewQuestionResponse>>(
      `${API.CREATE_INTERVIEW_QUESTION}/${questionSetId}`,
      data
    );
    return response.data;
  },

  getInterviewQuestionsByQuestionSetId: async (questionSetId: string) => {
    const response = await apiClient.get<ApiResponse<ListInterviewQuestionResponse>>(
      `${API.GET_INTERVIEW_QUESTIONS}/${questionSetId}`
    );
    return response.data;
  },

  getInterviewQuestionsByQuestionSetSlug: async (questionSetSlug: string) => {
    const response = await apiClient.get<ApiResponse<ListInterviewQuestionResponse>>(
      `${API.GET_INTERVIEW_QUESTIONS_BY_SLUG}/${questionSetSlug}`
    );
    return response.data;
  },

  // Lấy full translations cho admin edit
  getInterviewQuestionForAdmin: async (questionId: string) => {
    const response = await apiClient.get<ApiResponse<InterviewQuestionResponse>>(
      `${API.GET_INTERVIEW_QUESTION_FOR_ADMIN}/${questionId}`
    );
    return response.data;
  },

  updateInterviewQuestion: async (
    questionId: string,
    data: UpdateInterviewQuestionRequest
  ) => {
    const response = await apiClient.put<ApiResponse<InterviewQuestionResponse>>(
      `${API.UPDATE_INTERVIEW_QUESTION}/${questionId}`,
      data
    );
    return response.data;
  },

  deleteInterviewQuestion: async (questionId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_INTERVIEW_QUESTION}/${questionId}`
    );
    return response.data;
  },
};
