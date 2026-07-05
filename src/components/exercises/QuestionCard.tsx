import { QuestionDetail } from '@/types/exercise';
import { Flag } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionDetail;
  index: number;
  selectedOptions: string[];
  isSubmitted: boolean;
  isMarked: boolean;
  onAnswerChange: (questionId: string, optionId: string, isMultiple: boolean) => void;
  onToggleMark: (questionId: string) => void;
}

export default function QuestionCard({
  question,
  index,
  selectedOptions,
  isSubmitted,
  isMarked,
  onAnswerChange,
  onToggleMark
}: QuestionCardProps) {
  const isMultiple = question.questionType === 'MULTIPLE_CHOICE';

  return (
    <div id={`question-${index}`} className="bg-white dark:bg-slate-800/40 rounded-2xl shadow-xs p-4 md:p-5 border border-gray-200 dark:border-slate-800/80 scroll-mt-20">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold shadow-xs">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-100 flex-1 leading-snug">
              {question.content}
            </h3>
            <span className="flex-shrink-0 px-2 py-0.5 bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent-400 text-xs font-semibold rounded-md border border-accent/10">
              {question.score}đ
            </span>
          </div>
          {isMultiple && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
              (Chọn nhiều đáp án)
            </p>
          )}
        </div>
        {!isSubmitted && (
          <button
            onClick={() => onToggleMark(question.id)}
            className={`flex-shrink-0 p-2 rounded-xl transition-all border ${
              isMarked
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-slate-50 text-slate-400 border-slate-150 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-500 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-450'
            }`}
            title={isMarked ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}
          >
            <Flag className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-2.5 ml-0 md:ml-11">
        {question.options
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const optionLetter = String.fromCharCode(65 + option.orderIndex - 1);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !isSubmitted && onAnswerChange(question.id, option.id, isMultiple)}
                disabled={isSubmitted}
                className={`w-full flex items-start text-left gap-3 p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-accent dark:border-accent bg-accent/5 dark:bg-accent/10 shadow-xs'
                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 hover:border-accent/40 dark:hover:border-accent/40 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                } ${isSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start min-w-0">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-accent text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {optionLetter}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 pt-0.5 leading-snug">{option.content}</span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
