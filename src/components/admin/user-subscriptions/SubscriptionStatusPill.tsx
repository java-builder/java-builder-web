import {
  STATUS_CONFIG,
  TONE_BADGE,
  TONE_DOT,
  type SubscriptionStatus,
} from "./helpers";

interface SubscriptionStatusPillProps {
  status: string;
}

export default function SubscriptionStatusPill({
  status,
}: SubscriptionStatusPillProps) {
  const cfg = STATUS_CONFIG[status as SubscriptionStatus];

  if (!cfg) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 dark:bg-gray-700 dark:text-gray-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${TONE_BADGE[cfg.tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[cfg.tone]}`} />
      {cfg.label}
    </span>
  );
}
