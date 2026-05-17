// Submission Status
export enum SubmissionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  TIMEOUT = 'TIMEOUT',
  ABANDONED = 'ABANDONED'
}

// Question Result (khi submit)
export interface QuestionResultResponse {
  questionId: string;
  content: string;
  score: number;
  isCorrect: boolean;
  userSelectedOptionIds: string[];
  correctOptionIds: string[];
}

// Exercise Submission Response (dùng cho cả start và submit)
export interface ExerciseSubmissionResponse {
  submissionId: string;
  submissionStatus: SubmissionStatus;
  exerciseId: string;
  totalScore?: number;        // Có khi submit
  maxScore: number;
  correctCount?: number;      // Có khi submit
  totalQuestions?: number;    // Có khi submit
  submittedAt?: string;       // Có khi submit
  results?: QuestionResultResponse[];  // Có khi submit
}

// Exercise Submission Summary (dùng cho My Exercises page)
export interface ExerciseSubmissionSummaryResponse {
  submissionId: string;
  submissionStatus: SubmissionStatus;
  exerciseId: string;
  exerciseTitle: string;
  exerciseSlug: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
}

// Exercise Submission Statistics (thống kê tổng hợp)
export interface ExerciseSubmissionStatisticsResponse {
  totalSubmissions: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  avgScore: number;
  accuracy: number;
  perfectScores: number;
}

// User Answer
export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

// Submit Request
export interface ExerciseSubmissionRequest {
  submissionId: string;
  answers: UserAnswer[];
}
