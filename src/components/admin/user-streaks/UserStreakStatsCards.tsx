import { UserStreakStats } from "@/types/user-streak";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, AlertTriangle, Trophy } from "lucide-react";

interface UserStreakStatsCardsProps {
  stats: UserStreakStats | null;
}

export const UserStreakStatsCards = ({ stats }: UserStreakStatsCardsProps) => {
  const total = stats?.totalStreakUsers ?? 0;
  const activeToday = stats?.activeTodayCount ?? 0;
  const atRisk = stats?.atRiskCount ?? 0;
  const topStreak = stats?.topCurrentStreak ?? 0;
  const avgStreak = stats?.avgCurrentStreak ?? 0;

  const items = [
    {
      label: "Tổng người dùng streak",
      value: `${total.toLocaleString("vi-VN")}`,
      subtext: "Hoạt động",
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-foreground",
    },
    {
      label: "Đã duy trì hôm nay",
      value: `${activeToday.toLocaleString("vi-VN")}`,
      subtext: "Đã hoàn thành",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Nguy cơ đứt chuỗi",
      value: `${atRisk.toLocaleString("vi-VN")}`,
      subtext: "Cần nhắc nhở",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      accent: "border-amber-100 dark:border-amber-900/30",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Kỷ lục streak cao nhất",
      value: `${topStreak.toLocaleString("vi-VN")} ngày`,
      subtext: `TB: ${avgStreak} ngày`,
      icon: <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
      bg: "bg-orange-50 dark:bg-orange-950/30",
      accent: "border-orange-100 dark:border-orange-900/30",
      valueClass: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className={`border ${item.accent} hover:shadow-md transition-all duration-200`}>
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                {item.value}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {item.subtext}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${item.bg}`}>
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
