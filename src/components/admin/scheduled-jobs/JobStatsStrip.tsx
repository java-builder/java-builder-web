"use client";

import type { JobStatus, ScheduledJobResponse } from "@/types/scheduled-job";
import { STATUS_LABELS, STATUS_TONE, TONE_DOT, TONE_VALUE_TEXT } from "./helpers";

interface JobStatsStripProps {
  jobs: ScheduledJobResponse[];
  totalElements: number;
  activeStatus: JobStatus | "";
  onStatusToggle: (status: JobStatus) => void;
}

const STATUS_ORDER: JobStatus[] = [
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

export default function JobStatsStrip({
  jobs,
  totalElements,
  activeStatus,
  onStatusToggle,
}: JobStatsStripProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid grid-cols-2 divide-y divide-gray-200 dark:divide-slate-700 sm:grid-cols-3 sm:divide-x lg:grid-cols-6 lg:divide-y-0">
        {/* Total */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tổng job
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
            {totalElements.toLocaleString("vi-VN")}
          </p>
        </div>

        {STATUS_ORDER.map((status) => {
          const count = jobs.filter((j) => j.jobStatus === status).length;
          const tone = STATUS_TONE[status];
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusToggle(status)}
              className={`group relative px-5 py-4 text-left transition focus:outline-none ${
                isActive
                  ? "bg-accent/5"
                  : "hover:bg-gray-50 dark:hover:bg-slate-900/30"
              }`}
            >
              {isActive && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
              )}
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
                {STATUS_LABELS[status]}
              </p>
              <p
                className={`mt-1 text-2xl font-bold tabular-nums ${TONE_VALUE_TEXT[tone]}`}
              >
                {count}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
