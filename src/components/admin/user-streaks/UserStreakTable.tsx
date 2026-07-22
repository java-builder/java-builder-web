"use client";

import Image from "next/image";
import { AdminUserStreak, StreakStatus } from "@/types/user-streak";
import { Button } from "@/components/ui/button";
import { UserStreakMobileCard } from "./UserStreakMobileCard";
import {
  Flame,
  Trophy,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
} from "lucide-react";

interface UserStreakTableProps {
  streaks: AdminUserStreak[];
  isLoading: boolean;
  onSendReminder: (user: AdminUserStreak) => void;
}

export const UserStreakTable = ({
  streaks,
  isLoading,
  onSendReminder,
}: UserStreakTableProps) => {
  const renderStatusBadge = (status: StreakStatus) => {
    switch (status) {
      case "ACTIVE_TODAY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Đã duy trì hôm nay
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Sắp đứt chuỗi
          </span>
        );
      case "BROKEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Đã mất chuỗi
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Mobile Loading Skeleton */}
        <div className="block md:hidden space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card border border-border rounded-xl" />
          ))}
        </div>
        {/* Desktop Loading Skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm p-6 space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (streaks.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center">
          <Flame className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-foreground">Không tìm thấy dữ liệu Streak</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Không có người dùng nào trùng khớp với thông tin tìm kiếm hoặc bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Grid (Visible on mobile screens) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {streaks.map((user) => (
          <UserStreakMobileCard
            key={user.userId}
            user={user}
            onSendReminder={onSendReminder}
          />
        ))}
      </div>

      {/* Desktop Table (Visible on md+ screens) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
            <tr>
              <th className="px-5 py-3.5 whitespace-nowrap">Người dùng</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Streak hiện tại</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Kỷ lục streak</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Hoạt động gần nhất</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Trạng thái</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {streaks.map((user) => (
              <tr key={user.userId} className="hover:bg-muted/20 transition-colors">
                {/* User info */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="relative w-9 h-9 rounded-full bg-muted overflow-hidden border border-border shrink-0">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username || "User"}
                          width={36}
                          height={36}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-600 font-bold text-xs">
                          {(user.username || user.userId).charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-[160px]">
                        {user.username || "User ID: " + user.userId}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                        {user.email || user.userId}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Current Streak */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    {user.currentStreak} ngày
                  </span>
                </td>

                {/* Longest Streak */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span>{user.longestStreak} ngày</span>
                  </div>
                </td>

                {/* Last Activity */}
                <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    <span>{user.lastActivityDate || "Chưa có"}</span>
                  </div>
                </td>

                {/* Status badge */}
                <td className="px-5 py-3.5 whitespace-nowrap">{renderStatusBadge(user.status)}</td>

                {/* Actions */}
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendReminder(user)}
                    title="Gửi nhắc nhở giữ chuỗi"
                    className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10 hover:text-amber-600"
                  >
                    <Bell className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
