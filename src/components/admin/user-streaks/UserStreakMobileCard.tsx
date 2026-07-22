"use client";

import Image from "next/image";
import { AdminUserStreak, StreakStatus } from "@/types/user-streak";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Trophy,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
} from "lucide-react";

interface UserStreakMobileCardProps {
  user: AdminUserStreak;
  onSendReminder: (user: AdminUserStreak) => void;
}

export const UserStreakMobileCard = ({
  user,
  onSendReminder,
}: UserStreakMobileCardProps) => {
  const renderStatusBadge = (status: StreakStatus) => {
    switch (status) {
      case "ACTIVE_TODAY":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Đã duy trì hôm nay
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Sắp đứt chuỗi
          </span>
        );
      case "BROKEN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <XCircle className="w-3 h-3" />
            Đã mất chuỗi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      {/* Top: User info + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full bg-muted overflow-hidden border border-border shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username || "User"}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-500/10 text-orange-600 font-bold text-sm">
                {(user.username || user.userId).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-xs text-foreground truncate">
              {user.username || "User ID: " + user.userId}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email || user.userId}
            </p>
          </div>
        </div>
        {renderStatusBadge(user.status)}
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
        <div className="bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
          <span className="text-[11px] text-muted-foreground block mb-0.5">Streak hiện tại</span>
          <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            {user.currentStreak} ngày
          </span>
        </div>

        <div className="bg-muted/40 p-2 rounded-lg border border-border/50">
          <span className="text-[11px] text-muted-foreground block mb-0.5">Kỷ lục streak</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            {user.longestStreak} ngày
          </span>
        </div>
      </div>

      {/* Footer: Last active date & action */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span>Hoạt động: {user.lastActivityDate || "Chưa có"}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSendReminder(user)}
          className="h-8 gap-1.5 text-xs rounded-lg border-amber-500/30 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
        >
          <Bell className="w-3.5 h-3.5" />
          Gửi nhắc nhở
        </Button>
      </div>
    </div>
  );
};
