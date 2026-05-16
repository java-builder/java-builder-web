export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  CODING = 'CODING'
}

export enum ExerciseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface QuestionOption {
  orderIndex: number;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  exerciseId?: string;
  content: string;
  questionType: QuestionType;
  score: number;
  orderIndex: number;
  options: QuestionOption[];
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  timeLimit: number;
  maxScore?: number;
  questions: Question[];
}

export interface ExerciseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  timeLimit: number;
  maxScore: number;
  status: ExerciseStatus;
  publishedAt: string;
}

export interface CreateExerciseResponse {
  id: string;
  title: string;
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  timeLimit: number;
  maxScore: number;
  status: ExerciseStatus;
  publishedAt: string;
  questions: Question[];
  createdAt: string;
}

export interface ExerciseFilters {
  page?: number;
  size?: number;
  title?: string;
  exerciseType?: ExerciseType;
  difficulty?: Difficulty;
}

// Exercise Detail Types
export interface QuestionOptionDetail {
  id: string;
  orderIndex: number;
  content: string;
  isCorrect: boolean;
}

export interface QuestionDetail {
  id: string;
  content: string;
  questionType: QuestionType;
  score: number;
  orderIndex: number;
  options: QuestionOptionDetail[];
}

export interface ExerciseDetail {
  id: string;
  slug: string;
  title: string;
  description?: string;
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  timeLimit: number;
  maxScore: number;
  status: ExerciseStatus;
  publishedAt: string;
  questions: QuestionDetail[];
  createdAt: string;
}

// User Answer Types
export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface SubmitExerciseRequest {
  exerciseId: string;
  answers: UserAnswer[];
}