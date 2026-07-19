"use client";

import { useAdminOverviewContext } from "@/contexts/AdminOverviewContext";
import { TransactionType } from "@/types/report";
import { formatCurrency } from "@/utils/formatters";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const COLUMN_HEADERS: { label: string; align?: "left" | "right"; className?: string }[] = [
  { label: "Khách hàng", align: "left", className: "w-[20%] min-w-[140px]" },
  { label: "Nội dung hoạt động", align: "left", className: "w-[50%]" },
  { label: "Số tiền", align: "right", className: "w-[10%] text-right min-w-[100px]" },
  { label: "Thời gian", align: "right", className: "w-[10%] text-right min-w-[100px]" },
  { label: "Trạng thái", align: "right", className: "w-[10%] text-right min-w-[100px]" },
];

export const RecentActivities = () => {
  const { overview, loading } = useAdminOverviewContext();
  const activities = overview?.recentActivities || [];

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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Hoạt động gần đây
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Các giao dịch thanh toán thành công gần nhất trên hệ thống
          </p>
        </div>
        {!loading && activities.length > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
            {activities.length} hoạt động
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="text-xs text-muted-foreground">Đang tải dữ liệu hoạt động...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-10 h-10 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xs text-muted-foreground">Chưa có giao dịch hoạt động nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMN_HEADERS.map((col) => (
                  <TableHead
                    key={col.label}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={index} className="group transition-colors">
                  {/* Customer */}
                  <TableCell className="px-4 py-3.5 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        {activity.userAvatarUrl ? (
                          <Image
                            src={activity.userAvatarUrl}
                            alt={activity.userName}
                            fill
                            sizes="32px"
                            className="rounded-full object-cover border border-border"
                            unoptimized
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                            {getInitials(activity.userName)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">
                        {activity.userName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Content */}
                  <TableCell className="px-4 py-3.5 align-middle max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium w-full">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold ring-1 ring-inset shrink-0 ${activity.transactionType === TransactionType.PAYIN
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950/20 dark:text-emerald-450 dark:ring-emerald-900/30"
                        : "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-950/20 dark:text-blue-450 dark:ring-blue-900/30"
                        }`}>
                        {activity.transactionType === TransactionType.PAYIN ? "Mua khóa học" : "Đăng ký gói"}
                      </span>
                      <span className="truncate text-foreground block flex-1">
                        {activity.description}
                      </span>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="px-4 py-3.5 align-middle text-right text-xs font-bold text-accent dark:text-accent-on-dark whitespace-nowrap">
                    {formatCurrency(activity.price)}
                  </TableCell>

                  {/* Time */}
                  <TableCell className="px-4 py-3.5 align-middle text-right text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {activity.timeAgo}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-900/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Thành công
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};
