"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagsHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function TagsHeader({ totalCount, onCreate }: TagsHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          Quản lý Tags
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tạo, xem và quản lý tags dùng cho bài viết và bộ câu hỏi
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          Tổng{" "}
          <span className="tabular-nums">
            {totalCount.toLocaleString("vi-VN")}
          </span>{" "}
          tag
        </span>
        <Button
          onClick={onCreate}
          variant="accent"
          className="gap-1.5 h-9"
        >
          <Plus className="h-4 w-4" />
          Tạo tag
        </Button>
      </div>
    </div>
  );
}
