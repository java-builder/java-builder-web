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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 flex-1">
              {question.content}
            </h3>
            <span className="flex-shrink-0 px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
              {question.score}đ
            </span>
          </div>
          {isMultiple && (
            <p className="text-xs text-gray-500 italic">
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
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50'
                } ${isSubmitted ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => onAnswerChange(question.id, option.id, isMultiple)}
                  disabled={isSubmitted}
                  className="mt-0.5 w-4 h-4 text-accent focus:ring-accent flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold mr-2">
                    {optionLetter}
                  </span>
                  <span className="text-sm text-gray-900">{option.content}</span>
                </div>
              </label>
            );
          })}
      </div>
    </div>
  );
}
