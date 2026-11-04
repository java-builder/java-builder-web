"use client";

import { RotateCcw, X, Layers, CalendarDays } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/select";
import { Challenge } from "@/app/challenges/types";

interface ChallengeToolbarProps {
  challenge: Challenge;
  activePhaseFilter: number | "all";
  setActivePhaseFilter: (val: number | "all") => void;
  onResetProgress: () => void;
  phaseOptions: FilterOption<string | number>[];
  filteredCount?: number;
  isEnrolled?: boolean;
  isLoading?: boolean;
}

export function ChallengeToolbar({
  challenge,
  activePhaseFilter,
  setActivePhaseFilter,
  onResetProgress,
  phaseOptions,
  filteredCount,
  isEnrolled = false,
  isLoading = false,
}: ChallengeToolbarProps) {
  const currentPhase =
    activePhaseFilter !== "all"
      ? challenge.phases.find((p) => p.id === activePhaseFilter)
      : null;

  return (
    <div className="relative z-20 rounded-t-xl border-b border-[#E8E8E8] bg-white p-4 sm:p-5 dark:border-border dark:bg-surface transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Title & Day Count */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#FFF0E8] dark:bg-primary/15 text-[#FF5A1F] flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-[#171717] dark:text-white leading-tight">
                Lộ trình ngày học
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F8F8F8] dark:bg-background text-[#64748B] dark:text-slate-300 border border-[#E8E8E8] dark:border-border whitespace-nowrap">
                {isLoading ? (
                  <span className="inline-block w-14 h-3 bg-gray-300/80 dark:bg-slate-600 rounded " />
                ) : (
                  `${filteredCount ?? challenge.days.length} ngày đã phát hành`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Phase Dropdown Filter & Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {challenge.phases.length > 0 && (
            <div className="w-full sm:w-56 md:w-64">
              <FilterSelect
                value={activePhaseFilter}
                onChange={(val) =>
                  setActivePhaseFilter(val === "all" ? "all" : Number(val))
                }
                options={phaseOptions}
                placeholder="Chọn giai đoạn..."
                icon={<Layers className="h-4 w-4 text-[#FF5A1F] shrink-0" />}
                size="md"
                align="right"
                triggerClassName="h-10 bg-white dark:bg-surface border-[#E8E8E8] dark:border-border rounded-xl text-xs sm:text-sm px-3 shadow-2xs hover:bg-[#FFF0E8]/50"
              />
            </div>
          )}

          {isEnrolled && (
            <button
              type="button"
              onClick={onResetProgress}
              className="h-10 px-3 inline-flex items-center gap-1.5 rounded-full border border-[#E8E8E8] bg-white text-xs font-medium text-muted-foreground hover:text-[#FF5A1F] dark:border-border dark:bg-surface rounded-full transition cursor-pointer shrink-0 shadow-2xs"
              title="Làm mới hiển thị tiến độ"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Phase Info Banner */}
      {currentPhase && (
        <div className="mt-3.5 pt-3 border-t border-[#E8E8E8] dark:border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded bg-[#FFF0E8] dark:bg-primary/15 text-[#FF5A1F] font-bold text-[11px] shrink-0">
              {currentPhase.badge}
            </span>
            <span className="font-semibold text-[#171717] dark:text-white truncate">
              {currentPhase.title}
            </span>
            {currentPhase.daysNumber && currentPhase.daysNumber.length > 0 && (
              <span className="text-muted-foreground shrink-0 hidden sm:inline">
                • {currentPhase.daysNumber.length} ngày học
              </span>
            )}
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
