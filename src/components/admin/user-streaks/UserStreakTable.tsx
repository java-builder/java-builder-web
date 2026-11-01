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
  RotateCcw,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useResizableColumns, ResizableColumn } from "@/hooks/useResizableColumns";

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
  const { t } = useI18n();

  const columns: ResizableColumn[] = [
    { id: "user", label: t("admin.userStreaks.colUser"), defaultWidth: 240, minWidth: 170 },
    { id: "currentStreak", label: t("admin.userStreaks.colCurrentStreak"), defaultWidth: 160, minWidth: 120 },
    { id: "longestStreak", label: t("admin.userStreaks.colLongestStreak"), defaultWidth: 150, minWidth: 120 },
    { id: "lastActivity", label: t("admin.userStreaks.colLastActivity"), defaultWidth: 160, minWidth: 130 },
    { id: "status", label: t("admin.userStreaks.colStatus"), defaultWidth: 160, minWidth: 130 },
    { id: "actions", label: t("admin.userStreaks.colActions"), align: "right", defaultWidth: 100, minWidth: 80 },
  ];

  const {
    columnWidths,
    resizingColId,
    handleMouseDown,
    handleDoubleClick,
    resetAllWidths,
    isCustomized,
    totalTableWidth,
  } = useResizableColumns({
    storageKey: "admin_user_streaks_table_column_widths_v1",
    columns,
  });

  const renderStatusBadge = (status: StreakStatus) => {
    switch (status) {
      case "ACTIVE_TODAY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {t("admin.userStreaks.statActiveStreaks")}
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {t("admin.userStreaks.statAtRisk")}
          </span>
        );
      case "BROKEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            {t("admin.userStreaks.colStatus")}
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
        <p className="text-sm font-medium text-foreground">{t("admin.common.noData")}</p>
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
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {isCustomized && (
          <div className="flex justify-end border-b border-border px-5 py-2.5 bg-muted/20">
            <button
              type="button"
              onClick={resetAllWidths}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md border border-dashed border-border hover:bg-muted/60 transition-colors cursor-pointer"
              title="Đặt lại độ rộng các cột về mặc định"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại cột</span>
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs border-collapse"
            style={{
              tableLayout: "fixed",
              minWidth: `${totalTableWidth}px`,
              width: "100%",
            }}
          >
            <colgroup>
              {columns.map((col) => (
                <col
                  key={col.id}
                  style={{ width: `${columnWidths[col.id] || col.defaultWidth}px` }}
                />
              ))}
            </colgroup>
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{ width: `${columnWidths[col.id] || col.defaultWidth}px` }}
                    className={`relative px-5 py-3.5 select-none overflow-visible ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="truncate pr-2">{col.label}</div>

                    {/* Resizer Handle */}
                    <div
                      onMouseDown={(e) => handleMouseDown(col.id, e)}
                      onDoubleClick={() => handleDoubleClick(col.id)}
                      title="Kéo sang trái/phải để chỉnh độ rộng cột, nhấp đúp để đặt lại"
                      className={`absolute top-0 right-0 bottom-0 w-2.5 cursor-col-resize select-none touch-none z-10 flex items-center justify-center group/resizer hover:bg-accent/15 ${
                        resizingColId === col.id ? "bg-accent/20" : ""
                      }`}
                    >
                      <div
                        className={`h-4 w-[1px] transition-all duration-150 ${
                          resizingColId === col.id
                            ? "h-full bg-accent w-[2px]"
                            : "bg-border group-hover/resizer:h-full group-hover/resizer:bg-accent group-hover/resizer:w-[2px]"
                        }`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {streaks.map((user) => (
                <tr key={user.userId} className="hover:bg-muted/20 transition-colors">
                  {/* User info */}
                  <td className="px-5 py-3.5 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
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
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate" title={user.username || user.userId}>
                          {user.username || "User ID: " + user.userId}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate" title={user.email || user.userId}>
                          {user.email || user.userId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Current Streak */}
                  <td className="px-5 py-3.5 whitespace-nowrap overflow-hidden">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                      {user.currentStreak}
                    </span>
                  </td>

                  {/* Longest Streak */}
                  <td className="px-5 py-3.5 whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                      <span>{user.longestStreak}</span>
                    </div>
                  </td>

                  {/* Last Activity */}
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap overflow-hidden truncate">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      <span>{user.lastActivityDate || "-"}</span>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap overflow-hidden">{renderStatusBadge(user.status)}</td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSendReminder(user)}
                      title={t("admin.userStreaks.sendReminderBtn")}
                      className="h-8 w-8 p-0 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 cursor-pointer"
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
    </div>
  );
};
