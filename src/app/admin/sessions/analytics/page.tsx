"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { userSessionApi } from "@/services/user-session.service";
import { UserSessionStatistics } from "@/types/session";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { formatPercent } from "@/utils/formatters";

export default function SessionAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState<UserSessionStatistics | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const fetchSessionStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userSessionApi.getStatistics();
      if (response && response.data) {
        setSessionStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch session statistics", error);
      toast.error("Không thể tải thống kê phiên đăng nhập");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionStats();
  }, [fetchSessionStats]);

  // Derived charts data
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

  if (isLoading && !sessionStats) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-6 h-96" />
          <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-6 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-foreground min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-card to-card/60 rounded-xl p-6 border border-border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Báo cáo Phiên đăng nhập
          </h1>
          <p className="text-sm text-muted-foreground">
            Phân tích chi tiết về các phiên truy cập và bảo mật hệ thống
          </p>
        </div>
        <Button
          variant="accent"
          onClick={fetchSessionStats}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto"
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

      {sessionStats && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="relative bg-card rounded-2xl p-5 border border-border shadow-sm overflow-hidden">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">Tỷ lệ hoạt động</p>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? "var(--muted)" : "#f3f4f6"} strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#10b981" strokeWidth="3"
                      strokeDasharray={`${sessionStats.totalSessions > 0 ? (sessionStats.activeSessions / sessionStats.totalSessions) * 100 : 0} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
                    {sessionStats.totalSessions > 0 ? formatPercent((sessionStats.activeSessions / sessionStats.totalSessions) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {sessionStats.totalSessions > 0 ? formatPercent((sessionStats.activeSessions / sessionStats.totalSessions) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">phiên đang dùng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 1: Status Donut + Provider Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Status Donut - 2 cols */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-2">
                <h3 className="text-base font-semibold text-foreground">Tình trạng phiên</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Phân bổ trạng thái hoạt động</p>
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
                      formatter={(value: number | string | readonly (number | string)[] | undefined, name) => [`${value} phiên`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-foreground">{sessionStats.totalSessions}</span>
                  <span className="text-xs text-muted-foreground mt-1">tổng phiên</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                {sessionStatusData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {sessionStats.totalSessions > 0 ? formatPercent((item.value / sessionStats.totalSessions) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Donut + Legend - 3 cols */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-2">
                <h3 className="text-base font-semibold text-foreground">Nguồn đăng nhập</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Phân bổ theo phương thức xác thực</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
                        formatter={(value: number | string | readonly (number | string)[] | undefined, name) => [`${value} phiên`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-foreground">{sessionStats.totalSessions}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">phiên</span>
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
                          <span className="text-sm text-muted-foreground truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-semibold text-foreground tabular-nums">{item.value.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">{formatPercent(pct)}%</span>
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
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-2">
                <h3 className="text-base font-semibold text-foreground">Thiết bị truy cập</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Phân bổ theo loại thiết bị</p>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={[...sessionDeviceData].sort((a, b) => b.value - a.value)}
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90} endAngle={-270}
                      stroke="none"
                    >
                      {[...sessionDeviceData].sort((a, b) => b.value - a.value).map((entry, index) => (
                        <Cell key={index} fill={SESSION_COLORS[index % SESSION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: chartColors.tooltipBg, border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", color: chartColors.tooltipText, padding: "10px 14px" }}
                      formatter={(value: number | string | readonly (number | string)[] | undefined) => [`${value} phiên`, "Số lượng"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-foreground">{sessionStats.totalSessions}</span>
                  <span className="text-xs text-muted-foreground mt-1">tổng phiên</span>
                </div>
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                {[...sessionDeviceData].sort((a, b) => b.value - a.value).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SESSION_COLORS[index % SESSION_COLORS.length] }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {sessionStats.totalSessions > 0 ? formatPercent((item.value / sessionStats.totalSessions) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Bar Chart - 3 cols */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Trình duyệt</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Top 8 trình duyệt phổ biến nhất</p>
                </div>
                <span className="text-xs bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-full font-medium">
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
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
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
                    formatter={(value: number | string | readonly (number | string)[] | undefined) => [`${value} phiên`, "Số lượng"]}
                  />
                  <Bar dataKey="value" fill="url(#browserGradient)" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-4 pt-4 border-t border-border">
                {sessionBrowserData.map((item) => {
                  const pct = sessionStats.totalSessions > 0 ? (item.value / sessionStats.totalSessions) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground truncate" title={item.name}>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-semibold text-foreground tabular-nums">{item.value.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">{formatPercent(pct)}%</span>
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
