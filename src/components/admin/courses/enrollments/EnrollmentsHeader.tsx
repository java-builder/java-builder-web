"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EnrollmentsHeaderProps {
  title?: string;
  subtitle?: string;
  courseTitle?: string;
  backHref?: string;
}

export default function EnrollmentsHeader({
  title = "Học viên đã đăng ký",
  subtitle,
  courseTitle,
  backHref = "/admin/courses",
}: EnrollmentsHeaderProps) {
  const displaySubtitle = subtitle ?? (courseTitle ? `Khóa học: ${courseTitle}` : "Đang tải thông tin...");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border/40"
          title="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {displaySubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
