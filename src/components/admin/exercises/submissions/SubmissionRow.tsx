import { ChevronRight, Lock } from "lucide-react";
import { formatReadableDateTime } from "@/utils/dateUtils";
import {
  SubmissionStatus,
  type ExerciseSubmissionSummaryResponse,
} from "@/types/exercise-submission";
import StatusPill from "./StatusPill";
import { getScoreTone } from "./helpers";

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
    <tr className="transition hover:bg-gray-50">
      {/* Attempt # */}
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold tabular-nums text-gray-400">
            #{String(attemptNumber).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-gray-900">
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
          <span className="text-sm text-gray-400">—</span>
        ) : (
          <div className="inline-flex items-baseline gap-1">
            <span
              className={`text-sm font-bold tabular-nums ${getScoreTone(scorePct)}`}
            >
              {submission.score ?? 0}
            </span>
            <span className="text-xs text-gray-400">/{submission.maxScore}</span>
            <span className="ml-1 text-xs tabular-nums text-gray-500">
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
          <span className="text-sm text-gray-400">—</span>
        ) : (
          <span className="text-sm font-semibold tabular-nums text-emerald-600">
            {submission.correctCount}
          </span>
        )}
      </td>

      {/* Submitted at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-700">
        {submission.submittedAt ? (
          formatReadableDateTime(submission.submittedAt)
        ) : (
          <span className="text-gray-400">Chưa nộp</span>
        )}
      </td>

      {/* Action */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        {isInProgress ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-400">
            <Lock className="h-3 w-3" />
            Đang làm
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onView(submission.submissionId)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent"
          >
            Xem chi tiết
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
}
