import { Code2, X, CheckCircle2, Clock, Zap } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  timeEstimate: string;
  weakPointTitle: string;
  completed: boolean;
}

interface GeneratedExercisesProps {
  exercises: Exercise[];
  onToggleComplete: (exerciseId: string) => void;
  onRemove: (exerciseId: string) => void;
}

const difficultyColors = {
  "Dễ": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  "Trung bình": "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  "Khó": "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
};

export function GeneratedExercises({ 
  exercises, 
  onToggleComplete, 
  onRemove 
}: GeneratedExercisesProps) {
  if (exercises.length === 0) return null;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="text-base font-bold text-gray-950 dark:text-white">
            Bài tập được gợi ý
          </h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {exercises.filter(e => e.completed).length}/{exercises.length} hoàn thành
        </span>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`group relative p-4 rounded-lg border transition-all ${
              exercise.completed
                ? "bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 opacity-60"
                : "bg-white dark:bg-slate-800 border-accent/30 hover:border-accent/50 shadow-sm"
            }`}
          >
            {/* Remove Button */}
            <button
              onClick={() => onRemove(exercise.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
              title="Xóa bài tập"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            </button>

            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => onToggleComplete(exercise.id)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  exercise.completed
                    ? "bg-accent border-accent"
                    : "border-gray-300 dark:border-slate-600 hover:border-accent"
                }`}
              >
                {exercise.completed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Weak Point Tag */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-[10px] text-gray-600 dark:text-slate-400 mb-2">
                  <Code2 className="w-3 h-3" />
                  {exercise.weakPointTitle}
                </div>

                {/* Title */}
                <h4 className={`text-sm font-semibold mb-2 ${
                  exercise.completed 
                    ? "line-through text-gray-500 dark:text-slate-500"
                    : "text-gray-950 dark:text-white"
                }`}>
                  {exercise.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
                  {exercise.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    difficultyColors[exercise.difficulty]
                  }`}>
                    {exercise.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    {exercise.timeEstimate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
