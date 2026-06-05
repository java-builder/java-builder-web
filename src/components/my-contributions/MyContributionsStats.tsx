"use client";

interface MyContributionsStatsProps {
  total: number;
  approved: number;
  pending: number;
  totalLabel: string;
  approvedLabel: string;
  pendingLabel: string;
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

export default function MyContributionsStats({
  total,
  approved,
  pending,
  totalLabel,
  approvedLabel,
  pendingLabel,
}: MyContributionsStatsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-slate-700 sm:flex-row sm:divide-x sm:divide-y-0">
        <StatCell label={totalLabel} value={total} dotColor="bg-accent" />
        <StatCell
          label={approvedLabel}
          value={approved}
          dotColor="bg-emerald-500"
        />
        <StatCell
          label={pendingLabel}
          value={pending}
          dotColor="bg-amber-500"
        />
      </div>
    </div>
  );
}
