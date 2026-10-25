"use client";

import { useState } from "react";
import { ChevronDown, Terminal, Lock, CheckCircle2 } from "lucide-react";
import { Challenge } from "@/app/challenges/types";

interface ChallengeCurriculumProps {
  challenge: Challenge;
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  isUnlockedAll?: boolean;
}

export function ChallengeCurriculum({
  challenge,
  selectedDayNumber,
  onSelectDay,
  isUnlockedAll = false,
}: ChallengeCurriculumProps) {
  // Mở tất cả các giai đoạn mặc định
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

  const totalPhases = challenge.phases.length;
  const totalDays = challenge.totalDays || challenge.days.length;

  return (
    <div className="space-y-3">
      {/* 1. Tiêu đề nhỏ gọn, chuẩn ngữ cảnh Thử Thách Lập Trình */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Lộ trình thử thách
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {totalPhases} giai đoạn • {totalDays} ngày thực chiến
          </p>
        </div>
      </div>

      {/* 2. Danh sách giai đoạn (Gọn gàng, tinh tế) */}
      <div className="space-y-2">
        {challenge.phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id);

          // Lấy danh sách ngày thuộc phase này
          let phaseDays = challenge.days.filter((d) => d.phaseId === phase.id);

          if (phaseDays.length === 0 && phase.daysNumber && phase.daysNumber.length > 0) {
            const daySet = new Set(phase.daysNumber);
            phaseDays = challenge.days.filter((d) => daySet.has(d.day));
          }

          return (
            <div
              key={phase.id}
              className="rounded-lg border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all"
            >
              {/* Phase Header - Gọn gàng */}
              <button
                type="button"
                onClick={() => togglePhase(phase.id)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors select-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0 ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                    {phase.id}. {phase.title}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                  {phaseDays.length} ngày
                </span>
              </button>

              {/* Danh sách ngày trong Phase - Nhỏ gọn, dùng icon Terminal chuẩn lập trình */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800/50 bg-gray-50/20 dark:bg-slate-900/40">
                  {phaseDays.map((day) => {
                    const isFreeDay = challenge.isFree || Boolean(day.isFreePreview);
                    const isLocked = !challenge.isFree && !isUnlockedAll && !isFreeDay;
                    const isSelected = day.day === selectedDayNumber;

                    return (
                      <div
                        key={day.day}
                        onClick={() => onSelectDay(day.day)}
                        className={`px-3 py-2 flex items-center justify-between gap-2 transition-colors cursor-pointer group ${
                          isSelected
                            ? "bg-accent/10 dark:bg-accent/15 border-l-2 border-l-accent"
                            : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {/* Icon Terminal & Tên bài học */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-accent text-white"
                                : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 group-hover:text-accent group-hover:bg-accent/10"
                            }`}
                          >
                            <Terminal className="w-2.5 h-2.5" />
                          </div>

                          <span
                            className={`text-xs leading-snug line-clamp-1 transition-colors ${
                              isSelected
                                ? "font-semibold text-accent dark:text-accent-400"
                                : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                            }`}
                            title={`Ngày ${day.day}: ${day.title}`}
                          >
                            Ngày {day.day}: {day.title}
                          </span>
                        </div>

                        {/* Badge Học Thử & Trạng Thái Khóa */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {isFreeDay && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                              Học thử
                            </span>
                          )}

                          {isLocked ? (
                            <Lock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
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
