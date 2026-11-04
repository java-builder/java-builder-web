"use client";

interface MyCoursesStatsProps {
  total: number;
  completed: number;
  learning: number;
  totalLabel: string;
  completedLabel: string;
  learningLabel: string;
}

interface StatCellProps {
  label: string;
  value: number;
  dotColor: string;
}

function StatCell({ label, value, dotColor }: StatCellProps) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
        {value.toLocaleString("vi-VN")}
      </p>
    </div>
  );
}

export default function MyCoursesStats({
  total,
  completed,
  learning,
  totalLabel,
  completedLabel,
  learningLabel,
}: MyCoursesStatsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      <div className="flex flex-col divide-y divide-[#E8E8E8] dark:divide-border sm:flex-row sm:divide-x sm:divide-y-0">
        <StatCell label={totalLabel} value={total} dotColor="bg-[#FF5A1F]" />
        <StatCell
          label={completedLabel}
          value={completed}
          dotColor="bg-emerald-500"
        />
        <StatCell
          label={learningLabel}
          value={learning}
          dotColor="bg-amber-500"
        />
      </div>
    </div>
  );
}
