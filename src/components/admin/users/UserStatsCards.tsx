import { UserStatisticsResponse, UserDetailResponse } from "@/types/user";
import { PageResponse } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";

interface UserStatsCardsProps {
  stats: UserStatisticsResponse | null;
  response: PageResponse<UserDetailResponse> | null;
}

export const UserStatsCards = ({ stats, response }: UserStatsCardsProps) => {
  const total = stats?.totalUsers ?? response?.totalElements ?? 0;
  const active =
    stats?.activeUsers ??
    response?.data?.filter((u) => u.userStatus === "ACTIVE").length ??
    0;
  const inactive =
    stats?.inactiveUsers ??
    response?.data?.filter((u) => u.userStatus === "INACTIVE").length ??
    0;
  const deleted =
    stats?.deletedUsers ??
    response?.data?.filter((u) => u.userStatus === "DELETED").length ??
    0;

  const items = [
    {
      label: "Tổng người dùng",
      value: total,
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-foreground",
    },
    {
      label: "Đang hoạt động",
      value: active,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Không hoạt động",
      value: inactive,
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      accent: "border-amber-100 dark:border-amber-900/30",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Đã xoá",
      value: deleted,
      icon: <Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      bg: "bg-rose-50 dark:bg-rose-950/30",
      accent: "border-rose-100 dark:border-rose-900/30",
      valueClass: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className={`border ${item.accent} hover:shadow-md transition-all duration-200`}>
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                {item.value.toLocaleString("vi-VN")}
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
