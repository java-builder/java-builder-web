"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { BookOpen, Trophy, Loader2 } from "lucide-react";
import { reportApi } from "@/services/report.service";
import { ReportStatsResponse, ItemRevenue } from "@/types/report";
import {
  ReportHeader,
  ReportStatsCards,
  RevenueOverTimeChart,
  NewUsersChart,
  ItemRevenueBarChart,
  ReportsSkeleton,
  ChartDataPoint,
} from "@/components/admin/reports";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [stats, setStats] = useState<ReportStatsResponse>({
    totalRevenue: 0,
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenueChart: [],
    userChart: [],
    courseRevenues: [],
    challengeRevenues: [],
  });

  const [revenueChartData, setRevenueChartData] = useState<ChartDataPoint[]>([]);
  const [userChartData, setUserChartData] = useState<ChartDataPoint[]>([]);
  const [topCourses, setTopCourses] = useState<ItemRevenue[]>([]);
  const [topChallenges, setTopChallenges] = useState<ItemRevenue[]>([]);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reportApi.getStats(timeRange);
      if (res.data) {
        setStats(res.data);
        setTopCourses(res.data.courseRevenues || []);
        setTopChallenges(res.data.challengeRevenues || []);

        if (res.data.revenueChart && res.data.revenueChart.length > 0) {
          const revenueValues = res.data.revenueChart.map((d) => d.value);
          const avgRevenue =
            revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length;

          setRevenueChartData(
            res.data.revenueChart.map((d) => ({
              name: d.label,
              value: d.value,
              avg: avgRevenue,
            }))
          );
        } else {
          setRevenueChartData([]);
        }

        if (res.data.userChart && res.data.userChart.length > 0) {
          const userValues = res.data.userChart.map((d) => d.value);
          setUserChartData(
            res.data.userChart.map((d, i) => {
              const start = Math.max(0, i - 2);
              const slice = userValues.slice(start, i + 1);
              const trend = slice.reduce((a, b) => a + b, 0) / slice.length;
              return {
                name: d.label,
                value: d.value,
                trend: Math.round(trend * 10) / 10,
              };
            })
          );
        } else {
          setUserChartData([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Không thể tải báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (isLoading && !stats.totalRevenue) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with time range selector and refresh button */}
      <ReportHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={fetchReports}
        isLoading={isLoading}
      />

      {/* Loading inline bar indicator */}
      {isLoading && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center">
            <Loader2 className="animate-spin h-4 w-4 text-accent mr-2" />
            <span className="text-sm text-accent font-medium">Đang tải báo cáo...</span>
          </div>
        </div>
      )}

      {/* Summary Metric Cards */}
      <ReportStatsCards
        totalRevenue={stats.totalRevenue}
        totalUsers={stats.totalUsers}
        totalCourses={stats.totalCourses}
        totalEnrollments={stats.totalEnrollments}
      />

      {/* Time-series Charts Grid: Revenue & New Users */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 text-foreground">
        <RevenueOverTimeChart
          data={revenueChartData}
          timeRange={timeRange}
          isDark={isDark}
        />
        <NewUsersChart
          data={userChartData}
          isDark={isDark}
        />
      </div>

      {/* Products Revenue Grid: Courses & Challenges */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 text-foreground">
        <ItemRevenueBarChart
          title="Doanh thu theo khóa học"
          subtitle="Top khóa học có doanh thu cao nhất"
          items={topCourses}
          itemUnit="khóa học"
          ownerLabel="Học viên"
          accentGradient="bg-gradient-to-b from-amber-500 to-amber-600"
          barColor="#9fd3c4"
          emptyIcon={<BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />}
          emptyText="Chưa có dữ liệu khóa học"
          tooltipValueColor="text-amber-500"
          isDark={isDark}
        />

        <ItemRevenueBarChart
          title="Doanh thu theo thử thách"
          subtitle="Top thử thách có doanh thu cao nhất"
          items={topChallenges}
          itemUnit="thử thách"
          ownerLabel="Người tham gia"
          accentGradient="bg-gradient-to-b from-orange-500 to-orange-600"
          barColor="#f59e0b"
          emptyIcon={<Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />}
          emptyText="Chưa có dữ liệu thử thách"
          tooltipValueColor="text-orange-500"
          isDark={isDark}
        />
      </div>
    </div>
  );
}
