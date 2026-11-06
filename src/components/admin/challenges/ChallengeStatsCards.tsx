"use client";

import { Layers, CheckCircle2, EyeOff, Calendar } from "lucide-react";

interface ChallengeStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  totalDays: number;
  isLoading?: boolean;
}

export default function ChallengeStatsCards({
  total,
  active,
  inactive,
  totalDays,
  isLoading = false,
}: ChallengeStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-5 shadow-xs flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2.5 flex-1">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-7 bg-muted rounded w-14" />
            </div>
            <div className="w-10 h-10 bg-muted rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng lộ trình",
      value: total.toLocaleString("vi-VN"),
      subtext: "Thử thách trong hệ thống",
      icon: <Layers className="h-5 w-5 text-primary" />,
      iconBg: "bg-primary-soft border border-primary/15",
      valueClass: "text-foreground",
    },
    {
      label: "Đang hoạt động",
      value: active.toLocaleString("vi-VN"),
      subtext: "Công khai cho học viên",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-500/10 border border-emerald-500/20",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Đang tạm ẩn",
      value: inactive.toLocaleString("vi-VN"),
      subtext: "Bản nháp / Chưa mở",
      icon: <EyeOff className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
      iconBg: "bg-muted border border-border",
      valueClass: "text-foreground",
    },
    {
      label: "Tổng số ngày học",
      value: `${totalDays.toLocaleString("vi-VN")}`,
      subtext: "Ngày bài học đã thiết kế",
      icon: <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
      iconBg: "bg-sky-500/10 border border-sky-500/20",
      valueClass: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-surface p-5 shadow-xs hover:shadow-md transition-all duration-200 flex items-start justify-between gap-3"
        >
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              {item.label}
            </p>
            <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
              {item.value}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {item.subtext}
            </p>
          </div>
          <div className={`p-2.5 rounded-xl shrink-0 ${item.iconBg}`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
