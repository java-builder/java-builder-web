"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EnrollmentsHeaderProps {
  courseTitle?: string;
  backHref?: string;
}

export default function EnrollmentsHeader({
  courseTitle,
  backHref = "/admin/courses",
}: EnrollmentsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border/40"
          title="Quay lại danh sách khóa học"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Học viên đã đăng ký
          </h1>
          <p className="text-sm text-muted-foreground">
            {courseTitle ? `Khóa học: ${courseTitle}` : "Đang tải thông tin khóa học..."}
          </p>
        </div>
      </div>
    </div>
  );
}
