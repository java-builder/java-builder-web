"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUserActivities } from "@/hooks/useUserActivities";
import { 
  ActivityType, 
  ActivityTypeDisplayNames, 
  ActivityTypeColors 
} from "@/types/user-activity";
import { formatRelativeTime, formatApiDate, parseDate } from "@/utils/dateUtils";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";
import { getRandomQuote } from "@/utils/motivationalQuotes";

// Animated Counter Component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function StudyProgressClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<"today" | "yesterday" | "week" | "month" | "6months" | "custom">("today");
  const pageSize = 20;

  const dailyQuote = useMemo(() => getRandomQuote(), []);

  const getFilterDate = (filter: typeof dateFilter): string => {
    const today = new Date();
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

  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof activities> = {};
    
    activities.forEach((activity) => {
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

  const stats = useMemo(() => {
    const typeCount: Record<ActivityType, number> = {
      [ActivityType.VIEW_LESSON]: 0,
      [ActivityType.READ_BLOG]: 0,
      [ActivityType.READ_INTERVIEW]: 0,
      [ActivityType.SUBMIT_EXERCISE]: 0,
    };
    
    // Count actual activities
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-slate-300 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-slate-50">
                  Nhật ký học tập
                </h1>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  Theo dõi hành trình phát triển của bạn mỗi ngày
                </p>
              </div>
            </div>

            {/* Motivational Quote - Desktop (Corner) */}
            <div className="hidden lg:block max-w-xs">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white italic leading-relaxed line-clamp-2">
                      &ldquo;{dailyQuote.quote}&rdquo;
                    </p>
                    <p className="text-xs text-accent mt-1">
                      — {dailyQuote.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote - Mobile (Below Header) */}
          <div className="lg:hidden mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white italic leading-relaxed">
                    &ldquo;{dailyQuote.quote}&rdquo;
                  </p>
                  <p className="text-xs text-accent mt-1">
                    — {dailyQuote.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Filter Section */}
        <div className="mb-6">
          {/* Date Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Hoặc chọn ngày:
                  </label>
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateFilter}
                      className="w-full px-3 py-1.5 pr-8 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
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
                
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:ml-auto">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-300 whitespace-nowrap">
                    {data?.totalElements || 0} hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards with Better Design - Always Show */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Thống kê chi tiết
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats).map(([type, count]) => {
              const activityType = type as ActivityType;
              return (
                <div
                  key={type}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${ActivityTypeColors[activityType]}`}>
                      <ActivityTypeIcon type={activityType} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={count} />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {ActivityTypeDisplayNames[activityType]}
                  </p>
                  <div className="mt-2 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${ActivityTypeColors[activityType]} transition-all duration-1000`}
                      style={{ width: `${data?.totalElements ? Math.min((count / data.totalElements) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedDate ? "Không có hoạt động" : "Bắt đầu hành trình của bạn"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {selectedDate 
                ? "Không có hoạt động nào trong ngày này. Hãy thử chọn ngày khác!" 
                : "Mỗi bước đi đều được ghi nhận. Bắt đầu học ngay để xây dựng thói quen học tập tốt!"}
            </p>
            {!selectedDate && (
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Khám phá khóa học
                </Link>
                <Link
                  href="/exercises"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Làm bài tập
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Dòng thời gian
              </h2>
            </div>
            
            <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
              <div key={date} className="relative">
                {/* Date Header - Compact */}
                <div className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-900 pb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg text-white text-sm font-medium shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{date}</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-semibold">
                      {dateActivities.length}
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
                        <div className="absolute -left-[23px] top-3">
                          <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${ActivityTypeColors[activityType]} transition-transform group-hover:scale-125`}>
                          </div>
                        </div>

                        {/* Activity Card - Compact Design */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all group-hover:border-accent/50">
                          <div className="flex items-center gap-3">
                            {/* Icon - Smaller */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${ActivityTypeColors[activityType]}`}>
                              <ActivityTypeIcon type={activityType} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ActivityTypeColors[activityType]}`}>
                                  {ActivityTypeDisplayNames[activityType]}
                                </span>
                                <span 
                                  className="text-xs text-gray-500 dark:text-gray-300"
                                  title={formatApiDate(activity.activityDateTime)}
                                >
                                  {formatRelativeTime(activity.activityDateTime)}
                                </span>
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
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
          </div>
        )}

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="inline-flex items-center gap-3 px-8 py-3 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isFetching ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang tải thêm...</span>
                </>
              ) : (
                <>
                  <span>Xem thêm hoạt động</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
              Trang {currentPage} / {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
