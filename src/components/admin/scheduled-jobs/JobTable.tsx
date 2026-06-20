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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách job
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
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
        <table className="w-full divide-y divide-border bg-card">
          <thead className="bg-muted/50">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_HEADERS.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
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
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <ListChecks className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Không có job nào
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
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
