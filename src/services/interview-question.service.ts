import { apiClient } from "@/api/axios";
import { API } from "@/api/api";
import { ApiResponse } from "@/types/api";

export interface CreateInterviewQuestionRequest {
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
}

export interface UpdateInterviewQuestionRequest {
  question?: string;
  answer?: string;
  tips?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  displayOrder?: number;
  active?: boolean;
}

export interface InterviewQuestionResponse {
  id: string;
  slug: string;
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
  active: boolean;
}

export interface CreateInterviewQuestionResponse {
  id: string;
  slug: string;
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
  active: boolean;
}

export interface ListInterviewQuestionResponse {
  questions: InterviewQuestionResponse[];
}

export const interviewQuestionService = {
  async createQuestion(
    questionSetId: string,
    request: CreateInterviewQuestionRequest
  ): Promise<ApiResponse<CreateInterviewQuestionResponse>> {
    const response = await apiClient.post(
      `${API.CREATE_INTERVIEW_QUESTION}/${questionSetId}`,
      request
    );
    return response.data;
  },

  async getQuestions(
    questionSetId: string
  ): Promise<ApiResponse<ListInterviewQuestionResponse>> {
    const response = await apiClient.get(
      `${API.GET_INTERVIEW_QUESTIONS}/${questionSetId}`
    );
    return response.data;
  },

  async getQuestionsBySlug(
    questionSetSlug: string
  ): Promise<ApiResponse<ListInterviewQuestionResponse>> {
    const response = await apiClient.get(
      `${API.GET_INTERVIEW_QUESTIONS_BY_SLUG}/${questionSetSlug}`
    );
    return response.data;
  },

  async updateQuestion(
    questionId: string,
    request: UpdateInterviewQuestionRequest
  ): Promise<ApiResponse<InterviewQuestionResponse>> {
    const response = await apiClient.put(
      `${API.UPDATE_INTERVIEW_QUESTION}/${questionId}`,
      request
    );
    return response.data;
  },

  async deleteQuestion(questionId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(
      `${API.DELETE_INTERVIEW_QUESTION}/${questionId}`
    );
    return response.data;
  },
};
