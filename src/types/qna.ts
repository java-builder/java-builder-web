export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  answersCount: number;
  views: number;
  isResolved: boolean;
  votes: number;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  votes: number;
  isAccepted: boolean;
}

export interface QuestionFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface AnswerFormData {
  content: string;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
}
