import { QuestionDetail } from '@/types/exercise';
import { Check, CheckCircle2, Flag } from 'lucide-react';
import PublicMarkdownRenderer from '@/components/blogs/PublicMarkdownRenderer';

interface QuestionCardProps {
  question: QuestionDetail;
  index: number;
  isCurrent?: boolean;
  selectedOptions: string[];
  isSubmitted: boolean;
  isMarked: boolean;
  onAnswerChange: (questionId: string, optionId: string, isMultiple: boolean) => void;
  onToggleMark: (questionId: string) => void;
  onFocusQuestion?: (index: number) => void;
}

export default function QuestionCard({
  question,
  index,
  isCurrent = false,
  selectedOptions,
  isSubmitted,
  isMarked,
  onAnswerChange,
  onToggleMark,
  onFocusQuestion,
}: QuestionCardProps) {
  const isMultiple = question.questionType === 'MULTIPLE_CHOICE';
  const isAnswered = selectedOptions.length > 0;

  return (
    <div
      id={`question-${index}`}
      onClick={() => onFocusQuestion?.(index)}
      className={`bg-surface rounded-2xl border p-5 sm:p-6 scroll-mt-24 transition-colors shadow-2xs ${
        isCurrent
          ? 'border-primary/40'
          : 'border-border'
      }`}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3.5 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20 text-xs font-bold">
            Câu {index + 1}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-background text-text-secondary border border-border text-xs font-semibold">
            {question.score} điểm
          </span>
          <span className="text-xs text-text-muted font-medium">
            {isMultiple ? '• Chọn nhiều đáp án' : '• Chọn 1 đáp án'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAnswered && !isSubmitted && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-soft text-success border border-success/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã chọn</span>
            </span>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFocusQuestion?.(index);
                onToggleMark(question.id);
              }}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                isMarked
                  ? 'bg-warning-soft text-warning border-warning/35'
                  : 'bg-surface text-text-muted border-border hover:bg-muted/60 hover:text-foreground'
              }`}
              title={isMarked ? 'Bỏ đánh dấu' : 'Đánh dấu xem lại'}
            >
              <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isMarked ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-4 text-foreground">
        <PublicMarkdownRenderer
          content={question.content}
          className="prose prose-slate dark:prose-invert max-w-none text-foreground [&>p]:font-semibold [&>p]:my-1.5"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const optionLetter = String.fromCharCode(65 + option.orderIndex - 1);
            const hasCodeBlock = option.content.includes('```');

            return (
              <div
                key={option.id}
                role="button"
                tabIndex={isSubmitted ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onFocusQuestion?.(index);
                  if (!isSubmitted) {
                    onAnswerChange(question.id, option.id, isMultiple);
                  }
                }}
                onKeyDown={(e) => {
                  if (!isSubmitted && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onFocusQuestion?.(index);
                    onAnswerChange(question.id, option.id, isMultiple);
                  }
                }}
                aria-disabled={isSubmitted}
                className={`group w-full flex ${
                  hasCodeBlock ? 'items-start' : 'items-center'
                } justify-between text-left gap-3.5 px-4 py-3.5 rounded-xl border transition-all select-none ${
                  isSelected
                    ? 'border-primary bg-primary-soft/50 dark:bg-primary/15 shadow-2xs'
                    : 'border-border bg-background/60 hover:bg-muted/60 hover:border-primary/35'
                } ${isSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div
                  className={`flex ${
                    hasCodeBlock ? 'items-start' : 'items-center'
                  } gap-3.5 flex-1 min-w-0`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${
                      hasCodeBlock ? 'mt-1.5' : ''
                    } ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-surface text-text-secondary border border-border group-hover:border-primary/40 group-hover:text-primary'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <div className="text-sm sm:text-[15px] font-medium text-foreground leading-snug flex-1 min-w-0">
                    <PublicMarkdownRenderer
                      content={option.content}
                      className={`prose prose-slate dark:prose-invert max-w-none text-foreground ${
                        hasCodeBlock
                          ? '[&>div]:my-0'
                          : '[&>p]:mb-0 [&>p]:inline'
                      }`}
                    />
                  </div>
                </div>

                {/* Right Selection Indicator */}
                <span
                  className={`w-5 h-5 ${
                    isMultiple ? 'rounded-md' : 'rounded-full'
                  } ${
                    hasCodeBlock ? 'mt-2.5' : ''
                  } border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-border bg-surface group-hover:border-primary/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
