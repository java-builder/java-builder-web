import { CourseStats } from "@/types/admin";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, CircleDollarSign } from "lucide-react";

interface CourseStatsCardsProps {
  stats: CourseStats;
  formatRevenue: (revenue: number) => string;
  isLoading?: boolean;
}

export const CourseStatsCards = ({ stats, formatRevenue, isLoading = false }: CourseStatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border bg-card animate-pulse">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
              <div className="w-10 h-10 bg-muted rounded-xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng khóa học",
      value: stats.total.toLocaleString("vi-VN"),
      icon: <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-foreground",
    },
    {
      label: "Học viên",
      value: stats.totalStudents.toLocaleString("vi-VN"),
      icon: <GraduationCap className="h-5 w-5 text-accent dark:text-accent-on-dark" />,
      bg: "bg-accent/10 dark:bg-accent/20",
      accent: "border-accent/15 dark:border-accent/30",
      valueClass: "text-accent dark:text-accent-on-dark",
    },
    {
      label: "Doanh thu",
      value: formatRevenue(stats.totalRevenue),
      icon: <CircleDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} className={`border ${item.accent} hover:shadow-md transition-all duration-200 bg-card`}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                {item.value}
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
