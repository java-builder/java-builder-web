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

const RADIUS = 56;
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[auto,1fr] lg:gap-8 lg:p-8">
        {/* Score Ring */}
        <div className="flex items-center justify-center lg:justify-start">
          <div className="relative h-28 w-28 flex-shrink-0 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <svg
              className="h-full w-full -rotate-90 transform"
              viewBox="0 0 144 144"
            >
              <circle
                cx="72"
                cy="72"
                r={RADIUS}
                strokeWidth="10"
                fill="none"
                className="stroke-gray-200 dark:stroke-slate-700"
              />
              <circle
                cx="72"
                cy="72"
                r={RADIUS}
                strokeWidth="10"
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - scorePercentage / 100)}
                strokeLinecap="round"
                className={`transition-all duration-700 ${tone.ring}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold sm:text-4xl ${tone.text}`}>
                {scorePercentage}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                / 100 điểm
              </span>
            </div>
          </div>
        </div>

        {/* Summary Body */}
        <div className="flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tone.bgFromRing}`} />
                {tone.label}
              </span>
              {submittedAt && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Nộp lúc {formatReadableDateTime(submittedAt)}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {tone.summary}
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-3 w-3" />
                Điểm
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {totalScore}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  / {maxScore}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <ListChecks className="h-3 w-3" />
                Độ chính xác
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {accuracyPercentage}%
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-900/10 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Câu đúng
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 sm:text-xl">
                  {counts.correct}
                </span>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-500">
                  / {counts.all}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-900/10 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <XCircle className="h-3 w-3" />
                Câu sai / bỏ qua
              </div>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                <span className="text-lg font-bold text-rose-700 dark:text-rose-400 sm:text-xl">
                  {counts.incorrect + counts.skipped}
                </span>
                {counts.skipped > 0 && (
                  <span className="text-[11px] text-rose-600/70 dark:text-rose-500">
                    ({counts.skipped} bỏ qua)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
