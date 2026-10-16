"use client";

import { AdminOverviewProvider, useAdminOverviewContext } from "@/contexts/AdminOverviewContext";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentActivities } from "@/components/admin/dashboard/RecentActivities";
import { ActiveUsersWidget } from "@/components/admin/dashboard/ActiveUsersWidget";
import { useI18n } from "@/contexts/I18nContext";

import { Users, UserPlus, BookOpen, GraduationCap } from "lucide-react";

function AdminDashboardContent() {
  const { t } = useI18n();
  const { overview, loading } = useAdminOverviewContext();

  const stats = [
    {
      name: t("admin.dashboard.totalUsers"),
      value: loading ? "..." : formatNumber(overview?.totalUsers || 0),
      icon: <Users className="w-full h-full" />,
    },
    {
      name: t("admin.dashboard.newUsersToday"),
      value: loading ? "..." : formatNumber(overview?.totalUsersNewToday || 0),
      badge: !loading && overview?.totalUsersNewToday ? t("admin.dashboard.badgeNew") : undefined,
      badgeColor: "emerald" as const,
      icon: <UserPlus className="w-full h-full text-emerald-600" />,
    },
    {
      name: t("admin.dashboard.activeCourses"),
      value: loading ? "..." : formatNumber(overview?.totalCourses || 0),
      icon: <BookOpen className="w-full h-full" />,
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
      icon: <GraduationCap className="w-full h-full" />,
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
