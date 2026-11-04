"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";
import {
  GraduationCap,
  Clock,
  Calendar,
  BookOpen,
  FileText,
  ArrowRight,
} from "lucide-react";

interface CourseHeaderProps {
  course: CourseDetailResponse;
  formatDate: (dateString: string) => string;
  getLevelText: (level: CourseLevel) => string;
}

export default function CourseHeader({
  course,
  formatDate,
  getLevelText,
}: CourseHeaderProps) {
  return (
    <>
      {/* Course Cover */}
      <div className="relative aspect-video overflow-hidden bg-background border-b border-border">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            priority
            className={
              course.courseFormat === CourseFormat.TEXT
                ? "object-contain bg-background"
                : "object-cover bg-background"
            }
          />
        ) : (
          <div className="w-full h-full bg-background flex items-center justify-center">
            <div className="text-center text-text-muted">
              <BookOpen className="w-14 h-14 mx-auto mb-3 text-primary/60" />
              <p className="text-sm font-semibold">Khóa học</p>
            </div>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6 pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs font-medium">
          {course.level && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              {getLevelText(course.level)}
            </span>
          )}
          {course.courseFormat !== CourseFormat.TEXT &&
            course.duration &&
            course.duration > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-text-muted font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {course.duration} giờ
              </span>
            )}
          {course.createdAt && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-text-muted font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(course.createdAt)}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug mb-2">
          {course.title}
        </h1>

        {course.courseFormat === CourseFormat.TEXT && (
          <div className="mt-4 p-4 sm:p-5 bg-background/60 border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-foreground mb-1">
                  Khóa học dạng Tài liệu (Document)
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Biên soạn dưới dạng tài liệu kỹ thuật chi tiết kèm mã nguồn mẫu và trợ giảng AI hỗ trợ trực tiếp trong từng bài học.
                </p>
              </div>
            </div>

            <Link
              href={`/docs/${course.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all active:scale-95 shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem tài liệu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
