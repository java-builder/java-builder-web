"use client";

import {
  Clock,
  Compass,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { DayChallenge } from "@/app/challenges/types";

interface ChallengeDayDetailProps {
  activeDay?: DayChallenge;
  totalDays: number;
  onToggleTask: (taskId: string) => void;
  onCompleteDay: (dayNum: number) => void;
  onSelectDay: (dayNum: number) => void;
}

export function ChallengeDayDetail({
  activeDay,
  totalDays,
  onToggleTask,
  onCompleteDay,
  onSelectDay,
}: ChallengeDayDetailProps) {
  if (!activeDay) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3">
        <Compass className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
        <h3 className="text-base font-bold text-foreground">Chưa có nội dung cho ngày này</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Lộ trình thử thách đang được cập nhật nội dung chi tiết từng ngày.
        </p>
      </div>
    );
  }

  const completedTasksCount = (activeDay.tasks || []).filter((t) => t.isCompleted).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-5 sticky top-20">
      {/* Day Header */}
      <div className="space-y-1.5 border-b border-gray-100 dark:border-slate-700 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
              NGÀY {activeDay.day}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-gray-300">
              Tuần {activeDay.week} • {activeDay.phaseName}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-gray-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            ~{activeDay.estimatedMinutes} phút
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pt-1">
          {activeDay.title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activeDay.tagline}
        </p>
      </div>

      {/* 1. WHY LEARN THIS? */}
      <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Tại sao phần này lại quan trọng trong thực tế?</span>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {activeDay.whyLearn}
        </p>
      </div>

      {/* 2. CORE MISSION */}
      <div className="p-3.5 rounded-lg bg-accent/5 border border-accent/20 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
          <Target className="w-3.5 h-3.5" />
          <span>Mục tiêu cốt lõi hôm nay cần đạt</span>
        </div>
        <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
          {activeDay.coreMission}
        </p>
      </div>

      {/* 3. ACTIONABLE CHECKLIST */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              Nhiệm vụ hành động hôm nay ({completedTasksCount}/{activeDay.tasks.length})
            </span>
          </h3>
          <span className="text-[11px] text-muted-foreground">Click để đánh dấu</span>
        </div>

        <div className="space-y-1.5">
          {activeDay.tasks.map((task) => (
            <label
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                task.isCompleted
                  ? "bg-emerald-50/60 border-emerald-200 text-muted-foreground dark:bg-emerald-950/20 dark:border-emerald-900/40"
                  : "bg-gray-50/60 border-gray-200 hover:border-accent/40 text-gray-800 dark:bg-slate-900/30 dark:border-slate-700 dark:text-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => {}}
                className="w-3.5 h-3.5 mt-0.5 rounded text-accent focus:ring-accent cursor-pointer"
              />
              <span
                className={`text-xs leading-relaxed ${
                  task.isCompleted ? "line-through opacity-70" : "font-medium"
                }`}
              >
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. KEY CONCEPTS */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
          Từ khóa trọng tâm:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {activeDay.keyConcepts.map((concept, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
            >
              #{concept}
            </span>
          ))}
        </div>
      </div>

      {/* 5. MENTOR TIPS & COMMON PITFALLS */}
      <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lời khuyên & Cạm bẫy từ Mentor</span>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
          &ldquo;{activeDay.mentorTip}&rdquo;
        </p>
      </div>

      {/* Navigation & Completion Buttons */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={activeDay.day <= 1}
            onClick={() => onSelectDay(Math.max(1, activeDay.day - 1))}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ngày trước</span>
          </button>

          <button
            type="button"
            disabled={activeDay.day >= totalDays}
            onClick={() => onSelectDay(Math.min(totalDays, activeDay.day + 1))}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Ngày sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeDay.status === "completed" ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Đã hoàn thành ngày {activeDay.day}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onCompleteDay(activeDay.day)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-semibold text-xs shadow-sm hover:bg-accent-600 active:scale-[0.98] transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đánh dấu hoàn thành Ngày {activeDay.day}</span>
          </button>
        )}
      </div>
    </div>
  );
}
