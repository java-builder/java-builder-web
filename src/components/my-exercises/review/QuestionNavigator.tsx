import type { QuestionResultResponse } from "@/types/exercise-submission";
import { getQuestionStatus } from "./helpers";

interface QuestionNavigatorProps {
  questions: QuestionResultResponse[];
  onSelectQuestion: (questionId: string) => void;
}

const STATUS_BUTTON_CLASSES: Record<"correct" | "incorrect" | "skipped", string> = {
  correct:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  incorrect:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
  skipped:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
};

const STATUS_LABEL: Record<"correct" | "incorrect" | "skipped", string> = {
  correct: "Đúng",
  incorrect: "Sai",
  skipped: "Bỏ qua",
};

export default function QuestionNavigator({
  questions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  const correctCount = questions.filter((q) => q.isCorrect).length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Danh sách câu hỏi
        </h3>
        <span className="text-xs font-bold text-foreground tabular-nums">
          {correctCount}/{questions.length} đúng
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const hasAnswer = (q.userSelectedOptionIds || []).length > 0;
          const status = getQuestionStatus(q.isCorrect, hasAnswer);
          return (
            <button
              key={q.questionId}
              type="button"
              onClick={() => onSelectQuestion(q.questionId)}
              className={`flex h-9 w-full items-center justify-center rounded-xl border text-xs font-bold tabular-nums transition cursor-pointer ${STATUS_BUTTON_CLASSES[status]}`}
              title={`Câu ${idx + 1} — ${STATUS_LABEL[status]}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          Đúng
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
          Sai
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
          Bỏ qua
        </span>
      </div>
    </div>
  );
}
