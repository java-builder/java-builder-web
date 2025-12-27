export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  answer: string;
  learningPathPlan?: LearningPathPlan;
}

export interface LearningPathPlan {
  title: string;
  duration: number;
  timeUnit: "DAY" | "WEEK" | "MONTH" | "YEAR";
  periods: PeriodPlan[];
}

export interface PeriodPlan {
  periodNumber: number;
  title: string;
  topics: TopicOutline[];
}

export interface TopicOutline {
  title: string;
  explanation?: string | null;
  lessons: LessonDetail[];
  exercises: ExerciseDetail[];
  quizzes: QuizItem[];
}

export interface LessonDetail {
  name: string;
  explanation: string;
  keywords: KeyConcept[];
}

export interface ExerciseDetail {
  title: string;
  instructions: GuideStep[];
  type: string;
}

export interface QuizItem {
  question: string;
  options: QuizOptionItem[];
  correctAnswer: string;
  explanation: string;
}

export interface KeyConcept {
  term: string;
  explanation: string;
}

export interface GuideStep {
  stepNumber: number;
  description: string;
  command?: string | null;
  codeBlock?: string | null;
}

export interface QuizOptionItem {
  label: "A" | "B" | "C" | "D";
  option: string;
}

export interface LearningPreferences {
  name: string;
  currentJob?: string;
  goals: string[];
  skills: string[];
  experience: string;
  timeCommitment: string;
  specificGoals: string;
  challenges?: string;
  preferredTopics?: string;
  timeline: string;
}

export interface CreateLearningPathRequest {
  learningPathPlan: LearningPathPlan;
}

// Backend Detail Response Types (từ mapper)
export interface LearningPathDetailResponse {
  id: string;
  title: string;
  duration: number;
  timeUnit: "DAY" | "WEEK" | "MONTH" | "YEAR";
  periods: PeriodPlanDetailResponse[];
  createdAt?: string;
  updatedAt?: string;
  learningPathPlan?: LearningPathPlan; // Backward compatibility
}

export interface PeriodPlanDetailResponse {
  id: string;
  periodNumber: number;
  title: string;
  topics: TopicOutlineDetailResponse[];
}

export interface TopicOutlineDetailResponse {
  id: string;
  title: string;
  explanation: string;
  lessons: LessonDetailResponse[];
  exercises: ExerciseDetailResponse[];
  quizzes: QuizItemDetailResponse[];
}

export interface LessonDetailResponse {
  id: string;
  name: string;
  explanation: string;
  keywords: KeyConceptDetailResponse[];
}

export interface KeyConceptDetailResponse {
  id: string;
  term: string;
  explanation: string;
}

export interface ExerciseDetailResponse {
  id: string;
  title: string;
  instructions: GuideStepDetailResponse[];
  type: string;
}

export interface GuideStepDetailResponse {
  id: string;
  stepNumber: number;
  description: string;
  command?: string | null;
  codeBlock?: string | null;
}

export interface QuizItemDetailResponse {
  id: string;
  question: string;
  options: QuizOptionItem[];
  correctAnswer: string;
  explanation: string;
}
