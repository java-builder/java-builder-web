interface ModalSummaryProps {
  totalScore: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
}

const getScoreTone = (percentage: number) => {
  if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 50) return "text-blue-600 dark:text-blue-400";
  return "text-rose-600 dark:text-rose-400";
};

const getResultLabel = (percentage: number) => {
  if (percentage >= 80) return "Đạt yêu cầu";
  if (percentage >= 50) return "Cần cải thiện";
  return "Chưa đạt";
};

const getResultBadge = (percentage: number) => {
  if (percentage >= 80)
    return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800";
  if (percentage >= 50)
    return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800";
  return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800";
};

export default function ModalSummary({
  totalScore,
  maxScore,
  correctCount,
  totalQuestions,
}: ModalSummaryProps) {
  const scorePct = maxScore ? Math.round((totalScore / maxScore) * 100) : 0;
  const accuracy = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;
  const incorrect = totalQuestions - correctCount;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* Verdict bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Kết quả tổng quan
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${getResultBadge(scorePct)}`}
        >
          {getResultLabel(scorePct)}
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 divide-y divide-border bg-card sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <KpiCell label="Điểm số" mainClass={getScoreTone(scorePct)} mainValue={`${totalScore}`} suffix={`/${maxScore}`} sub={`${scorePct}%`} />
        <KpiCell label="Độ chính xác" mainValue={`${accuracy}%`} />
        <KpiCell
          label="Câu đúng"
          mainClass="text-emerald-600 dark:text-emerald-400"
          mainValue={`${correctCount}`}
          suffix={`/${totalQuestions}`}
        />
        <KpiCell
          label="Câu sai"
          mainClass="text-rose-600 dark:text-rose-400"
          mainValue={`${incorrect}`}
          suffix={`/${totalQuestions}`}
        />
      </div>
    </div>
  );
}

function KpiCell({
  label,
  mainValue,
  suffix,
  sub,
  mainClass = "text-foreground",
}: {
  label: string;
  mainValue: string;
  suffix?: string;
  sub?: string;
  mainClass?: string;
}) {
  return (
    <div className="px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${mainClass}`}>
        {mainValue}
        {suffix && (
          <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
        )}
      </p>
      {sub && (
        <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
          {sub}
        </p>
      )}
    </div>
  );
}
