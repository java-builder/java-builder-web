import { SubmissionStatus } from "@/types/exercise-submission";

export type AttemptStatus = SubmissionStatus;

type Tone = "emerald" | "amber" | "rose" | "blue";

const STATUS_CONFIG: Record<AttemptStatus, { label: string; tone: Tone }> = {
  PASSED: { label: "Đạt yêu cầu", tone: "emerald" },
  IN_PROGRESS: { label: "Đang làm", tone: "amber" },
  FAILED: { label: "Cần hỗ trợ", tone: "rose" },
  COMPLETED: { label: "Hoàn thành", tone: "blue" },
};

const TONE_CLASSES: Record<Tone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
};

const TONE_DOT: Record<Tone, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  blue: "bg-blue-500",
};

export const AttemptStatusBadge = ({ status }: { status: AttemptStatus }) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        Không xác định
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${TONE_CLASSES[config.tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[config.tone]}`} />
      {config.label}
    </span>
  );
};
