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
    <div>
      <Link
        href={backHref}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách khoá học
      </Link>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        Học viên đã đăng ký
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {courseTitle
          ? `Khoá học: ${courseTitle}`
          : "Đang tải thông tin khoá học..."}
      </p>
    </div>
  );
}
