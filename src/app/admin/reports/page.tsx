"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart,
  Area,
  Line,
  ComposedChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LabelProps,
} from "recharts";
import toast from "react-hot-toast";
import { reportApi } from "@/services/report.service";
import { ReportStatsResponse, CourseRevenue } from "@/types/report";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ChartDataPoint {
  name: string;
  value: number;
  avg?: number;
  trend?: number;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const formatPrice = (price: number) => {
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



  useEffect(() => {
    fetchReports();
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
        <div className="bg-card px-4 py-3 shadow-xl rounded-xl border border-border text-foreground">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          {revenueData && (
            <p className="text-base font-bold text-blue-500 mb-1">
              Doanh thu: {formatPrice(revenueData.value)}
            </p>
          )}
          {avgData && (
            <p className="text-sm text-muted-foreground">
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
        <div className="bg-card px-4 py-3 shadow-xl rounded-xl border border-border text-foreground">
          <p className="text-sm font-medium text-muted-foreground mb-1">📅 {label}</p>
          <p className="text-lg font-bold text-emerald-500">
            👤 {payload[0].value} người dùng mới
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading && !stats.totalRevenue) {
    return (
      <div className="p-6 space-y-6 animate-pulse bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2 flex-grow">
            <div className="h-7 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-10 bg-muted rounded w-32 shrink-0" />
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-5 space-y-3 h-28" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-6 h-96" />
          <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-6 h-96" />
        </div>
      </div>
    );
  }



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
      <div className="bg-gradient-to-r from-card to-card/60 rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-5 lg:mb-0">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Báo cáo &amp; Thống kê
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi hiệu suất và phân tích dữ liệu hệ thống
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Custom Select Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className="flex items-center justify-between gap-2 px-4 py-2 border border-input rounded-lg text-sm bg-background hover:bg-accent/5 font-medium transition-colors shadow-sm focus:outline-none min-w-[140px] text-foreground text-left"
              >
                <span>
                  {timeRange === "7days" && "7 ngày qua"}
                  {timeRange === "30days" && "30 ngày qua"}
                  {timeRange === "3months" && "3 tháng qua"}
                  {timeRange === "6months" && "6 tháng qua"}
                  {timeRange === "1year" && "1 năm qua"}
                </span>
                <svg
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-full min-w-[150px] bg-popover text-popover-foreground border border-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  {[
                    { value: "7days", label: "7 ngày qua" },
                    { value: "30days", label: "30 ngày qua" },
                    { value: "3months", label: "3 tháng qua" },
                    { value: "6months", label: "6 tháng qua" },
                    { value: "1year", label: "1 năm qua" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTimeRange(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${timeRange === option.value ? "bg-accent/10 font-semibold text-accent" : "text-foreground font-normal"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="accent"
              onClick={fetchReports}
              disabled={isLoading}
              className="gap-2"
            >
              <svg
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
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
            </Button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 text-accent mr-2"
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
            <span className="text-sm text-accent font-medium">Đang tải báo cáo...</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-foreground mb-2">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-xs text-green-500 font-medium">Trong khoảng thời gian đã chọn</p>
          </div>
        </div>
        <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng người dùng</p>
            <p className="text-2xl font-bold text-foreground mb-2">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-blue-500 font-medium">Tổng số tài khoản</p>
          </div>
        </div>
        <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng khóa học</p>
            <p className="text-2xl font-bold text-foreground mb-2">{stats.totalCourses}</p>
            <p className="text-xs text-purple-500 font-medium">Tổng số khóa học</p>
          </div>
        </div>
        <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tổng đăng ký</p>
            <p className="text-2xl font-bold text-foreground mb-2">{stats.totalEnrollments.toLocaleString()}</p>
            <p className="text-xs text-orange-500 font-medium">Tổng lượt đăng ký khóa học</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-foreground">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
              Doanh thu theo thời gian
            </h3>
            <p className="text-sm text-muted-foreground mt-1 ml-4">
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
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-xs text-muted-foreground">Doanh thu</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-xs text-muted-foreground">Trung bình</span>
            </div>
          </div>
          <div className="h-64">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} tickFormatter={formatYAxis} />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area type="monotone" dataKey="avg" name="Trung bình" stroke="#10b981" strokeWidth={2} fill="url(#avgGrad)" dot={false} activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="value" name="Doanh thu" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#3b82f6", stroke: "#fff", strokeWidth: 2, r: 4 }} activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
          {revenueChartData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Tổng doanh thu</p>
                <p className="text-lg font-bold text-green-500">{formatPrice(revenueChartData.reduce((sum, d) => sum + d.value, 0))}</p>
              </div>
              <div className="text-center border-l border-r border-border">
                <p className="text-xs text-muted-foreground mb-1">Trung bình/kỳ</p>
                <p className="text-lg font-bold text-blue-600">{formatPrice(revenueChartData[0]?.avg || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Cao nhất</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(Math.max(...revenueChartData.map((d) => d.value)))}</p>
              </div>
            </div>
          )}
        </div>

        {/* User Chart */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
              Người dùng mới
            </h3>
            <p className="text-sm text-muted-foreground mt-1 ml-4">Số lượng người dùng đăng ký mới theo ngày</p>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-[#10b981]"></div>
              <span className="text-xs text-muted-foreground">Người dùng</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
              <span className="text-xs text-muted-foreground">Xu hướng</span>
            </div>
          </div>
          <div className="h-64">
            {userChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={userChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="userBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<UserTooltip />} />
                  <Bar dataKey="value" name="Người dùng mới" fill="url(#userBarGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Line type="monotone" dataKey="trend" name="Xu hướng" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", stroke: "#fff", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
          {userChartData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Tổng người dùng mới</p>
                <p className="text-lg font-bold text-emerald-600">{userChartData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-r border-border">
                <p className="text-xs text-muted-foreground mb-1">Trung bình/ngày</p>
                <p className="text-lg font-bold text-blue-600">{Math.round(userChartData.reduce((sum, d) => sum + d.value, 0) / userChartData.length).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Cao nhất</p>
                <p className="text-lg font-bold text-foreground">{Math.max(...userChartData.map((d) => d.value)).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Courses - Bar Chart */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-foreground">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></span>
            Doanh thu theo khóa học
          </h3>
          <p className="text-sm text-muted-foreground mt-1 ml-4">Top 10 khóa học có doanh thu cao nhất</p>
        </div>
        {topCourses.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <svg className="w-16 h-16 mx-auto mb-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    name: course.name.length > 22 ? course.name.substring(0, 20) + "..." : course.name,
                    fullName: course.name,
                    revenue: course.revenue,
                    owners: course.owners,
                  }))}
                  margin={{ top: 25, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 10 }}
                    interval={0}
                    height={30}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl text-foreground w-[220px] space-y-1.5">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                              {data.fullName}
                            </p>
                            <div className="space-y-1.5 pt-1 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">Học viên:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{data.owners.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-bold text-amber-500">
                                <span>Doanh thu:</span>
                                <span>{formatPrice(data.revenue)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="revenue" fill="#9fd3c4" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    <LabelList
                      dataKey="revenue"
                      content={(props: LabelProps) => {
                        const { x, y, width, value } = props;
                        if (x === undefined || y === undefined || width === undefined || value === undefined) return null;
                        const numX = Number(x);
                        const numY = Number(y);
                        const numWidth = Number(width);
                        const numVal = Number(value);
                        if (isNaN(numX) || isNaN(numY) || isNaN(numWidth) || isNaN(numVal)) return null;

                        const formattedVal = formatPrice(numVal);
                        const fontSize = 8;
                        const boxHeight = 14;
                        const boxWidth = formattedVal.length * 4.8 + 6;
                        const boxX = numX + numWidth / 2 - boxWidth / 2;
                        const boxY = numY - 18;

                        return (
                          <g>
                            <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} rx={4} fill={isDark ? "#1e293b" : "#ffffff"} stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth={1} />
                            <text x={numX + numWidth / 2} y={boxY + 9.5} fill={isDark ? "#cbd5e1" : "#4b5563"} fontSize={fontSize} fontWeight="medium" textAnchor="middle">
                              {formattedVal}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {(() => {
              const totalRevenue = topCourses.reduce((sum, c) => sum + c.revenue, 0);
              const totalOwners = topCourses.reduce((sum, c) => sum + c.owners, 0);
              const maxRevenue = topCourses.length > 0 ? Math.max(...topCourses.map((c) => c.revenue)) : 0;
              return (
                <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tổng doanh thu</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{formatPrice(totalRevenue)}</p>
                  </div>
                  <div className="text-center border-l border-border">
                    <p className="text-xs text-muted-foreground mb-1">Tổng học viên</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-500">{totalOwners.toLocaleString()}</p>
                  </div>
                  <div className="text-center border-l border-border">
                    <p className="text-xs text-muted-foreground mb-1">Cao nhất</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatPrice(maxRevenue)}</p>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
}
