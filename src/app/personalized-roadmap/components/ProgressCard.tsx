import { TrendingUp } from "lucide-react";

interface ProgressCardProps {
  label: string;
  value: number;
  color?: string;
  isOverall?: boolean;
}

export function ProgressCard({ label, value, color, isOverall }: ProgressCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
          {label}
        </span>
        {isOverall && <TrendingUp className="w-3.5 h-3.5 text-accent" />}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-950 dark:text-white">
          {value}%
        </span>
      </div>
      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverall ? "bg-accent" : color || "bg-gray-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
