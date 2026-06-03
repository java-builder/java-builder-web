import { ReactNode } from "react";

export type AttemptStatus = "PASSED" | "IN_PROGRESS" | "FAILED";

const attemptStatusConfig: Record<
  AttemptStatus,
  { label: string; icon: ReactNode; description: string; tone: "emerald" | "amber" | "rose" }
> = {
  PASSED: {
    label: "Đạt yêu cầu",
    description: "Điểm đạt chuẩn & hoàn thành",
    tone: "emerald",
    icon: (
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  IN_PROGRESS: {
    label: "Đang theo dõi",
    description: "Chưa hoàn thành tất cả thử thách",
    tone: "amber",
    icon: (
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6l4 2" />
      </svg>
    ),
  },
  FAILED: {
    label: "Cần hỗ trợ",
    description: "Điểm dưới ngưỡng yêu cầu",
    tone: "rose",
    icon: (
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const statusToneStyles = {
  emerald: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  amber: {
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  rose: {
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
} as const;

export const AttemptStatusBadge = ({ status }: { status: AttemptStatus }) => {
  const config = attemptStatusConfig[status];
  const tone = statusToneStyles[config.tone];

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center">
        <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
      </span>
      <div>
        <div className={`text-sm font-semibold ${tone.text}`}>{config.label}</div>
        <div className="text-xs text-gray-500">{config.description}</div>
      </div>
    </div>
  );
};
