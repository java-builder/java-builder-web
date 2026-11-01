"use client";

import {
  Compass,
  Target,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  ListTodo,
  X,
} from "lucide-react";
import { DayChallenge } from "@/app/challenges/types";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface ChallengeDayDetailProps {
  activeDay?: DayChallenge;
  totalDays: number;
  isChallengeFree?: boolean;
  isEnrolled?: boolean;
  onToggleTask?: (taskId: string) => void;
  onCompleteDay: (dayNum: number) => void;
  onSelectDay: (dayNum: number) => void;
  onOpenDrawer?: () => void;
}

export function ChallengeDayDetail({
  activeDay,
  totalDays,
  isChallengeFree,
  onCompleteDay,
  onSelectDay,
  onOpenDrawer,
}: ChallengeDayDetailProps) {
  if (!activeDay) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <Compass className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
        <h3 className="text-base font-bold text-foreground">Chưa có nội dung cho ngày này</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Lộ trình thử thách đang được cập nhật nội dung chi tiết từng ngày.
        </p>
      </div>
    );
  }

  const tasks = activeDay.tasks || [];
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const isAllTasksCompleted = tasks.length > 0 && completedTasksCount === tasks.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* 1. DAY HEADER */}
      <div className="space-y-3 border-b border-gray-100 dark:border-slate-800 pb-5">
        {/* Badges & Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white shadow-xs">
            NGÀY {activeDay.day}
          </span>
          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-300 border border-gray-200/50 dark:border-slate-700">
            Tuần {activeDay.week} • {activeDay.phaseName}
          </span>
          {activeDay.isFreePreview && (
            <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold border border-emerald-500/20">
              {isChallengeFree ? "Miễn phí" : "Học thử miễn phí"}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {activeDay.title}
          </h1>
          {activeDay.tagline && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {activeDay.tagline}
            </p>
          )}
        </div>

        {/* Tech Stack Badges (Key Concepts) - Gọn gàng ngay dưới Header */}
        {activeDay.keyConcepts && activeDay.keyConcepts.length > 0 && (
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 text-accent" />
              Công nghệ:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeDay.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-accent/10 text-accent border border-accent/20 transition-colors hover:bg-accent/20"
                >
                  #{concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. WHY LEARN & CORE MISSION - BẢNG ĐỊNH HƯỚNG BÀI HỌC */}
      <div className="rounded-lg border border-gray-200/90 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/30 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/90 dark:divide-slate-800">
          {/* Why Learn */}
          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                Tại sao quan trọng trong thực tế?
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80 dark:text-slate-300 leading-relaxed">
                {activeDay.whyLearn || "Nắm vững kỹ năng cốt lõi cho dự án thực tế."}
              </p>
            </div>
          </div>

          {/* Core Mission */}
          <div className="p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                Mục tiêu ngày học này
              </h3>
              <p className="text-xs sm:text-sm text-foreground/80 dark:text-slate-300 leading-relaxed">
                {activeDay.coreMission || "Hoàn thành toàn bộ mục tiêu và yêu cầu bài học trong ngày."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPACT TASK SUMMARY BAR */}
      {tasks.length > 0 && (
        <div
          onClick={onOpenDrawer}
          className="rounded-lg border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-2xs cursor-pointer group"
        >
          {/* Left: Icon + Title + Task count */}
          <div className="flex items-center gap-2.5 min-w-0">
            <ListTodo className="w-4.5 h-4.5 text-accent shrink-0" />
            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                Nhiệm vụ thực hành Ngày {activeDay.day}
              </h3>
              {isAllTasksCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Đã hoàn thành
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                  {completedTasksCount}/{tasks.length} task
                </span>
              )}
            </div>
          </div>

          {/* Right: Progress bar + CTA button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-end">
            <div className="flex items-center gap-2 min-w-[110px] sm:min-w-[130px]">
              <div className="h-1.5 flex-1 bg-gray-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-sm ${
                    isAllTasksCompleted ? "bg-emerald-500" : "bg-accent"
                  }`}
                  style={{
                    width: `${Math.round((completedTasksCount / tasks.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
                {Math.round((completedTasksCount / tasks.length) * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDrawer) onOpenDrawer();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent hover:bg-accent/90 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer group-hover:bg-accent-600 active:scale-95"
            >
              <span>Xem bài tập</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* 3. DETAILED GUIDE CONTENT (MARKDOWN) - Học sinh đọc và làm theo trước */}
      {activeDay.content && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-accent" />
            <span>Nội dung hướng dẫn chi tiết</span>
          </div>
          <div className="p-5 sm:p-6 rounded-xl bg-gray-50/70 border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800 text-sm leading-relaxed overflow-hidden">
            <PublicMarkdownRenderer content={activeDay.content} />
          </div>
        </div>
      )}



      {/* 5. NAVIGATION & COMPLETION ACTIONS */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={activeDay.day <= 1}
            onClick={() => onSelectDay(Math.max(1, activeDay.day - 1))}
            className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ngày trước</span>
          </button>

          <button
            type="button"
            disabled={activeDay.day >= totalDays}
            onClick={() => onSelectDay(Math.min(totalDays, activeDay.day + 1))}
            className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Ngày sau</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeDay.status === "completed" ? (
          <button
            type="button"
            onClick={() => onCompleteDay(activeDay.day)}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition cursor-pointer active:scale-[0.98]"
            title="Bấm để hủy hoàn thành ngày này"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:hidden" />
            <X className="w-4 h-4 text-destructive hidden group-hover:inline" />
            <span className="group-hover:hidden">Đã hoàn thành Ngày {activeDay.day}</span>
            <span className="hidden group-hover:inline">Hủy hoàn thành Ngày {activeDay.day}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCompleteDay(activeDay.day)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-[0.98] ${isAllTasksCompleted
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 shadow-md ring-2 ring-emerald-500/30"
              : "bg-accent hover:bg-accent-600"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isAllTasksCompleted
                ? `Xác nhận xong Ngày ${activeDay.day} 🚀`
                : `Hoàn thành Ngày ${activeDay.day}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
