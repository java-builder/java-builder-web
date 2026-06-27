"use client";

import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, SCHEDULE_OPTIONS } from "./helpers";

interface ScheduleStepProps {
  scheduleType: "now" | "schedule";
  scheduleDate: string;
  scheduleTime: string;
  isSubmitting: boolean;
  onScheduleTypeChange: (value: "now" | "schedule") => void;
  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ScheduleStep({
  scheduleType,
  scheduleDate,
  scheduleTime,
  isSubmitting,
  onScheduleTypeChange,
  onScheduleDateChange,
  onScheduleTimeChange,
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
                    : "border-border bg-card hover:border-accent/50 hover:bg-muted"
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
                      isActive ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {opt.title}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {scheduleType === "schedule" && (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ngày gửi
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => onScheduleDateChange(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Giờ gửi
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => onScheduleTimeChange(e.target.value)}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              />
            </div>
          </div>
        )}
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
