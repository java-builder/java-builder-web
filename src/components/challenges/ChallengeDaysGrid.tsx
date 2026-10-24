"use client";

import { CheckCircle2, Lock, Zap } from "lucide-react";
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
          const isInProgress = d.status === "in_progress";
          const isFreeDay = isChallengeFree || Boolean(d.isFreePreview);
          const isLockedByPaywall = !isChallengeFree && !isUnlockedAll && !isFreeDay;

          let buttonClass =
            "bg-gray-50/70 border-gray-200/90 text-gray-600 hover:bg-gray-100/80 hover:border-accent/40 dark:bg-slate-800/50 dark:border-slate-700/80 dark:text-gray-300 dark:hover:bg-slate-800";

          if (isCompleted) {
            buttonClass =
              "bg-emerald-50/80 border-emerald-300/80 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 font-bold";
          } else if (isInProgress) {
            buttonClass =
              "bg-accent/15 border-accent text-accent font-bold ring-2 ring-accent/30 shadow-xs";
          }

          if (isSelected) {
            buttonClass +=
              " ring-2 ring-offset-2 ring-accent border-accent bg-accent/10 shadow-sm scale-105 z-10";
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
                <span className="absolute -top-1.5 -left-1 px-1.5 rounded-sm text-[8px] font-bold bg-emerald-500 text-white shadow-2xs leading-tight">
                  FREE
                </span>
              )}
              {/* Locked Pro badge */}
              {isLockedByPaywall && (
                <span className="absolute -top-1.5 -right-1 px-1.5 rounded-sm text-[8px] font-bold bg-amber-500 text-white shadow-2xs leading-tight">
                  PRO
                </span>
              )}

              <span className="text-[11px] uppercase font-bold leading-none tracking-tight">
                N{d.day}
              </span>

              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : isLockedByPaywall ? (
                  <Lock className="w-3 h-3 text-amber-500/80 group-hover:text-amber-500 transition-colors" />
                ) : isInProgress ? (
                  <Zap className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" />
                ) : isFreeDay ? (
                  <Zap className="w-3 h-3 text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                ) : (
                  <Lock className="w-3 h-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
