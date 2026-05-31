import { Locale, QuestionSetTranslation } from "@/types/interview";

export type { Locale, QuestionSetTranslation };

export interface QuestionSetDetailResponse {
  id: string;
  slug: string;
  level: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder: number;
  active: boolean;
  totalQuestions?: number;
  /**
   * List endpoint: 1 entry resolved theo locale.
   * Admin endpoint: full translations.
   */
  translations: QuestionSetTranslation[];
  createdAt: string;
  updatedAt?: string;
}

export interface ListQuestionSetResponse {
  questionSets: QuestionSetDetailResponse[];
}

export interface CreateQuestionSetRequest {
  level: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder?: number;
  translations: QuestionSetTranslation[];
}

export interface UpdateQuestionSetRequest {
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder?: number;
  active?: boolean;
  translations?: QuestionSetTranslation[];
}
