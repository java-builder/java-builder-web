export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  message: string;
}

export interface ExplainQuestionRequest {
  questionContent: string;
  userAnswers: string[];
  correctAnswers: string[];
  options: string[];
}

export interface ExplainQuestionResponse {
  explanation: string;
  whyWrong: string;
  whyCorrect: string;
  tip: string;
}

export interface QuizAnswerDetail {
  questionContent: string;
  userAnswers: string[];
  correctAnswers: string[];
}

export interface QuizAnalysisRequest {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  answers: QuizAnswerDetail[];
}

export interface PracticeExercise {
  topic: string;
  exercise: string;
  hint: string;
}

export interface QuizAnalysisResponse {
  overallFeedback: string;
  strongPoints: string[];
  weakPoints: string[];
  studySuggestions: string[];
  encouragement: string;
  practiceExercises: PracticeExercise[];
}
