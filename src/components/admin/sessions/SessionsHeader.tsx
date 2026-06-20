"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface SessionsHeaderProps {
  totalCount: number;
}

export const SessionsHeader = ({ totalCount }: SessionsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Quản lý phiên đăng nhập
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Theo dõi các phiên truy cập đang hoạt động và thu hồi phiên khi cần
        </p>
      </div>
      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:text-accent-on-dark">
            Tổng{" "}
            <span className="font-bold tabular-nums">
              {totalCount.toLocaleString("vi-VN")}
            </span>{" "}
            phiên
          </span>
        )}
        <Link
          href="/admin/reports#session-analytics"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <BarChart3 className="h-4 w-4 mr-1.5" />
          Xem thống kê
        </Link>
      </div>
    </div>
  );
};
