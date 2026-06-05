import { SubmissionStatus } from "@/types/exercise-submission";
import { STATUS_CONFIG, TONE_BADGE, TONE_DOT } from "./helpers";

interface StatusPillProps {
  status: SubmissionStatus;
}

export default function StatusPill({ status }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${TONE_BADGE[cfg.tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[cfg.tone]}`} />
      {cfg.label}
    </span>
  );
}
