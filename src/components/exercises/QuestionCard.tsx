import { QuestionDetail } from '@/types/exercise';

interface QuestionCardProps {
  question: QuestionDetail;
  index: number;
  selectedOptions: string[];
  isSubmitted: boolean;
  onAnswerChange: (questionId: string, optionId: string, isMultiple: boolean) => void;
}

export default function QuestionCard({
  question,
  index,
  selectedOptions,
  isSubmitted,
  onAnswerChange
}: QuestionCardProps) {
  const isMultiple = question.questionType === 'MULTIPLE_CHOICE';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 md:p-5 border border-gray-100 dark:border-slate-700">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1">
              {question.content}
            </h3>
            <span className="flex-shrink-0 px-2 py-0.5 bg-accent/10 dark:bg-blue-500/20 text-accent dark:text-blue-400 text-xs font-medium rounded">
              {question.score}đ
            </span>
          </div>
          {isMultiple && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              (Chọn nhiều đáp án)
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 ml-0 md:ml-11">
        {question.options
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const optionLetter = String.fromCharCode(65 + option.orderIndex - 1);

            return (
              <label
                key={option.id}
                className={`flex items-start gap-2.5 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-accent dark:border-blue-500 bg-accent/5 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-slate-600 hover:border-accent/50 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                } ${isSubmitted ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => onAnswerChange(question.id, option.id, isMultiple)}
                  disabled={isSubmitted}
                  className="mt-0.5 w-4 h-4 text-accent dark:text-blue-500 focus:ring-accent dark:focus:ring-blue-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-semibold mr-2">
                    {optionLetter}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-200">{option.content}</span>
                </div>
              </label>
            );
          })}
      </div>
    </div>
  );
}
