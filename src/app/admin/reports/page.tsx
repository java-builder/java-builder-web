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
  RadialBarChart,
  RadialBar,
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
        <div id="session-analytics" className="space-y-6 scroll-mt-24">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thống kê phiên đăng nhập</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">Phân tích chi tiết về các phiên truy cập hệ thống</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white overflow-hidden shadow-lg shadow-blue-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-2">Tổng phiên</p>
              <p className="text-4xl font-bold">{sessionStats.totalSessions.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-2">Tất cả phiên đăng nhập</p>
            </div>
            <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white overflow-hidden shadow-lg shadow-emerald-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-2">Đang hoạt động</p>
              <p className="text-4xl font-bold">{sessionStats.activeSessions.toLocaleString()}</p>
              <p className="text-emerald-200 text-xs mt-2">Phiên đang online</p>
            </div>
            <div className="relative bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white overflow-hidden shadow-lg shadow-rose-500/20">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
              <p className="text-rose-100 text-xs font-medium uppercase tracking-wider mb-2">Đã thu hồi</p>
              <p className="text-4xl font-bold">{sessionStats.revokedSessions.toLocaleString()}</p>
              <p className="text-rose-200 text-xs mt-2">Phiên bị vô hiệu hóa</p>
            </div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <p className="text-gray-500 dark:text-gray-300 text-xs font-medium uppercase tracking-wider mb-3">Tỷ lệ hoạt động</p>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? "#374151" : "#f3f4f6"} strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#10b981" strokeWidth="3"
                      strokeDasharray={`${sessionStats.totalSessions > 0 ? (sessionStats.activeSessions / sessionStats.totalSessions) * 100 : 0} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white">
                    {sessionStats.totalSessions > 0 ? Math.round((sessionStats.activeSessions / sessionStats.totalSessions) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sessionStats.totalSessions > 0 ? Math.round((sessionStats.activeSessions / sessionStats.totalSessions) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">phiên đang dùng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 1: Status Donut + Provider Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Status Donut - 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Tình trạng phiên</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">Phân bổ trạng thái hoạt động</p>
                </div>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="revokedGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={sessionStatusData}
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90} endAngle={-270}
                      stroke="none"
                    >
                      {sessionStatusData.map((entry, index) => (
                        <Cell key={index} fill={index === 0 ? "url(#activeGradient)" : "url(#revokedGradient)"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: chartColors.tooltipBg, border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", color: chartColors.tooltipText, padding: "10px 14px" }}
                      formatter={(value: number | string | (number | string)[] | undefined, name) => [`${value} phiên`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{sessionStats.totalSessions}</span>
                  <span className="text-xs text-gray-400 mt-1">tổng phiên</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                {sessionStatusData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-gray-500 dark:text-gray-300">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                    <p className="text-xs text-gray-400">
                      {sessionStats.totalSessions > 0 ? Math.round((item.value / sessionStats.totalSessions) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Donut + Legend - 3 cols */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Nguồn đăng nhập</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">Phân bổ theo phương thức xác thực</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 items-center">
                <div className="relative">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={[...sessionProviderData].sort((a, b) => b.value - a.value)}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={95}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90} endAngle={-270}
                        stroke="none"
                      >
                        {sessionProviderData.map((_, index) => {
                          const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
                          return <Cell key={index} fill={colors[index % colors.length]} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: chartColors.tooltipBg, border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", color: chartColors.tooltipText, padding: "10px 14px" }}
                        formatter={(value: number | string | (number | string)[] | undefined, name) => [`${value} phiên`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{sessionProviderData.length}</span>
                    <span className="text-xs text-gray-400 mt-0.5">nguồn</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[...sessionProviderData].sort((a, b) => b.value - a.value).map((item, index) => {
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
                    const pct = sessionStats.totalSessions > 0 ? (item.value / sessionStats.totalSessions) * 100 : 0;
                    return (
                      <div key={item.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{item.value.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 tabular-nums w-9 text-right">{Math.round(pct)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Device Radial + Browser Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Device Radial Chart - 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Thiết bị truy cập</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">Phân bổ theo loại thiết bị</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="30%" outerRadius="100%"
                  data={[...sessionDeviceData].sort((a, b) => b.value - a.value).map((d, i) => ({
                    ...d,
                    fill: SESSION_COLORS[i % SESSION_COLORS.length],
                    pct: sessionStats.totalSessions > 0 ? Math.round((d.value / sessionStats.totalSessions) * 100) : 0,
                  }))}
                  startAngle={90} endAngle={-270}
                >
                  <RadialBar background={{ fill: isDark ? "#374151" : "#f3f4f6" }} dataKey="value" cornerRadius={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: chartColors.tooltipBg, border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", color: chartColors.tooltipText, padding: "10px 14px" }}
                    formatter={(value: number | string | (number | string)[] | undefined) => [`${value} phiên`, "Số lượng"]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                {[...sessionDeviceData].sort((a, b) => b.value - a.value).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SESSION_COLORS[index % SESSION_COLORS.length] }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                      <span className="text-xs text-gray-400 w-9 text-right">
                        {sessionStats.totalSessions > 0 ? Math.round((item.value / sessionStats.totalSessions) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Bar Chart - 3 cols */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Trình duyệt</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">Top 8 trình duyệt phổ biến nhất</p>
                </div>
                <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full font-medium">
                  Top 8
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sessionBrowserData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="browserGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false} tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: chartColors.tooltipBg, border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", color: chartColors.tooltipText, padding: "10px 14px" }}
                    cursor={{ fill: "rgba(139,92,246,0.06)" }}
                    formatter={(value: number | string | (number | string)[] | undefined) => [`${value} phiên`, "Số lượng"]}
                  />
                  <Bar dataKey="value" fill="url(#browserGradient)" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                {sessionBrowserData.map((item) => {
                  const pct = sessionStats.totalSessions > 0 ? (item.value / sessionStats.totalSessions) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={item.name}>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{item.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 tabular-nums w-9 text-right">{Math.round(pct)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
