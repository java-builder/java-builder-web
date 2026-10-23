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
  isEnrolled: _isEnrolled = true,
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

      {/* 2. WHY LEARN & CORE MISSION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why Learn */}
        <div className="rounded-xl border border-border bg-muted/25 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Compass className="w-4 h-4 text-accent shrink-0" />
            <span>Tại sao quan trọng trong thực tế?</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activeDay.whyLearn || "Nắm vững kỹ năng cốt lõi cho dự án thực tế."}
          </p>
        </div>

        {/* Core Mission */}
        <div className="rounded-xl border border-border bg-muted/25 p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target className="w-4 h-4 text-accent shrink-0" />
            <span>Mục tiêu cốt lõi cần đạt</span>
          </div>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
            {activeDay.coreMission}
          </p>
        </div>
      </div>

      {/* 3. DEDICATED TASK SUMMARY CARD */}
      {tasks.length > 0 && (
        <div
          onClick={onOpenDrawer}
          className="rounded-xl border border-accent/25 bg-gradient-to-r from-accent/[0.05] via-accent/[0.02] to-transparent p-4 sm:p-5 dark:border-accent/35 dark:from-accent/[0.09] dark:to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-accent/50 hover:shadow-xs cursor-pointer group"
        >
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <ListTodo className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                    Nhiệm vụ thực hành Ngày {activeDay.day}
                  </h3>
                  {isAllTasksCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Đã hoàn thành
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                      {completedTasksCount}/{tasks.length} task
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tích chọn hoàn thành từng bài tập để củng cố kỹ năng và ghi nhớ kiến thức
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1 max-w-md">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-muted-foreground">Tiến độ nhiệm vụ</span>
                <span className="font-bold tabular-nums text-foreground">
                  {Math.round((completedTasksCount / tasks.length) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAllTasksCompleted ? "bg-emerald-500" : "bg-accent"
                  }`}
                  style={{
                    width: `${Math.round((completedTasksCount / tasks.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center sm:self-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDrawer) onOpenDrawer();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer group-hover:bg-accent-600 active:scale-95"
            >
              <ListTodo className="w-4 h-4" />
              <span>Xem danh sách bài tập ({completedTasksCount}/{tasks.length})</span>
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
