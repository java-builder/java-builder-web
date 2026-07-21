"use client";

import React from "react";
import { Send, ExternalLink, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PushStatsCardsProps {
  totalSent: number;
  totalClicks: number;
  avgCtr: string;
  activeDevicesCount?: number;
}

export default function PushStatsCards({
  totalSent,
  totalClicks,
  avgCtr,
  activeDevicesCount = 3850,
}: PushStatsCardsProps) {
  const items = [
    {
      label: "Tổng Push đã phát",
      value: totalSent.toLocaleString("vi-VN"),
      subText: null,
      icon: <Send className="h-5 w-5 text-accent dark:text-accent-on-dark" />,
      bg: "bg-accent/10",
      accentBorder: "border-accent/20",
    },
    {
      label: "Lượt click quay lại web",
      value: totalClicks.toLocaleString("vi-VN"),
      subText: `(${avgCtr}%)`,
      icon: <ExternalLink className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accentBorder: "border-emerald-100 dark:border-emerald-900/30",
    },
    {
      label: "Trình duyệt đã đăng ký (Devices)",
      value: activeDevicesCount.toLocaleString("vi-VN"),
      subText: null,
      icon: <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accentBorder: "border-blue-100 dark:border-blue-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`border ${item.accentBorder} hover:shadow-md transition-all duration-200`}
        >
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {item.value}{" "}
                {item.subText && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.subText}
                  </span>
                )}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${item.bg} flex-shrink-0`}>
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
