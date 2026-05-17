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
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (isMarked) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-400';
    }
    if (isAnswered) {
      return 'bg-green-100 text-green-700 border-green-400';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:border-gray-400';
  };

  const isLowTime = timeRemaining <= 300; // 5 minutes

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
      {/* Header with Exit button */}
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{title}</h2>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        <button
          onClick={onExit}
          className="flex-shrink-0 ml-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          title="Thoát"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Timer */}
      <div className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-lg ${
        isLowTime ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
      }`}>
        <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
        <span className="text-lg font-bold">{formatTime(timeRemaining)}</span>
      </div>

      {/* Question List Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Danh sách câu hỏi</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionId = questionIds[index];
          const isMarked = markedQuestions.has(questionId);
          
          return (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`relative h-10 rounded-lg border-2 font-medium text-sm transition-all ${getQuestionStatus(index)}`}
            >
              {index + 1}
              {isMarked && (
                <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-600 fill-yellow-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-blue-600 bg-blue-600"></div>
          <span className="text-gray-600">Câu hiện tại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-green-400 bg-green-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-700" />
          </div>
          <span className="text-gray-600">Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-yellow-400 bg-yellow-100 flex items-center justify-center">
            <Flag className="w-3 h-3 text-yellow-600" />
          </div>
          <span className="text-gray-600">Đánh dấu xem lại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-gray-300 bg-white"></div>
          <span className="text-gray-600">Chưa trả lời</span>
        </div>
      </div>
    </div>
  );
}
