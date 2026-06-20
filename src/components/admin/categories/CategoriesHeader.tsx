"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function CategoriesHeader({
  totalCount,
  onCreate,
}: CategoriesHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          Quản lý danh mục
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tạo, sắp xếp và quản lý danh mục cho bài viết và blog
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          Tổng{" "}
          <span className="tabular-nums">
            {totalCount.toLocaleString("vi-VN")}
          </span>{" "}
          danh mục
        </span>
        <Button
          onClick={onCreate}
          variant="accent"
          className="gap-1.5 h-9"
        >
          <Plus className="h-4 w-4" />
          Tạo danh mục
        </Button>
      </div>
    </div>
  );
}
