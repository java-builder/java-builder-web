"use client";

import { ListChecks } from "lucide-react";
import type { ScheduledJobResponse } from "@/types/scheduled-job";
import JobRow from "./JobRow";

interface JobTableProps {
  jobs: ScheduledJobResponse[];
  isLoading: boolean;
  totalElements: number;
}

const COLUMN_HEADERS: {
  label: string;
  align?: "left" | "right";
  className?: string;
}[] = [
  { label: "Job" },
  { label: "Loại" },
  { label: "Trạng thái" },
  { label: "Người nhận", align: "right", className: "hidden md:table-cell" },
  { label: "Lên lịch", className: "hidden lg:table-cell" },
  { label: "Thực thi", className: "hidden lg:table-cell" },
  { label: "Tạo lúc" },
];

export default function JobTable({ jobs, isLoading, totalElements }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Danh sách job
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Sắp xếp từ job được tạo mới nhất
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {totalElements.toLocaleString("vi-VN")} job
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/40">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
            {isLoading && jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                    <ListChecks className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Không có job nào
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Không có job phù hợp với bộ lọc hiện tại
                  </p>
                </td>
              </tr>
            ) : (
              jobs.map((job) => <JobRow key={job.id} job={job} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
