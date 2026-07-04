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

export interface GenerateExerciseRequest {
  topic: string;
  difficulty: string[];
  questionType: string;
  numQuestions: number;
}

export interface GenerateOption {
  optionContent: string;
  isCorrect: boolean;
}

export interface GenerateQuestion {
  questionContent: string;
  questionType: string;
  point: string;
  options: GenerateOption[];
}

export interface GenerateExerciseResponse {
  exerciseTitle: string;
  exerciseDescription: string;
  questions: GenerateQuestion[];
}
