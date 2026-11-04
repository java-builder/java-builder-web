import { Flag, Clock, X } from 'lucide-react';
import { Difficulty } from '@/types/exercise';

interface MobileQuestionNavProps {
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
}

export default function MobileQuestionNav({
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
}: MobileQuestionNavProps) {
  const getQuestionStatus = (index: number) => {
    const questionId = questionIds[index];
    const isAnswered = answeredQuestions.has(`q-${index}`);
    const isMarked = markedQuestions.has(questionId);
    const isCurrent = index === currentQuestion;

    if (isCurrent) {
      return 'bg-primary text-primary-foreground border-primary';
    }
    if (isMarked) {
      return 'bg-warning-soft text-warning border-warning/30';
    }
    if (isAnswered) {
      return 'bg-success-soft text-success border-success/30';
    }
    return 'bg-background text-text-secondary border-border';
  };

  const isLowTime = timeRemaining <= 300;

  return (
    <div className="lg:hidden sticky top-14 bg-surface/95 backdrop-blur-md border-b border-border z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <h2 className="text-sm font-bold text-foreground truncate">{title}</h2>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getDifficultyColor(
              difficulty
            )}`}
          >
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums border ${
            isLowTime
              ? 'bg-error-soft text-error border-error/25'
              : 'bg-muted text-foreground border-border'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-error' : 'text-primary'}`} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="ml-2 p-1.5 rounded-full hover:bg-muted text-text-muted hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Question List */}
      <div className="overflow-x-auto px-4 py-2">
        <div className="flex gap-1.5 min-w-max">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionId = questionIds[index];
            const isMarked = markedQuestions.has(questionId);

            return (
              <button
                key={index}
                type="button"
                onClick={() => onQuestionClick(index)}
                className={`relative shrink-0 w-8 h-8 rounded-lg border font-semibold text-xs transition-colors ${getQuestionStatus(
                  index
                )}`}
              >
                {index + 1}
                {isMarked && (
                  <Flag className="absolute -top-1 -right-1 w-2.5 h-2.5 text-warning fill-current" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
