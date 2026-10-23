"use client";

import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Challenge, DayChallenge } from "@/app/challenges/types";

interface ChallengeCurriculumProps {
  challenge: Challenge;
  selectedDayNumber: number;
  onSelectDay: (day: DayChallenge) => void;
  isUnlockedAll?: boolean;
}

export function ChallengeCurriculum({
  challenge,
  selectedDayNumber,
  onSelectDay,
  isUnlockedAll = false,
}: ChallengeCurriculumProps) {
  // Expand phase 1 by default
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(() => {
    return new Set(challenge.phases.map((p) => p.id));
  });

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedPhases(new Set(challenge.phases.map((p) => p.id)));
  };

  const collapseAll = () => {
    setExpandedPhases(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Title & Quick actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Nội dung thử thách
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="text-muted-foreground hover:text-accent font-medium transition cursor-pointer"
          >
            Mở tất cả
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-muted-foreground hover:text-accent font-medium transition cursor-pointer"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-3">
        {challenge.phases.map((phase, pIndex) => {
          const isExpanded = expandedPhases.has(phase.id);
          const phaseDays = challenge.days.filter((d) => d.phaseId === phase.id);

          return (
            <div
              key={phase.id}
              className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.id)}
                className="flex items-center justify-between px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/50 hover:bg-gray-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider shrink-0">
                    Giai đoạn {pIndex + 1}
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {phase.title}
                  </h4>
                </div>
              </div>

              {/* Days List in Phase */}
              {isExpanded && (
                <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
                  {phaseDays.map((day) => {
                    const isFreeDay =
                      challenge.isFree ||
                      Boolean(day.isFreePreview) ||
                      ((challenge.freePreviewDays ?? 0) > 0 && day.day <= (challenge.freePreviewDays ?? 0));
                    const isLocked = !challenge.isFree && !isUnlockedAll && !isFreeDay;

                    const isSelected = day.day === selectedDayNumber;

                    return (
                      <div
                        key={day.day}
                        onClick={() => onSelectDay(day)}
                        className={`group px-4 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-accent/10 dark:bg-accent/15 border-l-2 border-l-accent"
                            : isFreeDay
                            ? "hover:bg-accent/5 dark:hover:bg-accent/10"
                            : "hover:bg-gray-50 dark:hover:bg-slate-850/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Day Number Box */}
                          <span
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold shrink-0 transition-colors ${
                              isFreeDay
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                            }`}
                          >
                            {day.day}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-accent transition-colors line-clamp-1">
                                {day.title}
                              </span>

                              {isFreeDay && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                                  Học thử
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right State: Lock icon if locked */}
                        {isLocked && (
                          <div className="shrink-0 flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
