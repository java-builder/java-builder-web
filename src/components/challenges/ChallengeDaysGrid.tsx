"use client";

import { CheckCircle2, Lock, Zap } from "lucide-react";
import { DayChallenge } from "@/app/challenges/types";

interface ChallengeDaysGridProps {
  days: DayChallenge[];
  totalDays: number;
  freePreviewDays?: number;
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  viewMode: "matrix" | "list";
  isUnlockedAll: boolean;
}

export function ChallengeDaysGrid({
  days,
  totalDays,
  freePreviewDays = 3,
  selectedDayNumber,
  onSelectDay,
  viewMode,
  isUnlockedAll,
}: ChallengeDaysGridProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground font-semibold px-1">
        Danh sách ngày ({days.length})
      </div>

      {/* Matrix View */}
      {viewMode === "matrix" ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3">
          <div
            className={`grid gap-2 ${
              totalDays <= 14
                ? "grid-cols-4 sm:grid-cols-7"
                : totalDays <= 30
                  ? "grid-cols-5 sm:grid-cols-6 lg:grid-cols-5"
                  : "grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6"
            }`}
          >
            {days.map((d) => {
              const isSelected = d.day === selectedDayNumber;
              const isCompleted = d.status === "completed";
              const isInProgress = d.status === "in_progress";
              const isFreeDay = d.day <= freePreviewDays;
              const isLockedByPaywall = !isUnlockedAll && !isFreeDay;

              let buttonClass =
                "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-slate-900/40 dark:border-slate-700 dark:text-gray-400";
              if (isCompleted) {
                buttonClass =
                  "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 font-bold";
              } else if (isInProgress) {
                buttonClass =
                  "bg-accent/15 border-accent text-accent font-bold ring-2 ring-accent/30";
              }

              if (isSelected) {
                buttonClass +=
                  " ring-2 ring-offset-2 ring-accent shadow-xs scale-105 z-10";
              }

              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => onSelectDay(d.day)}
                  className={`h-11 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer relative ${buttonClass}`}
                >
                  {/* Free preview badge */}
                  {isFreeDay && (
                    <span className="absolute -top-1 -left-1 px-1 rounded-sm text-[8px] font-bold bg-emerald-500 text-white leading-tight">
                      FREE
                    </span>
                  )}
                  {/* Locked Pro badge */}
                  {isLockedByPaywall && (
                    <span className="absolute -top-1 -right-1 px-1 rounded-sm text-[8px] font-bold bg-amber-500 text-white leading-tight">
                      PRO
                    </span>
                  )}

                  <span className="text-[10px] uppercase font-semibold leading-none opacity-80">
                    N{d.day}
                  </span>
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : isLockedByPaywall ? (
                      <Lock className="w-3 h-3 text-amber-500" />
                    ) : isInProgress ? (
                      <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
                    ) : (
                      <Lock className="w-3 h-3 text-muted-foreground/60" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-muted-foreground pt-1">
            💡 Nhấp vào từng ô ngày để xem tấm bản đồ định hướng chi tiết ở bên cạnh.
          </p>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {days.map((d) => {
            const isSelected = d.day === selectedDayNumber;
            const isCompleted = d.status === "completed";
            const isInProgress = d.status === "in_progress";

            return (
              <div
                key={d.day}
                onClick={() => onSelectDay(d.day)}
                className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-accent/10 border-accent shadow-xs"
                    : "bg-white border-gray-200 hover:border-gray-300 dark:bg-slate-800 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isInProgress
                            ? "bg-accent text-white"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {d.day}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {d.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {d.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {d.day <= freePreviewDays ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Free
                      </span>
                    ) : !isUnlockedAll ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                        <Lock className="w-3 h-3 text-amber-500" />
                        PRO
                      </span>
                    ) : null}

                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isInProgress ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent/20 text-accent">
                        Đang học
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/40" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
