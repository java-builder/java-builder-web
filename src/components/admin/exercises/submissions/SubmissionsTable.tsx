"use client";

import { FileText } from "lucide-react";
import type { ExerciseSubmissionSummaryResponse } from "@/types/exercise-submission";
import SubmissionRow from "./SubmissionRow";

interface SubmissionsTableProps {
  submissions: ExerciseSubmissionSummaryResponse[];
  page: number;
  pageSize: number;
  totalAttempts: number;
  onView: (submissionId: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right"; srOnly?: boolean }[] = [
  { label: "Lần" },
  { label: "Trạng thái" },
  { label: "Điểm", align: "right" },
  { label: "Câu đúng", align: "right" },
  { label: "Thời điểm nộp" },
  { label: "Hành động", align: "right", srOnly: true },
];

export default function SubmissionsTable({
  submissions,
  page,
  pageSize,
  totalAttempts,
  onView,
}: SubmissionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Danh sách lần làm</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sắp xếp từ lần làm đầu tiên đến gần đây nhất
          </p>
        </div>
        {totalAttempts > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {totalAttempts} lần
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.srOnly ? <span className="sr-only">{col.label}</span> : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {submissions.map((submission, index) => (
              <SubmissionRow
                key={submission.submissionId}
                attemptNumber={(page - 1) * pageSize + index + 1}
                submission={submission}
                onView={onView}
              />
            ))}

            {submissions.length === 0 && (
              <tr>
                <td colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Chưa có dữ liệu</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Học viên chưa làm bài tập này
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
