"use client";

import { Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChallengesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function ChallengesHeader({
  totalCount,
  onCreate,
}: ChallengesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
          <Flame className="h-6 w-6 text-accent" />
          <span>Quản lý Thử thách Lập trình</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thiết lập lộ trình thử thách thực chiến, phân chặng kiến thức và nhiệm vụ rèn luyện hàng ngày
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-semibold text-accent">
          {totalCount.toLocaleString("vi-VN")} Thử thách
        </span>
        <Button
          onClick={onCreate}
          variant="accent"
          className="gap-1.5 h-9 font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo thử thách mới</span>
        </Button>
      </div>
    </div>
  );
}
