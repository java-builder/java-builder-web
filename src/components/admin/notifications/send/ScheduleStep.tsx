"use client";

import type { Priority } from "@/components/admin/notifications/useEmailCampaign";
import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, PRIORITIES, SCHEDULE_OPTIONS } from "./helpers";

interface ScheduleStepProps {
  scheduleType: "now" | "schedule";
  scheduleDate: string;
  scheduleTime: string;
  priority: Priority;
  isSubmitting: boolean;
  onScheduleTypeChange: (value: "now" | "schedule") => void;
  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ScheduleStep({
  scheduleType,
  scheduleDate,
  scheduleTime,
  priority,
  isSubmitting,
  onScheduleTypeChange,
  onScheduleDateChange,
  onScheduleTimeChange,
  onPriorityChange,
  onBack,
  onSubmit,
}: ScheduleStepProps) {
  return (
    <div className="space-y-5">
      <StepCard
        title="Thời gian gửi"
        description="Chọn cách gửi ngay hoặc lên lịch trước"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SCHEDULE_OPTIONS.map((opt) => {
            const isActive = scheduleType === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onScheduleTypeChange(opt.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-900/40"
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-accent/10 text-accent" : ICON_TONE[opt.tone]
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-semibold ${
                      isActive ? "text-accent" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {opt.title}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {scheduleType === "schedule" && (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/30 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Ngày gửi
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => onScheduleDateChange(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Giờ gửi
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => onScheduleTimeChange(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
              />
            </div>
          </div>
        )}
      </StepCard>

      <StepCard title="Mức độ ưu tiên" description="Quyết định thứ tự xử lý trong hàng đợi">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PRIORITIES.map((p) => {
            const isActive = priority === p.value;
            const Icon = p.icon;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPriorityChange(p.value)}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-900/40"
                }`}
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-accent/10 text-accent" : ICON_TONE[p.tone]
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-semibold ${
                      isActive ? "text-accent" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {p.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    {p.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </StepCard>

      <StepFooter
        onBack={onBack}
        onNext={onSubmit}
        nextLabel={isSubmitting ? "Đang xử lý..." : "Gửi chiến dịch"}
        isFinal
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
