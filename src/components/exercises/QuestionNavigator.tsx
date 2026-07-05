import { Flag, Check, Clock, X } from 'lucide-react';
import { Difficulty } from '@/types/exercise';

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
}: QuestionNavigatorProps) {
  const getQuestionStatus = (index: number) => {
    const questionId = questionIds[index];
    const isAnswered = answeredQuestions.has(`q-${index}`);
    const isMarked = markedQuestions.has(questionId);
    const isCurrent = index === currentQuestion;

    if (isCurrent) {
      return 'bg-accent text-white border-accent';
    }
    if (isMarked) {
      return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
    }
    if (isAnswered) {
      return 'bg-green-50 text-green-700 border-green-300 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30';
    }
    return 'bg-white text-slate-700 border-gray-300 hover:border-gray-400 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-800 dark:hover:border-slate-700';
  };

  const isLowTime = timeRemaining <= 300; // 5 minutes

  return (
    <div className="bg-white dark:bg-slate-800/40 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800/80 p-4 sticky top-4">
      {/* Header with Exit button */}
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200 dark:border-slate-850">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-2 line-clamp-2">{title}</h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        <button
          onClick={onExit}
          className="flex-shrink-0 ml-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Thoát"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Timer */}
      <div className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-xl ${
        isLowTime 
          ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' 
          : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
      }`}>
        <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
        <span className="text-lg font-bold">{formatTime(timeRemaining)}</span>
      </div>

      {/* Question List Title */}
      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mb-3">Danh sách câu hỏi</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionId = questionIds[index];
          const isMarked = markedQuestions.has(questionId);
          
          return (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`relative h-10 rounded-xl border font-bold text-sm transition-all ${getQuestionStatus(index)}`}
            >
              {index + 1}
              {isMarked && (
                <Flag className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 text-xs font-semibold">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded border border-accent bg-accent"></div>
          <span className="text-slate-650 dark:text-slate-400">Câu hiện tại</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded border border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-700 dark:text-green-400" />
          </div>
          <span className="text-slate-650 dark:text-slate-400">Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Flag className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-current" />
          </div>
          <span className="text-slate-650 dark:text-slate-400">Đánh dấu xem lại</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded border border-gray-350 dark:border-slate-800 bg-white dark:bg-slate-900/50"></div>
          <span className="text-slate-650 dark:text-slate-400">Chưa trả lời</span>
        </div>
      </div>
    </div>
  );
}
