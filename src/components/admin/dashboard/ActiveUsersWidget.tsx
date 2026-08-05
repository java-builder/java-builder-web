"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { activeUserService } from "@/services/active-user.service";
import { Card } from "@/components/ui/card";
import { RotateCw, ArrowUpRight, Radio } from "lucide-react";

export const ActiveUsersWidget = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["activeUsersDashboard"],
    queryFn: async () => {
      const response = await activeUserService.getActiveUsers(1, 8);
      return {
        users: response.data?.data || [],
        totalElements: response.data?.totalElements || 0,
      };
    },
    refetchInterval: 30000,
  });

  const users = data?.users || [];
  const totalOnline = data?.totalElements || users.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full flex flex-col justify-between border border-border/60 bg-card rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h3 className="text-sm font-bold text-foreground truncate tracking-tight">
              Thành viên trực tuyến
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              {totalOnline} online
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              title="Cập nhật"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing || isLoading ? "animate-spin text-emerald-500" : ""}`} />
            </button>
            <Link
              href="/admin/active-users"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Xem tất cả"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-medium pl-4.5">
          Danh sách người dùng đang hoạt động thực tế
        </p>
      </div>

      {/* Body List */}
      <div className="p-3 sm:p-4 flex-1">
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-muted/20 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-muted rounded w-2/5" />
                  <div className="h-2 bg-muted rounded w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-muted/40 mb-2">
              <Radio className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <p className="text-xs font-semibold text-foreground">Không có thành viên trực tuyến</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Dữ liệu sẽ tự cập nhật theo thời gian thực</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {users.slice(0, 6).map((user) => (
              <div
                key={user.userId}
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/60 transition-all duration-150"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    {user.avatar ? (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-border">
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          fill
                          sizes="32px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-xs">
                        {getInitials(user.username)}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-card" />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">
                  Đang hoạt động
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-muted/20 border-t border-border/40 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">Tự động cập nhật (30s)</span>
        <Link
          href="/admin/active-users"
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Chi tiết ({totalOnline})</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
};
