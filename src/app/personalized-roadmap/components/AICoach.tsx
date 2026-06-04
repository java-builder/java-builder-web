import { Brain, Sparkles } from "lucide-react";

interface AICoachProps {
  onOpenChat: () => void;
}

export function AICoach({ onOpenChat }: AICoachProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-950 dark:text-white">AI Coach</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">Trợ lý học tập của bạn</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                Tiến độ vượt mong đợi! 🎉
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Tốc độ học ổn định, có thể tăng độ khó lên 1 mức.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenChat}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-600 text-white text-sm font-semibold transition-colors"
      >
        <Brain className="w-4 h-4" />
        Trao đổi với AI Coach
      </button>
    </section>
  );
}
