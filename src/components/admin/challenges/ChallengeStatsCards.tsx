"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, CheckCircle2, EyeOff, Calendar } from "lucide-react";

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
          <Card key={i} className="border-border bg-card animate-pulse">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-muted rounded w-20" />
                <div className="h-7 bg-muted rounded w-14" />
              </div>
              <div className="w-10 h-10 bg-muted rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng thử thách theo ngày",
      value: total.toLocaleString("vi-VN"),
      icon: <Flame className="h-5 w-5 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      accent: "border-amber-100 dark:border-amber-900/30",
      valueClass: "text-foreground",
    },
    {
      label: "Đang mở (Active)",
      value: active.toLocaleString("vi-VN"),
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Tạm ẩn (Inactive)",
      value: inactive.toLocaleString("vi-VN"),
      icon: <EyeOff className="h-5 w-5 text-muted-foreground" />,
      bg: "bg-muted/40",
      accent: "border-border",
      valueClass: "text-muted-foreground",
    },
    {
      label: "Tổng ngày lộ trình",
      value: `${totalDays.toLocaleString("vi-VN")} ngày`,
      icon: <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`border ${item.accent} hover:shadow-md transition-all duration-200 bg-card`}
        >
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                {item.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${item.bg}`}>
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
