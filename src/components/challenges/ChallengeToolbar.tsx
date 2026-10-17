"use client";

import { LayoutGrid, List, RotateCcw, X, Layers } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { Challenge } from "@/app/challenges/types";

interface ChallengeToolbarProps {
  challenge: Challenge;
  activePhaseFilter: number | "all";
  setActivePhaseFilter: (val: number | "all") => void;
  viewMode: "matrix" | "list";
  setViewMode: (mode: "matrix" | "list") => void;
  onResetProgress: () => void;
  phaseOptions: FilterOption<string | number>[];
}

export function ChallengeToolbar({
  challenge,
  activePhaseFilter,
  setActivePhaseFilter,
  viewMode,
  setViewMode,
  onResetProgress,
  phaseOptions,
}: ChallengeToolbarProps) {
  const currentPhase =
    activePhaseFilter !== "all"
      ? challenge.phases.find((p) => p.id === activePhaseFilter)
      : null;

  return (
    <div className="relative z-20 rounded-xl border border-gray-200 bg-white p-3 sm:p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Phase Dropdown (FilterSelect) */}
        <div className="w-full sm:w-80">
          <FilterSelect
            value={activePhaseFilter}
            onChange={(val) =>
              setActivePhaseFilter(val === "all" ? "all" : Number(val))
            }
            options={phaseOptions}
            placeholder="Chọn chặng lộ trình..."
            icon={<Layers className="h-4 w-4 text-accent shrink-0" />}
            size="md"
            triggerClassName="bg-gray-50/70 dark:bg-slate-900/60 border-gray-200 dark:border-slate-700 rounded-md"
          />
        </div>

        {/* View Mode & Reset Controls */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center rounded-md border border-gray-200 bg-gray-50/70 p-1 dark:border-slate-700 dark:bg-slate-900/60">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-white text-accent shadow-xs dark:bg-slate-800 dark:text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Dạng lưới ô"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lưới {challenge.totalDays} ô</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-accent shadow-xs dark:bg-slate-800 dark:text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Dạng danh sách"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Danh sách</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResetProgress}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50/70 text-muted-foreground hover:text-foreground hover:border-gray-300 dark:border-slate-700 dark:bg-slate-900/60 transition cursor-pointer shrink-0"
            title="Đặt lại tiến độ thử thách"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Active Phase Info Banner */}
      {currentPhase && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-semibold text-[11px] shrink-0">
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
            className="text-muted-foreground hover:text-accent transition cursor-pointer flex items-center gap-1 shrink-0 ml-2"
          >
            <span className="text-xs">Xem tất cả</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
