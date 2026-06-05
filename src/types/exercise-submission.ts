import { Difficulty, ExerciseType } from './exercise';

// Enums
export enum SubmissionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PASSED = 'PASSED',
  FAILED = 'FAILED'
}

// Request Types
export interface AnswerSubmissionRequest {
  questionId: string;
  selectedOptions: string[];
}

export interface ExerciseSubmissionRequest {
  answers: AnswerSubmissionRequest[];
}

// Response Types - Option
export interface OptionResponse {
  id: string;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

// Response Types - Question Result
export interface QuestionResultResponse {
  questionId: string;
  content: string;
  score: number;
  isCorrect: boolean;
  options: OptionResponse[];
  userSelectedOptionIds: string[];
  correctOptionIds?: string[];
}

// Response Types - Submission Detail (Full)
export interface ExerciseSubmissionDetailResponse {
  exerciseId: string;
  exerciseSlug: string;
  submissionId: string;
  submissionStatus: SubmissionStatus;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  results: QuestionResultResponse[];
}

// Legacy type for backward compatibility
export interface QuestionAnswerResult {
  questionId: string;
  content: string;
  isCorrect: boolean;
  score: number;
  earnedScore: number;
  selectedOptions: string[];
  correctOptions: string[];
}

export interface ExerciseSubmissionResponse {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  userId: string;
  status: SubmissionStatus;
  score: number;
  maxScore: number;
  completionRate: number;
  startedAt: string;
  submittedAt: string | null;
  answers: QuestionAnswerResult[];
}

// Response Types - Summary for listing
export interface ExerciseSubmissionSummaryResponse {
  submissionId: string;
  submissionStatus: SubmissionStatus;
  exerciseId: string;
  exerciseTitle: string;
  exerciseSlug: string;
  difficulty: Difficulty;
  exerciseType: ExerciseType;
  timeLimit: number;
  score?: number;
  maxScore: number;
  correctCount?: number;
  submittedAt?: string;
}

// Response Types - Statistics
export interface ExerciseSubmissionStatisticsResponse {
  totalExercises: number;
  completedExercises: number;
  passedExercises: number;
  averageScore: number;
  totalTimeSpent: number;
}

// Response Types - Admin Overview (per user per exercise)
export interface ExerciseSubmissionOverviewResponse {
  userId: string;
  email: string;
  username: string;
  avatar: string | null;
  exerciseId: string;
  exerciseTitle: string;
  exerciseSlug: string;
  difficulty: Difficulty;
  exerciseType: ExerciseType;
  timeLimit: number;
  totalQuestions: number;
  attemptCount: number;
  averageTimeSeconds: number;
  accuracy: number;
  correctCount: number;
  lastSubmittedAt: string;
}

// Filter Types
export interface ExerciseSubmissionFilters {
  page?: number;
  size?: number;
  exerciseTitle?: string;
  keyword?: string; // search by username or email
}
