"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReviewLoadingState() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12 shadow-xs">
          <div className="flex items-center justify-center space-x-2.5">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Đang tải chi tiết bài làm...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewNotFoundState() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12 shadow-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft border border-primary/15 text-primary">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">
            Không tìm thấy bài làm
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Bài làm không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
