"use client";

import type { CourseEnrollmentResponse } from "@/types/enrollment";
import { Card } from "@/components/ui/card";

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
      valueClass: "text-foreground",
      dot: "bg-blue-500",
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
      valueClass: "text-accent dark:text-accent-on-dark",
      dot: "bg-accent",
    },
    {
      label: "Chưa bắt đầu",
      value: notStarted,
      valueClass: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
  ];

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-sm rounded-xl">
      <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
              {item.label}
            </p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
              {item.value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
