import { UserStatisticsResponse, UserDetailResponse } from "@/types/user";
import { PageResponse } from "@/types/api";

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
      dot: "bg-gray-400",
      valueClass: "text-gray-900 dark:text-white",
    },
    {
      label: "Đang hoạt động",
      value: active,
      dot: "bg-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Không hoạt động",
      value: inactive,
      dot: "bg-amber-500",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Đã xoá",
      value: deleted,
      dot: "bg-rose-500",
      valueClass: "text-rose-600 dark:text-rose-400",
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
};
