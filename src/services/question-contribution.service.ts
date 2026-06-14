import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import {
  CreateQuestionContributionRequest,
  CreateQuestionContributionResponse,
  QuestionContributionDetailResponse,
  InterviewQuestionTranslation,
} from "@/types/interview";

export const questionContributionService = {
  async createContribution(data: CreateQuestionContributionRequest) {
    return apiClient.post<CreateQuestionContributionResponse>(
      API.CREATE_QUESTION_CONTRIBUTION,
      data
    );
  },

  async getContributions(page: number = 1, size: number = 10, status?: string) {
    return apiClient.get(API.GET_QUESTION_CONTRIBUTIONS, {
      params: { page, size, ...(status && status !== "ALL" && { status }) }
    });
  },

  async getMyContributions(page: number = 1, size: number = 10, status?: string) {
    return apiClient.get(API.GET_MY_CONTRIBUTIONS, {
      params: { page, size, ...(status && status !== "ALL" && { status }) }
    });
  },

  async getContributionById(id: string) {
    return apiClient.get<QuestionContributionDetailResponse>(
      `${API.GET_CONTRIBUTION_BY_ID}/${id}`
    );
  },

  async approveContribution(id: string, translations: InterviewQuestionTranslation[]) {
    return apiClient.put(`${API.APPROVE_CONTRIBUTION}/${id}/approve`, {
      translations,
    });
  },

  async rejectContribution(id: string, reason: string) {
    return apiClient.put(`${API.REJECT_CONTRIBUTION}/${id}/reject`, { reason });
  },
};

export type { QuestionContributionDetailResponse };
