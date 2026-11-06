"use client";

import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChallengesHeaderProps {
  totalCount: number;
  onCreate: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function ChallengesHeader({
  totalCount,
  onCreate,
  onRefresh,
  isRefreshing = false,
}: ChallengesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface border border-border p-6 rounded-2xl shadow-xs">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Quản lý Thử thách
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary-soft border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {totalCount.toLocaleString("vi-VN")} lộ trình
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Thiết lập lộ trình rèn luyện theo ngày, quản lý giai đoạn (Phase), bài học và danh sách học viên tham gia
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer rounded-full border-border"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        )}
        <Button
          type="button"
          onClick={onCreate}
          variant="accent"
          className="h-9 gap-1.5 px-4 text-xs sm:text-sm font-semibold rounded-full bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo thử thách mới</span>
        </Button>
      </div>
    </div>
  );
}
