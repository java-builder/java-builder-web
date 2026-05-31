import { Locale, InterviewQuestionTranslation } from "@/types/interview";

export type { Locale, InterviewQuestionTranslation };

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface InterviewQuestionResponse {
  id: string;
  slug: string;
  difficulty: Difficulty;
  displayOrder: number;
  active: boolean;
  /**
   * List endpoint: 1 entry resolved theo locale.
   * Admin endpoint: full translations.
   */
  translations: InterviewQuestionTranslation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListInterviewQuestionResponse {
  questions: InterviewQuestionResponse[];
}

export interface CreateInterviewQuestionRequest {
  difficulty: Difficulty;
  displayOrder: number;
  translations: InterviewQuestionTranslation[];
}

export interface UpdateInterviewQuestionRequest {
  difficulty?: Difficulty;
  displayOrder?: number;
  active?: boolean;
  translations?: InterviewQuestionTranslation[];
}
