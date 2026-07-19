import { Locale, InterviewQuestionTranslation } from "@/types/interview";

export type { Locale, InterviewQuestionTranslation };

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface InterviewQuestionResponse {
  id: string;
  slug: string;
  difficulty: Difficulty;
  displayOrder: number;
  active: boolean;
  translations: InterviewQuestionTranslation[];
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
  isAccess?: boolean;
}

export interface CreateInterviewQuestionRequest {
  difficulty: Difficulty;
  displayOrder: number;
  translations: InterviewQuestionTranslation[];
  isPremium?: boolean;
}

export interface UpdateInterviewQuestionRequest {
  difficulty?: Difficulty;
  displayOrder?: number;
  active?: boolean;
  translations?: InterviewQuestionTranslation[];
  isPremium?: boolean;
}
