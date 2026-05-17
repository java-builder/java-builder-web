import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Difficulty } from '@/types/exercise';

interface ExerciseHeaderProps {
  title: string;
  difficulty: Difficulty;
  timeRemaining: number;
  onExit: () => void;
  getDifficultyColor: (difficulty: Difficulty) => string;
  getDifficultyLabel: (difficulty: Difficulty) => string;
  formatTime: (seconds: number) => string;
}

export default function ExerciseHeader({
  title,
  difficulty,
  timeRemaining,
  onExit,
  getDifficultyColor,
  getDifficultyLabel,
  formatTime
}: ExerciseHeaderProps) {
  const isTimeWarning = timeRemaining < 60 && timeRemaining > 0;
  const isTimeUp = timeRemaining <= 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 mb-4 sticky top-4 z-10 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h1>
          <span className={`hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${
            isTimeUp 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
              : timeRemaining < 300 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-accent dark:text-blue-400'
          } ${isTimeWarning ? 'animate-pulse' : ''}`}>
            <ClockIcon className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          
          <button
            onClick={onExit}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Thoát"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
