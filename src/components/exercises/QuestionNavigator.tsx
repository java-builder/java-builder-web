import { Flag, Check, Clock, LogOut, CheckCircle2 } from 'lucide-react';
import { Difficulty } from '@/types/exercise';
import { Button } from '@/components/ui/button';

interface QuestionNavigatorProps {
  title: string;
  difficulty: Difficulty;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: Difficulty) => string;
  getDifficultyLabel: (difficulty: Difficulty) => string;
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<string>;
  markedQuestions: Set<string>;
  questionIds: string[];
  onQuestionClick: (index: number) => void;
  onExit: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

export default function QuestionNavigator({
  title,
  difficulty,
  timeRemaining,
  formatTime,
  getDifficultyColor,
  getDifficultyLabel,
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedQuestions,
  questionIds,
  onQuestionClick,
  onExit,
  onSubmit,
  isSubmitting = false,
  isSubmitted = false,
}: QuestionNavigatorProps) {
  const getQuestionStatus = (index: number) => {
    const questionId = questionIds[index];
    const isAnswered = answeredQuestions.has(`q-${index}`);
    const isMarked = markedQuestions.has(questionId);
    const isCurrent = index === currentQuestion;

    if (isCurrent) {
      return 'bg-primary text-primary-foreground border-primary shadow-2xs ring-2 ring-primary/20';
    }
    if (isMarked) {
      return 'bg-warning-soft text-warning border-warning/35';
    }
    if (isAnswered) {
      return 'bg-success-soft text-success border-success/35';
    }
    return 'bg-background text-text-secondary border-border hover:border-primary/40 hover:text-primary';
  };

  const isLowTime = timeRemaining <= 300; // 5 minutes
  const answeredCount = answeredQuestions.size;
  const progressPct =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 sticky top-20 shadow-2xs space-y-4">
      {/* Header with Exit button */}
      <div className="flex items-start justify-between gap-2.5 pb-3.5 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2 leading-snug">
            {title}
          </h2>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getDifficultyColor(
              difficulty
            )}`}
          >
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onExit}
          className="shrink-0 gap-1 text-text-muted hover:text-foreground"
          title="Thoát bài làm"
        >
          <LogOut className="w-3 h-3" />
          <span>Thoát</span>
        </Button>
      </div>

      {/* Timer */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${
          isLowTime
            ? 'bg-error-soft text-error border-error/30'
            : 'bg-background text-foreground border-border'
        }`}
      >
        <span className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${isLowTime ? 'text-error animate-pulse' : 'text-primary'}`} />
          Thời gian còn lại
        </span>
        <span className="text-base font-extrabold tabular-nums tracking-tight">
          {formatTime(timeRemaining)}
        </span>
      </div>

      {/* Progress & Question List Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Danh sách câu hỏi
          </h3>
          <span className="text-xs font-bold tabular-nums text-foreground">
            {answeredCount}/{totalQuestions}{' '}
            <span className="text-[11px] font-medium text-text-muted">
              ({progressPct}%)
            </span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionId = questionIds[index];
          const isMarked = markedQuestions.has(questionId);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onQuestionClick(index)}
              className={`relative h-9 rounded-xl border font-bold text-xs transition-all cursor-pointer ${getQuestionStatus(
                index
              )}`}
            >
              {index + 1}
              {isMarked && (
                <Flag className="absolute -top-1 -right-1 w-3 h-3 text-warning fill-current" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-[11px] font-medium text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-primary border border-primary shrink-0" />
          <span>Hiện tại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-success/35 bg-success-soft flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 text-success" />
          </div>
          <span>Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-warning/35 bg-warning-soft flex items-center justify-center shrink-0">
            <Flag className="w-2.5 h-2.5 text-warning fill-current" />
          </div>
          <span>Đánh dấu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-border bg-background shrink-0" />
          <span>Chưa làm</span>
        </div>
      </div>

      {/* Primary Submit Action inside Sticky Control Panel */}
      {onSubmit && !isSubmitted && (
        <div className="pt-3 border-t border-border">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isSubmitted}
            className="w-full h-10 font-semibold gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Đang nộp bài...'
                : `Nộp bài (${answeredCount}/${totalQuestions})`}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
