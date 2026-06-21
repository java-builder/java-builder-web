"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useUserSubscriptions } from "@/hooks/useUserSubscriptions";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import type { SubscriptionPlan } from "@/types/subscription";
import type { SubscriptionStatsResponse } from "@/types/user-subscription";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Area,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AssignSubscriptionModal,
  SubscriptionFilters,
  SubscriptionMobileCard,
  SubscriptionTable,
} from "@/components/admin/user-subscriptions";

const PAGE_SIZE = 10;

export default function AdminUserSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [assignForm, setAssignForm] = useState({
    email: "",
    subscriptionPlanId: "",
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const [statsTimeRange, setStatsTimeRange] = useState("30days");
  const [stats, setStats] = useState<SubscriptionStatsResponse | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const timeRangeText = useMemo(() => {
    return statsTimeRange === '7days' ? '7 ngày qua' : statsTimeRange === '30days' ? '30 ngày qua' : statsTimeRange === '3months' ? '3 tháng qua' : statsTimeRange === '6months' ? '6 tháng qua' : '1 năm qua';
  }, [statsTimeRange]);

  const chartColors = useMemo(() => ({
    text: isDark ? "#9ca3af" : "#6b7280",
    grid: isDark ? "#374151" : "#e5e7eb",
  }), [isDark]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M VNĐ`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const response = await userSubscriptionService.getSubscriptionStats(statsTimeRange);
      if (response && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription stats", error);
    } finally {
      setIsStatsLoading(false);
    }
  }, [statsTimeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const conversionPieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Mới (Miễn phí)", value: stats.freeUsersCount, color: "#3b82f6" },
      { name: "Mới (Premium)", value: stats.premiumUsersCount, color: "#10b981" },
    ];
  }, [stats]);

  const CustomStatsTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey?: string | number; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const countData = payload.find((p) => p.dataKey === "count");
      const revenueData = payload.find((p) => p.dataKey === "revenue");
      return (
        <div className="bg-card px-4 py-3 shadow-xl rounded-xl border border-border text-foreground">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          {countData && (
            <p className="text-sm font-semibold text-emerald-500 mb-1">
              Đăng ký: {countData.value} lượt
            </p>
          )}
          {revenueData && (
            <p className="text-sm font-semibold text-blue-500">
              Doanh thu: {formatPrice(revenueData.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const {
    subscriptions,
    isLoading,
    totalPages,
    totalElements,
    refetch,
  } = useUserSubscriptions(page, PAGE_SIZE, status, search);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await subscriptionPlanService.getAllPlansAdmin();
        setPlans(response.data || []);
      } catch {
        toast.error("Không thể tải danh sách gói");
      }
    };
    fetchPlans();
  }, []);

  const hasActiveFilters = useMemo(
    () => Boolean(status || search),
    [status, search]
  );

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleAssign = async () => {
    if (!assignForm.email || !assignForm.subscriptionPlanId) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsAssigning(true);
      await userSubscriptionService.assignSubscription(
        assignForm.email,
        assignForm.subscriptionPlanId
      );
      toast.success("Gán gói thành công");
      setShowAssignModal(false);
      setAssignForm({ email: "", subscriptionPlanId: "" });
      refetch();
      fetchStats();
    } catch {
      toast.error("Gán gói thất bại");
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-border bg-card p-12">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-5 w-5 animate-spin text-accent"
              xmlns="http://www.w3.org/2000/svg"
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
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Quản lý Subscriptions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách người dùng đã đăng ký gói Premium
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Tổng{" "}
            <span className="tabular-nums">
              {totalElements.toLocaleString("vi-VN")}
            </span>{" "}
            subscription
          </span>
          <Button
            type="button"
            variant="accent"
            onClick={() => setShowAssignModal(true)}
            className="h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Gán gói
          </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-card to-card/60 rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Thống kê kinh doanh &amp; Doanh thu
            </h2>
            <p className="text-sm text-muted-foreground">
              Theo dõi hiệu quả doanh số Premium và tỷ lệ chuyển đổi học viên
            </p>
          </div>
          <select
            value={statsTimeRange}
            onChange={(e) => setStatsTimeRange(e.target.value)}
            className="px-3 py-1.5 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-background text-foreground self-start sm:self-auto"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="1year">1 năm qua</option>
          </select>
        </div>

        {isStatsLoading && !stats ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            <svg
              className="animate-spin h-5 w-5 text-accent mr-2"
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
            Đang tải dữ liệu thống kê...
          </div>
        ) : (
          stats && (
            <div className="mt-6 space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative bg-card rounded-xl p-5 border border-border/85 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <p className="text-sm font-medium text-muted-foreground">Doanh thu thực tế</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{formatPrice(stats.actualRevenue)}</p>
                  <p className="text-xs text-blue-500 mt-1 font-medium">
                    Doanh thu phát sinh trong {timeRangeText}
                  </p>
                </div>
 
                <div className="relative bg-card rounded-xl p-5 border border-border/85 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <p className="text-sm font-medium text-muted-foreground">Subscriptions đăng ký</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stats.totalSubscriptions.toLocaleString("vi-VN")}</p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium">
                    Lượt đăng ký trong {timeRangeText}
                  </p>
                </div>
 
                <div className="relative bg-card rounded-xl p-5 border border-border/85 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <p className="text-sm font-medium text-muted-foreground">Tỷ lệ chuyển đổi</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stats.conversionRate.toFixed(2)}%</p>
                  <p className="text-xs text-amber-500 mt-1 font-medium">
                    Tỷ lệ học viên nâng cấp Premium
                  </p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Trend Chart */}
                <div className="lg:col-span-2 bg-card rounded-xl p-5 border border-border/85">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                      Xu hướng đăng ký Premium &amp; Doanh thu
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-3.5">
                      Số lượng đăng ký và doanh thu tương ứng theo ngày/tháng
                    </p>
                  </div>
                  <div className="h-[280px]">
                    {stats.subscriptionChart.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={stats.subscriptionChart} margin={{ top: 10, right: -5, left: -20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="subRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} allowDecimals={false} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 11 }} tickFormatter={formatYAxis} />
                          <RechartsTooltip content={<CustomStatsTooltip />} />
                          <Bar yAxisId="left" dataKey="count" name="Đăng ký" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={25} />
                          <Area yAxisId="right" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={2} fill="url(#subRevenueGradient)" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Chưa có dữ liệu giao dịch trong khoảng thời gian này
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversion Pie Chart */}
                <div className="bg-card rounded-xl p-5 border border-border/80 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                      Chuyển đổi học viên mới
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-3.5">
                      Tỷ lệ học viên đăng ký mới nâng cấp Premium trong kỳ
                    </p>
                  </div>
                  <div className="relative h-[200px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conversionPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          {conversionPieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: unknown) => [typeof value === "number" ? `${value.toLocaleString("vi-VN")} người` : '0 người', '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-foreground">
                        {stats.conversionRate.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                        Tỷ lệ chuyển đổi
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2 border-t border-border/40 pt-3">
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded bg-blue-500" />
                        <span className="text-muted-foreground">Mới (Miễn phí)</span>
                      </div>
                      <p className="font-bold text-foreground">{stats.freeUsersCount.toLocaleString("vi-VN")}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 rounded bg-[#10b981]" />
                        <span className="text-muted-foreground">Mới (Premium)</span>
                      </div>
                      <p className="font-bold text-foreground">{stats.premiumUsersCount.toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center mt-3 bg-muted/40 p-2 rounded-lg border border-border/50 leading-relaxed">
                    Trong số <strong className="text-foreground">{(stats.freeUsersCount + stats.premiumUsersCount).toLocaleString("vi-VN")}</strong> học viên mới đăng ký trong {timeRangeText}, có <strong className="text-emerald-500 font-semibold">{stats.premiumUsersCount.toLocaleString("vi-VN")}</strong> học viên nâng cấp Premium (đạt <strong className="text-accent font-semibold">{stats.conversionRate.toFixed(2)}%</strong>).
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Filters */}
      <SubscriptionFilters
        searchInput={searchInput}
        status={status}
        hasActiveFilters={hasActiveFilters}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onClear={handleClearFilters}
      />

      {/* Mobile cards */}
      {subscriptions.length > 0 && (
        <div className="space-y-3 md:hidden">
          {subscriptions.map((sub) => (
            <SubscriptionMobileCard key={sub.id} subscription={sub} />
          ))}
        </div>
      )}

      {/* Mobile empty */}
      {subscriptions.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center md:hidden">
          <p className="text-sm font-medium text-foreground">
            Chưa có dữ liệu
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Không có subscription nào phù hợp với bộ lọc
          </p>
        </div>
      )}

      {/* Desktop table */}
      <SubscriptionTable subscriptions={subscriptions} />

      {/* Pagination */}
      {totalPages > 0 && subscriptions.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemName="subscription"
        />
      )}

      {/* Assign modal */}
      <AssignSubscriptionModal
        isOpen={showAssignModal}
        email={assignForm.email}
        subscriptionPlanId={assignForm.subscriptionPlanId}
        plans={plans}
        isAssigning={isAssigning}
        onEmailChange={(value) =>
          setAssignForm((prev) => ({ ...prev, email: value }))
        }
        onPlanChange={(value) =>
          setAssignForm((prev) => ({ ...prev, subscriptionPlanId: value }))
        }
        onSubmit={handleAssign}
        onClose={() => {
          if (!isAssigning) {
            setShowAssignModal(false);
            setAssignForm({ email: "", subscriptionPlanId: "" });
          }
        }}
      />
    </div>
  );
}
