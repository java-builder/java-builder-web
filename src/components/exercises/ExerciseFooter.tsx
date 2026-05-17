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
    <div className="mt-4">
      {/* Desktop version - with stats */}
      <div className="hidden md:block bg-white rounded-lg shadow-md p-4 sticky bottom-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-accent">{answeredCount}</span>
            <span> / {totalQuestions} câu đã trả lời</span>
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

      {/* Mobile version - simple button only (navigator will be separate) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || isSubmitted}
          className="w-full bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-3.5 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-xl"
        >
          {isSubmitting ? 'Đang nộp...' : isSubmitted ? 'Đã nộp' : 'Nộp bài'}
        </button>
      </div>
    </div>
  );
}
