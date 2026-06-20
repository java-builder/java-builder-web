"use client";

import { useAdminOverviewContext } from "@/contexts/AdminOverviewContext";
import { TransactionType } from "@/types/report";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const RecentActivities = () => {
  const { overview, loading } = useAdminOverviewContext();
  const activities = overview?.recentActivities || [];

  const getActivityIcon = (type: TransactionType) => {
    if (type === TransactionType.PAYIN) {
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold text-foreground">Hoạt động gần đây</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Các thanh toán thành công gần nhất</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 relative">
                  {activity.userAvatarUrl ? (
                    <div className="relative w-10 h-10">
                      <Image
                        src={activity.userAvatarUrl}
                        alt={activity.userName}
                        fill
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-accent-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {getActivityIcon(activity.transactionType)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent-600 rounded-full flex items-center justify-center relative">
                      <span className="text-sm font-medium text-white">
                        {getInitials(activity.userName)}
                      </span>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-accent-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {getActivityIcon(activity.transactionType)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium text-foreground">{activity.userName}</span> {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs font-medium text-accent dark:text-accent-on-dark">
                      {formatCurrency(activity.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
