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
      <div className="p-4 sm:p-5 rounded-b-xl ">
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
          let textClass = "";
          let iconColor = "";

          if (isSelected) {
            buttonClass =
              "bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/25 scale-105 z-10 ring-2 ring-[#FF5A1F]/40 ring-offset-2 ring-offset-white dark:ring-offset-[#181D28] font-extrabold";
            textClass = "text-white font-black";
            iconColor = "text-white";
          } else if (isCompleted) {
            buttonClass =
              "bg-emerald-50 border-emerald-300/90 text-emerald-800 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:border-emerald-700/70 dark:text-emerald-200 dark:hover:bg-emerald-950/60 shadow-2xs font-bold";
            textClass = "text-emerald-700 dark:text-emerald-300 font-bold";
            iconColor = "text-emerald-600 dark:text-emerald-400";
          } else if (isFreeDay) {
            buttonClass =
              "bg-emerald-50/70 border-emerald-200/90 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:hover:bg-emerald-950/50 shadow-2xs font-bold";
            textClass = "text-emerald-700 dark:text-emerald-300 font-bold";
            iconColor = "text-emerald-600 dark:text-emerald-400";
          } else if (isLockedByPaywall) {
            buttonClass =
              "bg-[#F8F8F8] border-[#E8E8E8] text-gray-400 dark:bg-background dark:border-border dark:text-slate-500 hover:bg-[#FFF0E8]/30 dark:hover:bg-muted/50 opacity-80 hover:opacity-100";
            textClass = "text-gray-500 dark:text-slate-400 font-medium";
            iconColor = "text-amber-500/80 dark:text-amber-500";
          } else {
            // Đã mở khóa thông thường (mua hoặc có gói Premium)
            buttonClass =
              "bg-[#FFF0E8]/70 border-[#FFD8C7] hover:bg-[#FFF0E8] dark:bg-[#FF5A1F]/15 dark:border-[#FF5A1F]/30 dark:hover:bg-[#FF5A1F]/25 shadow-2xs font-bold";
            textClass = "text-[#FF5A1F] dark:text-orange-300 font-bold";
            iconColor = "text-[#FF5A1F]";
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
                <span className="absolute -top-1.5 -left-1 px-1.5 py-0.5 rounded-sm text-[8px] font-extrabold bg-emerald-500 text-white shadow-2xs leading-none">
                  FREE
                </span>
              )}
              {/* Locked Pro badge */}
              {isLockedByPaywall && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-sm text-[8px] font-extrabold bg-amber-500 text-white shadow-2xs leading-none">
                  PRO
                </span>
              )}

              <span className={`text-[11px] uppercase tracking-tight leading-none ${textClass}`}>
                N{d.day}
              </span>

              <div className="mt-1 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${iconColor}`} />
                ) : isLockedByPaywall ? (
                  <Lock className={`w-3.5 h-3.5 ${iconColor}`} />
                ) : (
                  <Unlock className={`w-3.5 h-3.5 ${iconColor} group-hover:scale-110 transition-transform`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
