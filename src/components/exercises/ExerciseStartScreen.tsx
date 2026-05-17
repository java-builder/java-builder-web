import { 
  ClockIcon, 
  TrophyIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ExerciseDetailResponse, Difficulty, ExerciseType } from '@/types/exercise';

interface ExerciseStartScreenProps {
  exercise: ExerciseDetailResponse;
  onStart: () => void;
  onExit: () => void;
  getDifficultyColor: (difficulty: Difficulty) => string;
  getDifficultyLabel: (difficulty: Difficulty) => string;
  getExerciseTypeLabel: (type: ExerciseType) => string;
}

export default function ExerciseStartScreen({
  exercise,
  onStart,
  onExit,
  getDifficultyColor,
  getDifficultyLabel,
  getExerciseTypeLabel
}: ExerciseStartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-purple-500/5 to-blue-500/5 dark:from-accent/10 dark:via-purple-500/10 dark:to-blue-500/10 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-blue-400 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm">Quay lại</span>
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 sm:p-8 border border-gray-100 dark:border-slate-700">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent to-blue-600 mb-3">
              <DocumentTextIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 max-w-xl mx-auto px-2 leading-relaxed">
                {exercise.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap px-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {getDifficultyLabel(exercise.difficulty)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium text-accent dark:text-blue-400 bg-accent/10 dark:bg-blue-500/20">
                {getExerciseTypeLabel(exercise.exerciseType)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 sm:p-5 text-center border border-blue-100 dark:border-blue-800/50">
              <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">{exercise.timeLimit}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">phút</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-3 sm:p-5 text-center border border-purple-100 dark:border-purple-800/50">
              <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">{exercise.questions.length}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">câu hỏi</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-3 sm:p-5 text-center border border-amber-100 dark:border-amber-800/50">
              <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 dark:text-amber-400 mx-auto mb-1.5 sm:mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">{exercise.maxScore}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">điểm</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3.5 sm:p-4 mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
              <CheckCircleIcon className="w-4 h-4 text-accent dark:text-blue-400 flex-shrink-0" />
              Hướng dẫn
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span>Thời gian: <strong className="text-gray-900 dark:text-white">{exercise.timeLimit} phút</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span>Đếm ngược thời gian khi bắt đầu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-blue-400 mt-0.5 flex-shrink-0">•</span>
                <span>Có thể nộp bài sớm bất cứ lúc nào</span>
              </li>
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-accent to-blue-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  );
}
