export interface InterviewTopicsResponse {
  topics: InterviewTopicDetailResponse[];
}

export interface InterviewTopicDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  active?: boolean;
  totalQuestionSets?: number;
  totalQuestions?: number;
  createdAt: string;
  updatedAt?: string;
  questionSets?: QuestionSetResponse[];
}

export interface QuestionSetResponse {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  level?: "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topics?: string;
  displayOrder: number;
  active: boolean;
  totalQuestions?: number;
  questions?: InterviewQuestionResponse[];
}

export interface InterviewQuestionResponse {
  id: string;
  question: string;
  answer: string;
  tips?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  displayOrder: number;
  active: boolean;
}

export interface CreateInterviewTopicRequest {
  name: string;
  description?: string;
  key?: string;
  displayOrder?: number;
}

export interface UpdateInterviewTopicRequest {
  name?: string;
  description?: string;
  key?: string;
  displayOrder?: number;
  active?: boolean;
}
