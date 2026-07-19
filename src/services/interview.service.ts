import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";
import {
  InterviewTopicDetailResponse,
  CreateInterviewTopicRequest,
  UpdateInterviewTopicRequest,
} from "@/types/interview";

export const interviewService = {
  getAllTopics: async () => {
    const response = await apiClient.get<ApiResponse<InterviewTopicDetailResponse[]>>(
      API.GET_INTERVIEW_TOPICS
    );
    return response.data;
  },

  getTopicBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<InterviewTopicDetailResponse>>(
      `${API.GET_INTERVIEW_TOPIC_BY_SLUG}/${slug}`
    );
    return response.data;
  },

  // Lấy đầy đủ translations cho admin edit
  getTopicForAdmin: async (topicId: string) => {
    const response = await apiClient.get<ApiResponse<InterviewTopicDetailResponse>>(
      `${API.GET_INTERVIEW_TOPIC_FOR_ADMIN}/${topicId}`
    );
    return response.data;
  },

  createTopic: async (data: CreateInterviewTopicRequest) => {
    const response = await apiClient.post<ApiResponse<InterviewTopicDetailResponse>>(
      API.CREATE_INTERVIEW_TOPIC,
      data
    );
    return response.data;
  },

  updateTopic: async (topicId: string, data: UpdateInterviewTopicRequest) => {
    const response = await apiClient.put<ApiResponse<InterviewTopicDetailResponse>>(
      `${API.UPDATE_INTERVIEW_TOPIC}/${topicId}`,
      data
    );
    return response.data;
  },

  deleteTopic: async (topicId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${API.DELETE_INTERVIEW_TOPIC}/${topicId}`
    );
    return response.data;
  },
};
