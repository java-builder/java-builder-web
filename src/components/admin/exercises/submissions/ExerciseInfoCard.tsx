import { DifficultyBadge } from "@/components/admin/exercises/ExerciseBadges";
import type { ExerciseSubmissionSummaryResponse } from "@/types/exercise-submission";
import { getScoreTone } from "./helpers";

export interface ExerciseInfoStats {
  totalAttempts: number;
  completed: number;
  bestScore: number;
  avgScore: number;
}

interface ExerciseInfoCardProps {
  exercise: ExerciseSubmissionSummaryResponse;
  stats: ExerciseInfoStats;
}

export default function ExerciseInfoCard({ exercise, stats }: ExerciseInfoCardProps) {
  const bestPct = exercise.maxScore
    ? (stats.bestScore / exercise.maxScore) * 100
    : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                {exercise.exerciseTitle}
              </h2>
              <DifficultyBadge difficulty={exercise.difficulty} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{exercise.exerciseType}</span>
              <span className="text-border">•</span>
              <span>Thời gian {exercise.timeLimit} phút</span>
              <span className="text-border">•</span>
              <span>
                Điểm tối đa{" "}
                <span className="font-semibold text-foreground">{exercise.maxScore}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <KpiCell label="Tổng lần làm" value={stats.totalAttempts} />
        <KpiCell
          label="Đã hoàn thành"
          value={stats.completed}
          valueClass="text-blue-600 dark:text-blue-400"
        />
        <KpiCell
          label="Điểm cao nhất"
          value={`${stats.bestScore}`}
          suffix={`/${exercise.maxScore}`}
          valueClass={getScoreTone(bestPct)}
        />
        <KpiCell
          label="Điểm trung bình"
          value={`${stats.avgScore}`}
          suffix={`/${exercise.maxScore}`}
        />
      </div>
    </div>
  );
}

function KpiCell({
  label,
  value,
  suffix,
  valueClass = "text-foreground",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  valueClass?: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${valueClass}`}>
        {value}
        {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
      </p>
    </div>
  );
}
