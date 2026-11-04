"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";

interface ReviewHeaderProps {
  onRetry?: () => void;
}

export default function ReviewHeader({ onRetry }: ReviewHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <button
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </button>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
          Xem lại bài làm
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Phân tích kết quả chi tiết và đề xuất hướng ôn tập phù hợp
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary cursor-pointer shadow-xs"
        >
          <RotateCcw className="h-4 w-4" />
          Làm lại bài
        </button>
        <Link
          href="/exercises"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover"
        >
          <BookOpen className="h-4 w-4" />
          Bài tập khác
        </Link>
      </div>
    </div>
  );
}
