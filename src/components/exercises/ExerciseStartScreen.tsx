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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent-400 transition-colors mb-5 font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">Quay lại</span>
        </button>

        <div className="bg-white dark:bg-slate-800/40 rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-slate-800/80">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 dark:bg-accent/20 text-accent mb-4">
              <DocumentTextIcon className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 px-2 tracking-tight">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 max-w-xl mx-auto px-2 leading-relaxed font-medium">
                {exercise.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap px-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(exercise.difficulty)}`}>
                {getDifficultyLabel(exercise.difficulty)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-accent dark:text-accent-400 bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30">
                {getExerciseTypeLabel(exercise.exerciseType)}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80">
              <ClockIcon className="w-7 h-7 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-0.5">{exercise.timeLimit}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">phút</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80">
              <DocumentTextIcon className="w-7 h-7 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-0.5">{exercise.questions.length}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">câu hỏi</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800/80">
              <TrophyIcon className="w-7 h-7 text-amber-500 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-0.5">{exercise.maxScore}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">điểm</div>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 sm:p-5 mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2 text-sm">
              <CheckCircleIcon className="w-4.5 h-4.5 text-accent dark:text-accent-400 flex-shrink-0" />
              Hướng dẫn
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-accent-400 mt-0.5 flex-shrink-0">•</span>
                <span>Thời gian: <strong className="text-slate-800 dark:text-slate-100 font-bold">{exercise.timeLimit} phút</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-accent-400 mt-0.5 flex-shrink-0">•</span>
                <span>Đếm ngược thời gian khi bắt đầu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent dark:text-accent-400 mt-0.5 flex-shrink-0">•</span>
                <span>Có thể nộp bài sớm bất cứ lúc nào</span>
              </li>
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full bg-accent hover:bg-accent/90 dark:bg-accent dark:hover:bg-accent/90 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  );
}
