"use client";

import { RotateCcw, X, Layers, CalendarDays, CheckCircle2, Lock, Zap } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { Challenge } from "@/app/challenges/types";

interface ChallengeToolbarProps {
  challenge: Challenge;
  activePhaseFilter: number | "all";
  setActivePhaseFilter: (val: number | "all") => void;
  onResetProgress: () => void;
  phaseOptions: FilterOption<string | number>[];
  filteredCount?: number;
}

export function ChallengeToolbar({
  challenge,
  activePhaseFilter,
  setActivePhaseFilter,
  onResetProgress,
  phaseOptions,
  filteredCount,
}: ChallengeToolbarProps) {
  const currentPhase =
    activePhaseFilter !== "all"
      ? challenge.phases.find((p) => p.id === activePhaseFilter)
      : null;

  return (
    <div className="relative z-10 border-b border-gray-100 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title + Phase Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                Lộ trình ngày học
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {filteredCount ?? challenge.days.length} ngày đã phát hành
              </p>
            </div>
          </div>

          {/* Phase Filter Dropdown */}
          {challenge.phases.length > 0 && (
            <div className="w-full sm:w-72">
              <FilterSelect
                value={activePhaseFilter}
                onChange={(val) =>
                  setActivePhaseFilter(val === "all" ? "all" : Number(val))
                }
                options={phaseOptions}
                placeholder="Chọn giai đoạn..."
                icon={<Layers className="h-4 w-4 text-accent shrink-0" />}
                size="sm"
                triggerClassName="bg-gray-50/80 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          )}
        </div>

        {/* Right: Legend Badges + Reset Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
          {/* Status Indicators Legend */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Học thử (Free)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium border border-amber-200/60 dark:border-amber-800/60">
              <Lock className="w-2.5 h-2.5 text-amber-600" />
              Gói Pro
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-accent dark:bg-blue-950/40 dark:text-blue-300 font-medium border border-blue-200/60 dark:border-blue-800/60">
              <Zap className="w-2.5 h-2.5 text-accent fill-accent" />
              Đang học
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 font-medium">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
              Đã xong
            </span>
          </div>

          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block" />

          {/* Reset progress */}
          <button
            type="button"
            onClick={onResetProgress}
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/70 text-xs text-muted-foreground hover:text-foreground hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800/60 transition cursor-pointer shrink-0"
            title="Làm mới hiển thị tiến độ"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="text-[11px] font-medium hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Active Phase Info Banner */}
      {currentPhase && (
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-bold text-[11px] shrink-0">
              {currentPhase.badge}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {currentPhase.title}
            </span>
            <span className="text-muted-foreground shrink-0 hidden sm:inline">
              • {currentPhase.dayRange} ({currentPhase.weekRange})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActivePhaseFilter("all")}
            className="text-muted-foreground hover:text-accent transition cursor-pointer flex items-center gap-1 shrink-0 ml-2 font-medium"
          >
            <span className="text-xs">Xem tất cả ngày</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
