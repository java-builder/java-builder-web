export interface Question {
  id: string;
  title: string;
  content: string;
  author?: string;
  authorAvatar?: string;
  targetId?: string;
  targetType?: "BLOG" | "LESSON" | "POST" | "QUESTION";
  tags?: string[];
  createdAt?: string;
  answersCount?: number;
  votes?: number;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author?: string;
  authorAvatar?: string;
  createdAt?: string;
  votes?: number;
}

export interface QuestionPageParams {
  page?: number;
  size?: number;
  tag?: string;
  search?: string;
}








