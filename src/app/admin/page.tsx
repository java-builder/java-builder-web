"use client";

import { AdminOverviewProvider, useAdminOverviewContext } from "@/contexts/AdminOverviewContext";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { ActiveUsersWidget } from "@/components/admin/dashboard/ActiveUsersWidget";
import { useI18n } from "@/contexts/I18nContext";

function AdminDashboardContent() {
  const { t } = useI18n();
  const { overview, loading } = useAdminOverviewContext();

  const stats = [
    {
      name: t("admin.dashboard.totalUsers"),
      value: loading ? "..." : formatNumber(overview?.totalUsers || 0),
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      name: t("admin.dashboard.newUsersToday"),
      value: loading ? "..." : formatNumber(overview?.totalUsersNewToday || 0),
      badge: !loading && overview?.totalUsersNewToday ? t("admin.dashboard.badgeNew") : undefined,
      badgeColor: "emerald" as const,
      icon: (
        <svg className="w-full h-full text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      name: t("admin.dashboard.activeCourses"),
      value: loading ? "..." : formatNumber(overview?.totalCourses || 0),
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: t("admin.dashboard.monthlyRevenue"),
      value: loading ? "..." : formatCurrency(overview?.monthlyRevenue || 0),
      icon: (
        <div className="w-full h-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 border-current rounded-full select-none leading-none">
          ₫
        </div>
      ),
    },
    {
      name: t("admin.dashboard.newEnrollments"),
      value: loading ? "..." : formatNumber(overview?.newEnrollments || 0),
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t("admin.dashboard.welcome")}</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">{t("admin.dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="order-2 xl:order-1 xl:col-span-2">
          <RecentActivities />
        </div>
        <div className="order-1 xl:order-2 xl:col-span-1">
          <ActiveUsersWidget />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminOverviewProvider>
      <AdminDashboardContent />
    </AdminOverviewProvider>
  );
}
