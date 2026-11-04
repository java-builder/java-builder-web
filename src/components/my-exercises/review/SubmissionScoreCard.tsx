import {
  Calendar,
  CheckCircle2,
  ListChecks,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { formatReadableDateTime } from "@/utils/dateUtils";
import type { ScoreTone } from "./helpers";
import type { QuestionCounts } from "./types";

interface SubmissionScoreCardProps {
  scorePercentage: number;
  accuracyPercentage: number;
  totalScore: number;
  maxScore: number;
  submittedAt?: string | null;
  counts: QuestionCounts;
  tone: ScoreTone;
}

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SubmissionScoreCard({
  scorePercentage,
  accuracyPercentage,
  totalScore,
  maxScore,
  submittedAt,
  counts,
  tone,
}: SubmissionScoreCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
      {/* Top Row: Ring + Verdict & Meta */}
      <div className="flex items-center gap-4">
        <div className="relative h-22 w-22 shrink-0">
          <svg
            className="h-full w-full -rotate-90 transform"
            viewBox="0 0 96 96"
          >
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              strokeWidth="7"
              fill="none"
              className="stroke-muted"
            />
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              strokeWidth="7"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - scorePercentage / 100)}
              strokeLinecap="round"
              className={`transition-all duration-700 ${tone.ring}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-black tabular-nums ${tone.text}`}>
              {scorePercentage}%
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tone.chip}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tone.bgFromRing}`} />
            {tone.label}
          </span>

          {submittedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {formatReadableDateTime(submittedAt)}
              </span>
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {tone.summary}
          </p>
        </div>
      </div>

      {/* KPI Grid (2x2) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Điểm số
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-foreground tabular-nums">
              {totalScore}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              / {maxScore}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <ListChecks className="h-3.5 w-3.5 text-blue-500" />
            Độ chính xác
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-foreground tabular-nums">
              {accuracyPercentage}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Câu đúng
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {counts.correct}
            </span>
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 tabular-nums">
              / {counts.all}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            Sai / bỏ qua
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-1">
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
              {counts.incorrect + counts.skipped}
            </span>
            {counts.skipped > 0 && (
              <span className="text-[10px] text-rose-600/70 dark:text-rose-400/70">
                ({counts.skipped} trống)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
