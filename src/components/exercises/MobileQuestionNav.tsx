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
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (isMarked) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-400';
    }
    if (isAnswered) {
      return 'bg-green-100 text-green-700 border-green-400';
    }
    return 'bg-white text-gray-700 border-gray-300';
  };

  const isLowTime = timeRemaining <= 300;

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex-1 min-w-0 mr-2">
          <h2 className="text-sm font-bold text-gray-900 truncate">{title}</h2>
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
          isLowTime ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
        }`}>
          <Clock className={`w-4 h-4 ${isLowTime ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-bold">{formatTime(timeRemaining)}</span>
        </div>
        <button
          onClick={onExit}
          className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Question List */}
      <div className="overflow-x-auto px-4 py-2">
        <div className="flex gap-2 min-w-max">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionId = questionIds[index];
            const isMarked = markedQuestions.has(questionId);
            
            return (
              <button
                key={index}
                onClick={() => onQuestionClick(index)}
                className={`relative flex-shrink-0 w-10 h-10 rounded-lg border-2 font-medium text-sm transition-all ${getQuestionStatus(index)}`}
              >
                {index + 1}
                {isMarked && (
                  <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-600 fill-yellow-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
