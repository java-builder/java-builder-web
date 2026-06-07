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
