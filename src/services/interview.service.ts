import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import {
  InterviewTopicDetailResponse,
  InterviewTopicsResponse,
  CreateInterviewTopicRequest,
  UpdateInterviewTopicRequest,
} from "@/types/interview";

export const interviewService = {
  getAllTopics: async () => {
    const response = await apiClient.get<ApiResponse<InterviewTopicsResponse>>(
      "/api/v1/interview-topics"
    );
    return response.data;
  },

  getTopicBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<InterviewTopicDetailResponse>>(
      `/api/v1/interview-topics/slug/${slug}`
    );
    return response.data;
  },

  createTopic: async (data: CreateInterviewTopicRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      "/api/v1/interview-topics",
      data
    );
    return response.data;
  },

  updateTopic: async (topicId: string, data: UpdateInterviewTopicRequest) => {
    const response = await apiClient.put<ApiResponse<InterviewTopicDetailResponse>>(
      `/api/v1/interview-topics/${topicId}`,
      data
    );
    return response.data;
  },

  deleteTopic: async (topicId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/interview-topics/${topicId}`
    );
    return response.data;
  },
};
