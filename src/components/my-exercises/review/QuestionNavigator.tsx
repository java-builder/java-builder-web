import type { QuestionResultResponse } from "@/types/exercise-submission";
import { getQuestionStatus } from "./helpers";

interface QuestionNavigatorProps {
  questions: QuestionResultResponse[];
  onSelectQuestion: (questionId: string) => void;
}

const STATUS_BUTTON_CLASSES: Record<"correct" | "incorrect" | "skipped", string> = {
  correct:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800",
  incorrect:
    "bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800",
  skipped:
    "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800",
};

const STATUS_LABEL: Record<"correct" | "incorrect" | "skipped", string> = {
  correct: "Đúng",
  incorrect: "Sai",
  skipped: "Bỏ qua",
};

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded bg-emerald-400" />
        Đúng
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded bg-rose-400" />
        Sai
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded bg-amber-400" />
        Bỏ qua
      </span>
    </div>
  );
}

export default function QuestionNavigator({
  questions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-5 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Bản đồ câu hỏi
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Bấm vào số để chuyển nhanh đến câu hỏi tương ứng
          </p>
        </div>
        <div className="hidden sm:block">
          <Legend />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5">
          {questions.map((q, idx) => {
            const hasAnswer = (q.userSelectedOptionIds || []).length > 0;
            const status = getQuestionStatus(q.isCorrect, hasAnswer);
            return (
              <button
                key={q.questionId}
                type="button"
                onClick={() => onSelectQuestion(q.questionId)}
                className={`flex h-9 w-full items-center justify-center rounded-md text-xs font-semibold ring-1 transition ${STATUS_BUTTON_CLASSES[status]}`}
                title={`Câu ${idx + 1} — ${STATUS_LABEL[status]}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex sm:hidden">
          <Legend />
        </div>
      </div>
    </div>
  );
}
