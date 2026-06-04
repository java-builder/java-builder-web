import { Clock3, Check, BookOpenCheck, Lightbulb } from "lucide-react";
import { useState } from "react";

interface Task {
  title: string;
  time: string;
  type: string;
}

interface TodayTasksProps {
  tasks: Task[];
  onViewSuggestion?: (task: Task) => void;
}

export function TodayTasks({ tasks, onViewSuggestion }: TodayTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const toggleTaskCompletion = (index: number) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-5 h-5 text-accent" />
          <h3 className="text-base font-bold text-gray-950 dark:text-white">
            Nhiệm vụ hôm nay
          </h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {completedTasks.size}/{tasks.length} hoàn thành
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const isCompleted = completedTasks.has(idx);
          
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 opacity-60"
                  : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <button
                onClick={() => toggleTaskCompletion(idx)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  isCompleted
                    ? "bg-accent border-accent"
                    : "border-gray-300 dark:border-slate-600 hover:border-accent hover:bg-accent/10"
                }`}
              >
                {isCompleted && <Check className="w-4 h-4 text-white font-bold stroke-[3]" />}
              </button>
              
              <div className="flex-1 min-w-0">
                {/* Title and Button on same line */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className={`text-sm font-semibold flex-1 transition-all ${
                    isCompleted
                      ? "line-through text-gray-500 dark:text-slate-500"
                      : "text-gray-900 dark:text-white"
                  }`}>
                    {task.title}
                  </h4>
                  
                  {/* AI Suggestion Button - next to title */}
                  {onViewSuggestion && !isCompleted && (
                    <button
                      onClick={() => onViewSuggestion(task)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-gray-600 dark:text-slate-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      Xem gợi ý
                    </button>
                  )}
                </div>
                
                {/* Time and Type badges */}
                <div className={`flex items-center gap-3 text-xs transition-opacity ${
                  isCompleted ? "opacity-50" : ""
                }`}>
                  <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
                    <Clock3 className="w-3 h-3" />
                    {task.time}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded font-medium">
                    {task.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
