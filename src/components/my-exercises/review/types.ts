export type QuestionFilter = "all" | "correct" | "incorrect" | "skipped";

export const QUESTION_FILTER_LABELS: Record<QuestionFilter, string> = {
  all: "Tất cả",
  correct: "Đúng",
  incorrect: "Sai",
  skipped: "Bỏ qua",
};

export type AiAnalysisStatus = "idle" | "loading" | "done";

export interface QuestionCounts {
  all: number;
  correct: number;
  incorrect: number;
  skipped: number;
}
