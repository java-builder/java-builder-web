"use client";

import { CheckCircle2, Lock, Unlock } from "lucide-react";
import { DayChallenge } from "@/app/challenges/types";

interface ChallengeDaysGridProps {
  days: DayChallenge[];
  totalDays?: number;
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  isUnlockedAll: boolean;
  isChallengeFree?: boolean;
  isEnrolled?: boolean;
  isLoading?: boolean;
}

export function ChallengeDaysGrid({
  days,
  selectedDayNumber,
  onSelectDay,
  isUnlockedAll,
  isChallengeFree = false,
  isEnrolled = false,
  isLoading = false,
}: ChallengeDaysGridProps) {
  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 rounded-b-xl animate-pulse">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {Array.from({ length: 14 }).map((_, idx) => (
            <div
              key={idx}
              className="w-14 sm:w-16 h-12 sm:h-13 shrink-0 rounded-lg border border-gray-200/80 bg-gray-100/70 dark:border-slate-800 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-1.5"
            >
              <div className="h-2.5 w-6 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Không có ngày học nào phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-b-xl">
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {days.map((d) => {
          const isSelected = d.day === selectedDayNumber;
          const isCompleted = d.status === "completed";
          const isFreeDay = isChallengeFree || Boolean(d.isFreePreview);
          const isUnlocked = isChallengeFree || isUnlockedAll || isEnrolled || isFreeDay;
          const isLockedByPaywall = !isUnlocked;

          let buttonClass = "";

          if (isSelected) {
            buttonClass =
              "bg-accent/10 border-accent text-accent font-bold ring-2 ring-accent ring-offset-2 ring-offset-white dark:bg-accent/20 dark:border-accent dark:text-accent dark:ring-accent dark:ring-offset-slate-900 shadow-sm scale-105 z-10";
          } else if (isCompleted) {
            buttonClass =
              "bg-emerald-50/80 border-emerald-300/80 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:text-emerald-300 hover:border-emerald-400 dark:hover:border-emerald-700 font-semibold";
          } else if (isLockedByPaywall) {
            buttonClass =
              "bg-gray-50/60 border-gray-200/70 text-gray-400 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-500 hover:bg-gray-100/60 dark:hover:bg-slate-800/40 opacity-75 hover:opacity-100";
          } else {
            // Đã mở khóa bình thường (sạch sẽ, dark mode chuẩn không bị neon chói)
            buttonClass =
              "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-slate-800/60 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 shadow-2xs font-medium";
          }

          return (
            <button
              key={d.day}
              type="button"
              onClick={() => onSelectDay(d.day)}
              className={`w-14 sm:w-16 h-12 sm:h-13 shrink-0 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer relative select-none group ${buttonClass}`}
            >
              {/* Free preview badge */}
              {isFreeDay && (
                <span className="absolute -top-1.5 -left-1 px-1.5 py-0.5 rounded-sm text-[8px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs leading-none">
                  FREE
                </span>
              )}
              {/* Locked Pro badge */}
              {isLockedByPaywall && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-sm text-[8px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-2xs leading-none">
                  PRO
                </span>
              )}

              <span className="text-[11px] uppercase tracking-tight leading-none">
                N{d.day}
              </span>

              <div className="mt-1 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                ) : isLockedByPaywall ? (
                  <Lock className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-500 transition-colors" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400 group-hover:text-accent transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
