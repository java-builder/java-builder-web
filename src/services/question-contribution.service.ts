import { apiClient } from "@/api/axios";

export interface QuestionItemRequest {
  question: string;
  answer?: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface CreateQuestionContributionRequest {
  questionSetId?: string;
  interviewTopicId?: string;
  newQuestionSetTitle?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  topics?: string;
  questions: QuestionItemRequest[];
}

export interface CreateQuestionContributionResponse {
  questionSetId: string;
  questionSetTitle: string;
  isNewQuestionSet: boolean;
  totalQuestions: number;
  status: string;
  createdAt: string;
}

export interface QuestionContributionDetailResponse {
  id: string;
  question: string;
  answer?: string;
  tips?: string;
  difficulty: string;
  status: string;
  questionSetId?: string;
  questionSetTitle?: string;
  level?: string;
  contributorId: string;
  contributorEmail: string;
  contributorName: string;
  contributorAvatar?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectReason?: string;
  createdAt: string;
}

export const questionContributionService = {
  async createContribution(data: CreateQuestionContributionRequest) {
    return apiClient.post<CreateQuestionContributionResponse>(
      "/api/v1/question-contributions",
      data
    );
  },

  async getContributions(page: number = 1, size: number = 10, status?: string) {
    return apiClient.get("/api/v1/question-contributions", {
      params: { page, size, ...(status && status !== "ALL" && { status }) }
    });
  },

  async approveContribution(id: string) {
    return apiClient.put(`/api/v1/question-contributions/${id}/approve`);
  },

  async rejectContribution(id: string, reason: string) {
    return apiClient.put(`/api/v1/question-contributions/${id}/reject`, { reason });
  },
};
