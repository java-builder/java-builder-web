interface ExerciseFooterProps {
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: () => void;
}

export default function ExerciseFooter({
  answeredCount,
  totalQuestions,
  isSubmitting,
  isSubmitted,
  onSubmit
}: ExerciseFooterProps) {
  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4 sticky bottom-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <span className="font-bold text-accent">{answeredCount}</span>
          <span className="hidden sm:inline"> / {totalQuestions} câu</span>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || isSubmitted}
          className="bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Đang nộp...' : isSubmitted ? 'Đã nộp' : 'Nộp bài'}
        </button>
      </div>
    </div>
  );
}
