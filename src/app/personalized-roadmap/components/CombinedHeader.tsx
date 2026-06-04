import { ArrowLeft } from "lucide-react";

interface CombinedHeaderProps {
  onBack: () => void;
  roadmapTitle: string;
  currentLevel: string;
  dailyHours: string;
  targetMonths: string;
  startDate: string;
  overallProgress: number;
  focusAreas: Array<{ label: string; value: number; color: string }>;
  streak: number;
  weeklyGoal: { current: number; target: number };
}

export function CombinedHeader({
  onBack,
  roadmapTitle,
  currentLevel,
  dailyHours,
  targetMonths,
  startDate,
  overallProgress,
  focusAreas,
  streak,
  weeklyGoal,
}: CombinedHeaderProps) {
  const weeklyPercent = Math.round((weeklyGoal.current / weeklyGoal.target) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 mb-6">
      {/* Top Row - Greeting + Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-950 dark:text-white mb-1">
            Chào buổi sáng! 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Sẵn sàng chinh phục {roadmapTitle} hôm nay chưa?
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Streak - Compact */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-lg">
            <span className="text-lg">🔥</span>
            <div>
              <div className="text-sm font-bold text-orange-700 dark:text-orange-300 leading-tight">{streak} ngày</div>
              <div className="text-[9px] text-orange-600 dark:text-orange-400 uppercase tracking-wide leading-tight">Streak</div>
            </div>
          </div>

          {/* Weekly Goal - Compact */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-blue-200 dark:text-blue-700" />
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray={`${2 * Math.PI * 13}`} strokeDashoffset={`${2 * Math.PI * 13 * (1 - weeklyPercent / 100)}`} className="text-blue-500" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300">{weeklyPercent}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-700 dark:text-blue-300 leading-tight">{weeklyGoal.current}/{weeklyGoal.target} hrs</div>
              <div className="text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-wide leading-tight">Weekly Goal</div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Roadmap Info */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-950 dark:text-white mb-0.5 truncate">
            {roadmapTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
            <span>{currentLevel}</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span>{dailyHours}</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span>{targetMonths}</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span>{startDate}</span>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* Overall Progress */}
        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Tiến độ</p>
          <p className="text-2xl font-bold text-accent">{overallProgress}%</p>
        </div>

        {/* Skill Progress */}
        {focusAreas.map((area) => (
          <div key={area.label} className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{area.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-base font-bold text-gray-950 dark:text-white">{area.value}%</span>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                <div className={`h-full ${area.color}`} style={{ width: `${area.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
