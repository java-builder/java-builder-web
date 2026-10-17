"use client";

import { Check, X, ListTodo, CheckCircle2 } from "lucide-react";
import { DayChallenge } from "@/app/challenges/types";

interface ChallengeSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDay: DayChallenge;
  totalDays: number;
  onToggleTask: (taskId: string) => void;
  onCompleteDay: (dayNum: number) => void;
  onSelectDay: (dayNum: number) => void;
}

export function ChallengeSideDrawer({
  isOpen,
  onClose,
  activeDay,
  onToggleTask,
  onCompleteDay,
}: ChallengeSideDrawerProps) {
  const tasks = activeDay.tasks || [];
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  const isAllTasksCompleted = tasks.length > 0 && completedTasksCount === tasks.length;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[520px] max-w-[94vw] bg-card text-card-foreground shadow-2xl border-l border-border flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 1. TOP HEADER */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight">
                Danh sách nhiệm vụ
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Ngày {activeDay.day}: {completedTasksCount}/{tasks.length} hoàn thành
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCompleteDay(activeDay.day)}
              title={
                activeDay.status === "completed"
                  ? "Bấm để hủy hoàn thành Ngày " + activeDay.day
                  : "Đánh dấu hoàn thành Ngày " + activeDay.day
              }
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 shadow-xs ${
                activeDay.status === "completed"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                  : "border border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              {activeDay.status === "completed" ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5] group-hover:hidden" />
                  <X className="w-3.5 h-3.5 stroke-[2.5] hidden group-hover:inline" />
                  <span className="group-hover:hidden">Đã hoàn thành</span>
                  <span className="hidden group-hover:inline">Hủy hoàn thành</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Hoàn thành ngày</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Đóng bảng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SCROLLABLE CONTENT (Tasks Only) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Day Title & Tagline */}
          <div className="space-y-2">
            <div className="border-l-3 border-accent pl-3.5 py-0.5 space-y-0.5">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                Ngày {activeDay.day} • Tuần {activeDay.week}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-snug">
                {activeDay.title}
              </h2>
            </div>

            {activeDay.coreMission && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {activeDay.coreMission}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Tiến độ nhiệm vụ</span>
              <span className="font-bold text-accent">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isAllTasksCompleted ? "bg-emerald-500" : "bg-accent"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Task Items from API */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Danh sách bài tập ({tasks.length})
              </h4>
              <span className="text-[11px] text-muted-foreground">Tích chọn khi hoàn thành</span>
            </div>

            {tasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                Chưa có nhiệm vụ nào được tạo cho ngày này.
              </div>
            ) : (
              <div className="space-y-1.5">
                {tasks.map((task) => (
                  <label
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`flex items-start gap-2.5 py-2 px-3 rounded-lg border text-xs transition cursor-pointer select-none ${
                      task.isCompleted
                        ? "bg-muted/30 border-border/70 text-muted-foreground"
                        : "bg-card border-border text-foreground hover:border-accent/40 hover:bg-muted/20 shadow-2xs"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 rounded-[4px] flex items-center justify-center shrink-0 border transition-all ${
                        task.isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-muted-foreground/40 bg-card hover:border-accent"
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span className={`leading-normal ${task.isCompleted ? "line-through opacity-60" : "font-medium"}`}>
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. FOOTER ACTIONS */}
        <div className="p-4 border-t border-border bg-card shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {completedTasksCount}/{tasks.length} task đã xong
          </span>

          {activeDay.status === "completed" ? (
            <button
              type="button"
              onClick={() => onCompleteDay(activeDay.day)}
              className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-semibold text-xs border border-emerald-500/20 transition cursor-pointer active:scale-95"
              title="Bấm để hủy hoàn thành"
            >
              <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
              <X className="w-3.5 h-3.5 hidden group-hover:inline" />
              <span className="group-hover:hidden">Đã hoàn thành Ngày {activeDay.day}</span>
              <span className="hidden group-hover:inline">Hủy hoàn thành Ngày {activeDay.day}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onCompleteDay(activeDay.day)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs text-white transition cursor-pointer active:scale-95 shadow-sm ${
                isAllTasksCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 ring-2 ring-emerald-500/30"
                  : "bg-accent hover:bg-accent/90"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isAllTasksCompleted
                  ? `Xác nhận xong Ngày ${activeDay.day} 🚀`
                  : `Xong Ngày ${activeDay.day}`}
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
