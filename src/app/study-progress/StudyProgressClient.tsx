"use client";

import { useState, useMemo } from "react";
import { useUserActivities } from "@/hooks/useUserActivities";
import { 
  ActivityType, 
  ActivityTypeDisplayNames, 
  ActivityTypeColors 
} from "@/types/user-activity";
import { formatRelativeTime, formatApiDate, parseDate } from "@/utils/dateUtils";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";

export default function StudyProgressClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<"today" | "yesterday" | "week" | "month" | "6months" | "custom">("today");
  const pageSize = 20;

  // Calculate date based on filter
  const getFilterDate = (filter: typeof dateFilter): string => {
    const today = new Date();
    // Use local date to avoid timezone issues
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    let targetDate: Date;
    
    switch (filter) {
      case "today":
        targetDate = new Date(year, month, day);
        break;
      case "yesterday":
        targetDate = new Date(year, month, day - 1);
        break;
      case "week":
        targetDate = new Date(year, month, day - 7);
        break;
      case "month":
        targetDate = new Date(year, month - 1, day);
        break;
      case "6months":
        targetDate = new Date(year, month - 6, day);
        break;
      case "custom":
        return selectedDate;
      default:
        return "";
    }
    
    // Format as YYYY-MM-DD (ISO date format)
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  };

  const filterDate = dateFilter === "custom" ? selectedDate : getFilterDate(dateFilter);

  const { data, isLoading, isFetching } = useUserActivities(
    currentPage,
    pageSize,
    filterDate || undefined
  );

  const activities = useMemo(() => data?.data || [], [data?.data]);
  const totalPages = data?.totalPages || 1;

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof activities> = {};
    
    activities.forEach((activity) => {
      // Parse date properly using dateUtils
      const activityDate = parseDate(activity.activityDateTime);
      if (!activityDate) return;
      
      const date = activityDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    
    return groups;
  }, [activities]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setDateFilter("custom");
    setCurrentPage(1);
  };

  const handleQuickFilter = (filter: typeof dateFilter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setDateFilter("today");
    setCurrentPage(1);
  };

  // Statistics
  const stats = useMemo(() => {
    const typeCount: Partial<Record<ActivityType, number>> = {};
    activities.forEach((activity) => {
      typeCount[activity.activityType] = (typeCount[activity.activityType] || 0) + 1;
    });
    return typeCount;
  }, [activities]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Nhật ký học tập
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Theo dõi lịch sử hoạt động và tiến trình học tập của bạn
            </p>
          </div>

          {/* Date Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="space-y-3">
              {/* Quick Filters */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lọc theo thời gian
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleQuickFilter("today")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === "today"
                        ? "bg-accent text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={() => handleQuickFilter("yesterday")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === "yesterday"
                        ? "bg-accent text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    Hôm qua
                  </button>
                  <button
                    onClick={() => handleQuickFilter("week")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === "week"
                        ? "bg-accent text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    7 ngày trước
                  </button>
                  <button
                    onClick={() => handleQuickFilter("month")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === "month"
                        ? "bg-accent text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    1 tháng trước
                  </button>
                  <button
                    onClick={() => handleQuickFilter("6months")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateFilter === "6months"
                        ? "bg-accent text-white shadow-sm"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    6 tháng trước
                  </button>
                </div>
              </div>

              {/* Custom Date Picker & Stats */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Hoặc chọn ngày:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateFilter}
                      className="px-3 py-1.5 pr-8 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Chọn ngày cụ thể"
                    />
                    {dateFilter === "custom" && selectedDate && (
                      <button
                        onClick={clearDateFilter}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {data?.totalElements || 0} hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {Object.entries(stats).map(([type, count]) => {
              const activityType = type as ActivityType;
              return (
                <div
                  key={type}
                  className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${ActivityTypeColors[activityType]}`}>
                      <ActivityTypeIcon type={activityType} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {ActivityTypeDisplayNames[activityType]}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline */}
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Chưa có hoạt động nào
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedDate 
                ? "Không có hoạt động nào trong ngày này" 
                : "Bắt đầu học ngay để ghi lại hành trình của bạn"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-900 pb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {date}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({dateActivities.length} hoạt động)
                    </span>
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="relative pl-8 space-y-4">
                  {/* Timeline Line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-transparent"></div>

                  {dateActivities.map((activity, index) => {
                    const activityType = activity.activityType as ActivityType;
                    const isLast = index === dateActivities.length - 1;

                    return (
                      <div key={activity.id} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[23px] top-3 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${ActivityTypeColors[activityType]} transition-transform group-hover:scale-125`}>
                        </div>

                        {/* Activity Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all group-hover:border-accent/50">
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${ActivityTypeColors[activityType]}`}>
                              <ActivityTypeIcon type={activityType} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ActivityTypeColors[activityType]}`}>
                                  {ActivityTypeDisplayNames[activityType]}
                                </span>
                                <span 
                                  className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0"
                                  title={formatApiDate(activity.activityDateTime)}
                                >
                                  {formatRelativeTime(activity.activityDateTime)}
                                </span>
                              </div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {activity.resourceTitle}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Connector Line (if not last) */}
                        {!isLast && (
                          <div className="absolute -left-[23px] top-[52px] w-4 h-4 border-l-2 border-b-2 border-accent/20 rounded-bl-lg"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tải...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Xem thêm
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
