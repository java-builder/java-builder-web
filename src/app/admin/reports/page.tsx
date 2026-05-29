"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import ExportButton from "@/components/admin/ExportButton";
import toast from "react-hot-toast";
import { reportApi } from "@/services/report.service";
import { ReportStatsResponse, CourseRevenue } from "@/types/report";
import { userSessionApi } from "@/services/user-session.service";
import { UserSessionStatistics } from "@/types/session";
import { useTheme } from "@/contexts/ThemeContext";

interface ChartDataPoint {
  name: string;
  value: number;
  avg?: number;
  trend?: number;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [stats, setStats] = useState<ReportStatsResponse>({
    totalRevenue: 0,
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenueChart: [],
    userChart: [],
    courseRevenues: [],
  });

  const [revenueChartData, setRevenueChartData] = useState<ChartDataPoint[]>([]);
  const [userChartData, setUserChartData] = useState<ChartDataPoint[]>([]);
  const [topCourses, setTopCourses] = useState<CourseRevenue[]>([]);
  const [sessionStats, setSessionStats] = useState<UserSessionStatistics | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)}B VNĐ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M VNĐ`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const fetchSessionStats = async () => {
    try {
      const response = await userSessionApi.getStatistics();
      if (response && response.data) {
        setSessionStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch session statistics", error);
    }
  };

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reportApi.getStats(timeRange);
      if (res.data) {
        setStats(res.data);
        setTopCourses(res.data.courseRevenues || []);

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
        }
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Không thể tải báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const formatNames = { pdf: "PDF", excel: "Excel", csv: "CSV" };
      toast.success(`Xuất báo cáo ${formatNames[format]} thành công!`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất báo cáo");
      console.error("Export error:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchSessionStats();
  }, [fetchReports]);

  // Custom Tooltip cho Revenue Chart
  const RevenueTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const revenueData = payload.find((p) => p.dataKey === "value");
      const avgData = payload.find((p) => p.dataKey === "avg");
      return (
        <div className="bg-white px-4 py-3 shadow-xl rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
          {revenueData && (
            <p className="text-base font-bold text-blue-600 mb-1">
              Doanh thu: {formatPrice(revenueData.value)}
            </p>
          )}
          {avgData && (
            <p className="text-sm text-gray-600">
              Trung bình: {formatPrice(avgData.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip cho User Chart
  const UserTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 shadow-xl rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">📅 {label}</p>
          <p className="text-lg font-bold text-emerald-600">
            👤 {payload[0].value} người dùng mới
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading && !stats.totalRevenue) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg
          className="animate-spin h-8 w-8 text-accent"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Session analytics derived data
  const sessionStatusData = sessionStats
    ? [
        { name: "Hoạt động", value: sessionStats.activeSessions, fill: "#10b981" },
        { name: "Thu hồi", value: sessionStats.revokedSessions, fill: "#ef4444" },
      ]
    : [];

  const sessionProviderData = sessionStats
    ? Object.entries(sessionStats.sessionsByProvider).map(([key, value]) => ({
        name:
          key === "USERNAME_PASSWORD"
            ? "Mật khẩu"
            : key === "GOOGLE"
            ? "Google"
            : key === "GITHUB"
            ? "GitHub"
            : "LinkedIn",
        value,
      }))
    : [];

  const sessionDeviceData = sessionStats
    ? Object.entries(sessionStats.sessionsByDevice).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  const sessionBrowserData = sessionStats
    ? Object.entries(sessionStats.sessionsByBrowser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }))
    : [];

  const SESSION_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#ef4444",
    "#64748b",
  ];

  const chartColors = {
    text: isDark ? "#9ca3af" : "#6b7280",
    grid: isDark ? "#374151" : "#e5e7eb",
    tooltipBg: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
    tooltipBorder: isDark ? "#4b5563" : "#e5e7eb",
    tooltipText: isDark ? "#fff" : "#111827",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-5 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Báo cáo &amp; Thống kê
            </h1>
            <p className="text-sm text-gray-600">
              Theo dõi hiệu suất và phân tích dữ liệu hệ thống
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-white"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
            <ExportButton onExport={handleExport} disabled={isLoading} />
            <button
              onClick={fetchReports}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm text-blue-700">Đang tải báo cáo...</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-xs text-green-600 font-medium">Trong khoảng thời gian đã chọn</p>
          </div>
        </div>
        <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-blue-600 font-medium">Tổng số tài khoản</p>
          </div>
        </div>
        <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Tổng khóa học</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalCourses}</p>
            <p className="text-xs text-purple-600 font-medium">Tổng số khóa học</p>
          </div>
        </div>
        <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-600 mb-1">Tổng đăng ký</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalEnrollments.toLocaleString()}</p>
            <p className="text-xs text-orange-600 font-medium">Tổng lượt đăng ký khóa học</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
              Doanh thu theo thời gian
            </h3>
            <p className="text-sm text-gray-500 mt-1 ml-4">
              Biểu đồ doanh thu trong{" "}
              {timeRange === "7days"
                ? "7 ngày"
                : timeRange === "30days"
                ? "30 ngày"
                : timeRange === "3months"
                ? "3 tháng"
                : timeRange === "6months"
                ? "6 tháng"
                : "1 năm"}{" "}
              qua
            </p>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#8884d8]"></div>
              <span className="text-xs text-gray-600">Doanh thu</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#82ca9d]"></div>
              <span className="text-xs text-gray-600">Trung bình</span>
            </div>
          </div>
          <div className="h-64">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={formatYAxis} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Line type="natural" dataKey="avg" name="Trung bình" stroke="#82ca9d" strokeWidth={2} dot={{ fill: "#fff", stroke: "#82ca9d", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: "#82ca9d", stroke: "#fff", strokeWidth: 2 }} />
                  <Line type="natural" dataKey="value" name="Doanh thu" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#fff", stroke: "#8884d8", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: "#8884d8", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
          {revenueChartData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
                <p className="text-lg font-bold text-green-600">{formatPrice(revenueChartData.reduce((sum, d) => sum + d.value, 0))}</p>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Trung bình/kỳ</p>
                <p className="text-lg font-bold text-blue-600">{formatPrice(revenueChartData[0]?.avg || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Cao nhất</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(Math.max(...revenueChartData.map((d) => d.value)))}</p>
              </div>
            </div>
          )}
        </div>

        {/* User Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
              Người dùng mới
            </h3>
            <p className="text-sm text-gray-500 mt-1 ml-4">Số lượng người dùng đăng ký mới theo ngày</p>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-[#8884d8]"></div>
              <span className="text-xs text-gray-600">Người dùng</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#ff7300]"></div>
              <span className="text-xs text-gray-600">Xu hướng</span>
            </div>
          </div>
          <div className="h-64">
            {userChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={userChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<UserTooltip />} />
                  <Bar dataKey="value" name="Người dùng mới" fill="#8884d8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="trend" name="Xu hướng" stroke="#ff7300" strokeWidth={2} dot={{ fill: "#ff7300", stroke: "#fff", strokeWidth: 2, r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
          {userChartData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Tổng người dùng mới</p>
                <p className="text-lg font-bold text-emerald-600">{userChartData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Trung bình/ngày</p>
                <p className="text-lg font-bold text-blue-600">{Math.round(userChartData.reduce((sum, d) => sum + d.value, 0) / userChartData.length).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Cao nhất</p>
                <p className="text-lg font-bold text-gray-900">{Math.max(...userChartData.map((d) => d.value)).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Courses - Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></span>
            Doanh thu theo khóa học
          </h3>
          <p className="text-sm text-gray-500 mt-1 ml-4">Top 10 khóa học có doanh thu cao nhất</p>
        </div>
        {topCourses.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-lg font-medium">Chưa có dữ liệu khóa học</p>
          </div>
        ) : (
          <>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCourses.map((course) => ({
                    name: course.name.length > 30 ? course.name.substring(0, 30) + "..." : course.name,
                    fullName: course.name,
                    revenue: course.revenue,
                    owners: course.owners,
                  }))}
                  margin={{ top: 5, right: 20, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={formatYAxis} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white px-4 py-3 shadow-xl rounded-xl border border-gray-100">
                            <p className="text-sm font-medium text-gray-900 mb-2">{data.fullName}</p>
                            <p className="text-base font-bold text-amber-600 mb-1">💰 {formatPrice(data.revenue)}</p>
                            <p className="text-sm text-gray-600">👥 {data.owners.toLocaleString()} học viên</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
                <p className="text-lg font-bold text-amber-600">{formatPrice(topCourses.reduce((sum, c) => sum + c.revenue, 0))}</p>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Tổng học viên</p>
                <p className="text-lg font-bold text-blue-600">{topCourses.reduce((sum, c) => sum + c.owners, 0).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Cao nhất</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(Math.max(...topCourses.map((c) => c.revenue)))}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== Session Analytics Section ===== */}
      {sessionStats && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Thống kê phiên đăng nhập</h2>
            <p className="text-sm text-gray-600">Phân tích chi tiết về các phiên truy cập hệ thống</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng phiên</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{sessionStats.totalSessions}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đang hoạt động</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{sessionStats.activeSessions}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đã thu hồi</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{sessionStats.revokedSessions}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ hoạt động</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {sessionStats.totalSessions > 0
                      ? Math.round((sessionStats.activeSessions / sessionStats.totalSessions) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Session Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution - Donut */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tình trạng phiên</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sessionStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {sessionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", color: chartColors.tooltipText }} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {value}: {(entry as { payload?: { value: number } }).payload?.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Provider Distribution - Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Nguồn đăng nhập</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sessionProviderData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
                  <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 12 }} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", color: chartColors.tooltipText }} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sessionProviderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SESSION_COLORS[index % SESSION_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device Distribution - Donut */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Thiết bị truy cập</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sessionDeviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {sessionDeviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SESSION_COLORS[index % SESSION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", color: chartColors.tooltipText }} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {value}: {(entry as { payload?: { value: number } }).payload?.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Browser Distribution - Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Trình duyệt (Top 8)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sessionBrowserData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.5} />
                  <XAxis dataKey="name" stroke={chartColors.text} angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", color: chartColors.tooltipText }} cursor={{ fill: "rgba(139,92,246,0.1)" }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Providers Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Nguồn đăng nhập</h4>
              </div>
              <div className="space-y-2.5">
                {Object.entries(sessionStats.sessionsByProvider)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, value]) => {
                    const providerNames: Record<string, string> = {
                      GOOGLE: "Google",
                      GITHUB: "GitHub",
                      LINKEDIN: "LinkedIn",
                      USERNAME_PASSWORD: "Mật khẩu",
                    };
                    const name = providerNames[key] || key;
                    return (
                      <div key={key} className="flex items-center justify-between group">
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                          {name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-16">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(value / sessionStats.totalSessions) * 100}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right">{value}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Devices Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Thiết bị</h4>
              </div>
              <div className="space-y-2.5">
                {Object.entries(sessionStats.sessionsByDevice)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between group">
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{key}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-16">
                          <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(value / sessionStats.totalSessions) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right">{value}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Browsers Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Trình duyệt</h4>
              </div>
              <div className="space-y-2.5">
                {Object.entries(sessionStats.sessionsByBrowser)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between group">
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px] group-hover:text-gray-900 dark:group-hover:text-white transition-colors" title={key}>{key}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-16">
                          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(value / sessionStats.totalSessions) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right">{value}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
