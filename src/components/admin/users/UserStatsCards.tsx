import { UserStatisticsResponse, UserDetailResponse } from "@/types/user";
import { PageResponse } from "@/types/api";

interface UserStatsCardsProps {
  stats: UserStatisticsResponse | null;
  response: PageResponse<UserDetailResponse> | null;
}

export const UserStatsCards = ({ stats, response }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-accent-600 dark:text-accent-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 11a4 4 0 11-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2 20v-1c0-2.761 3.134-5 7-5h6c3.866 0 7 2.239 7 5v1"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng người dùng
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalUsers ?? (response?.totalElements || 0)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Đang hoạt động
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.activeUsers ?? (response?.data?.filter(
                (user: UserDetailResponse) => user.userStatus === "ACTIVE",
              ).length || 0)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.29 3.86l-6.36 11.64A2 2 0 004 18h16a2 2 0 001.77-2.5L17.71 3.86a2 2 0 00-3.42 0L10.29 3.86z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Không hoạt động
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.inactiveUsers ?? (response?.data?.filter(
                (user: UserDetailResponse) => user.userStatus === "INACTIVE",
              ).length || 0)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã xoá</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.deletedUsers ?? (response?.data?.filter(
                (user: UserDetailResponse) => user.userStatus === "DELETED",
              ).length || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
