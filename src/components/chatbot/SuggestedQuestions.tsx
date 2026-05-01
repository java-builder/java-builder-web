interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-2 sm:px-3 md:px-4 pb-3 sm:pb-4">
      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
        Câu hỏi gợi ý:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="text-left px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-slate-600"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
