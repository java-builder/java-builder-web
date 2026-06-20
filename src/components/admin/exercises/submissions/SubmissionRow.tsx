import { ChevronRight, Lock } from "lucide-react";
import { formatLocaleString } from "@/utils/dateUtils";
import {
  SubmissionStatus,
  type ExerciseSubmissionSummaryResponse,
} from "@/types/exercise-submission";
import StatusPill from "./StatusPill";
import { getScoreTone } from "./helpers";
import { Button } from "@/components/ui/button";

interface SubmissionRowProps {
  attemptNumber: number;
  submission: ExerciseSubmissionSummaryResponse;
  onView: (submissionId: string) => void;
}

export default function SubmissionRow({
  attemptNumber,
  submission,
  onView,
}: SubmissionRowProps) {
  const isInProgress = submission.submissionStatus === SubmissionStatus.IN_PROGRESS;
  const scorePct =
    submission.score && submission.maxScore
      ? Math.round((submission.score / submission.maxScore) * 1000) / 10
      : 0;

  return (
    <tr className="transition hover:bg-muted/25">
      {/* Attempt # */}
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
            #{String(attemptNumber).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground">
            Lần {attemptNumber}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3">
        <StatusPill status={submission.submissionStatus} />
      </td>

      {/* Score */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        {isInProgress ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : (
          <div className="inline-flex items-baseline gap-1">
            <span
              className={`text-sm font-bold tabular-nums ${getScoreTone(scorePct)}`}
            >
              {submission.score ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">/{submission.maxScore}</span>
            <span className="ml-1 text-xs tabular-nums text-muted-foreground">
              ({Math.round(scorePct)}%)
            </span>
          </div>
        )}
      </td>

      {/* Correct count */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        {isInProgress ||
        submission.correctCount === undefined ||
        submission.correctCount === null ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : (
          <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {submission.correctCount}
          </span>
        )}
      </td>

      {/* Submitted at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-muted-foreground">
        {submission.submittedAt ? (
          formatLocaleString(submission.submittedAt)
        ) : (
          <span className="text-muted-foreground">Chưa nộp</span>
        )}
      </td>

      {/* Action */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        {isInProgress ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <Lock className="h-3 w-3" />
            Đang làm
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onView(submission.submissionId)}
            className="h-8 gap-1"
          >
            Xem chi tiết
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </td>
    </tr>
  );
}
