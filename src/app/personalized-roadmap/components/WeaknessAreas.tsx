import { Lightbulb, Sparkles } from "lucide-react";

interface WeakPoint {
  title: string;
  description: string;
  priority: string;
  tone: "rose" | "amber" | "blue";
}

interface WeaknessAreasProps {
  weakPoints: WeakPoint[];
  onGenerateExercise?: (weakPoint: WeakPoint) => void;
}

const priorityColors = {
  "Cá nhân hóa": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
  "Ưu tiên cao": "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40",
  "Quan trọng": "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
};

export function WeaknessAreas({ weakPoints, onGenerateExercise }: WeaknessAreasProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-gray-950 dark:text-white">
          Điểm cần cải thiện
        </h3>
      </div>

      <div className="space-y-3">
        {weakPoints.map((point, idx) => {
          const priorityClass = priorityColors[point.priority as keyof typeof priorityColors] || "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300";
          
          return (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-semibold text-gray-950 dark:text-white flex-1">
                  {point.title}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium border ${priorityClass}`}>
                  {point.priority}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
                {point.description}
              </p>
              
              {/* Generate Exercise Button */}
              {onGenerateExercise && (
                <button
                  onClick={() => onGenerateExercise(point)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Tạo bài tập luyện
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
