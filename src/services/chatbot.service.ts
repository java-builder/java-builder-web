import { apiClient } from "@/api/axios";
import { ApiResponse } from "@/types/api";
import {
  ChatbotRequest,
  ExplainQuestionRequest,
  ExplainQuestionResponse,
  QuizAnalysisRequest,
  QuizAnalysisResponse,
  GenerateExerciseRequest,
  GenerateExerciseResponse,
} from "@/types/chatbot";
import { API } from "@/api/api";

export const chatbotApi = {
  chat: async (data: ChatbotRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      API.CHATBOT_CHAT,
      data,
    );
    return response.data;
  },

  explainQuestion: async (data: ExplainQuestionRequest) => {
    const response = await apiClient.post<ApiResponse<ExplainQuestionResponse>>(
      API.CHATBOT_EXPLAIN_QUESTION,
      data,
    );
    return response.data;
  },

  analysisQuiz: async (data: QuizAnalysisRequest) => {
    const response = await apiClient.post<ApiResponse<QuizAnalysisResponse>>(
      API.CHATBOT_ANALYSIS_QUIZ,
      data,
    );
    return response.data;
  },

  generateExercise: async (data: GenerateExerciseRequest) => {
    const response = await apiClient.post<ApiResponse<GenerateExerciseResponse>>(
      API.CHATBOT_GENERATE_EXERCISE,
      data,
    );
    return response.data;
  },

  lessonChat: async (data: ChatbotRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      API.CHATBOT_LESSON_CHAT,
      data,
    );
    return response.data;
  },
};
