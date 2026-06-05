import type { JobStatus } from "@/types/scheduled-job";
import { STATUS_LABELS, STATUS_TONE, TONE_BADGE, TONE_DOT } from "./helpers";

interface JobStatusPillProps {
  status: JobStatus;
  size?: "sm" | "md";
}

export default function JobStatusPill({ status, size = "md" }: JobStatusPillProps) {
  const tone = STATUS_TONE[status];
  const sizing =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ${TONE_BADGE[tone]} ${sizing}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]} ${
          status === "RUNNING" ? "animate-pulse" : ""
        }`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
