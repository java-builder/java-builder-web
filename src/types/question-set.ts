export interface QuestionSetDetailResponse {
  id: string;
  slug: string;
  title: string;
  level: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder: number;
  active: boolean;
  totalQuestions?: number;
  createdAt: string;
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

export interface ListQuestionSetResponse {
  questionSets: QuestionSetDetailResponse[];
}

export interface CreateQuestionSetRequest {
  title: string;
  level: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder?: number;
}

export interface UpdateQuestionSetRequest {
  title?: string;
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder?: number;
  active?: boolean;
}
