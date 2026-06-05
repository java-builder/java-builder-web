"use client";

import type { CourseEnrollmentResponse } from "@/types/enrollment";

interface EnrollmentsStatsProps {
  totalElements: number;
  enrollments: CourseEnrollmentResponse[];
}

export default function EnrollmentsStats({
  totalElements,
  enrollments,
}: EnrollmentsStatsProps) {
  const completed = enrollments.filter((e) => e.completed).length;
  const inProgress = enrollments.filter((e) => !e.completed && e.progress > 0).length;
  const notStarted = enrollments.filter((e) => e.progress === 0).length;

  const items = [
    {
      label: "Tổng học viên",
      value: totalElements,
      valueClass: "text-gray-900 dark:text-white",
      dot: "bg-gray-400",
    },
    {
      label: "Đã hoàn thành",
      value: completed,
      valueClass: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    {
      label: "Đang học",
      value: inProgress,
      valueClass: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    {
      label: "Chưa bắt đầu",
      value: notStarted,
      valueClass: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid grid-cols-2 divide-y divide-gray-200 dark:divide-slate-700 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
              {item.label}
            </p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${item.valueClass}`}>
              {item.value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
