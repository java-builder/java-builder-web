"use client";

import Link from "next/link";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import { CourseDetailResponse } from "@/types/course";
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Menu,
  CheckCircle2,
} from "lucide-react";

interface DocsHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  course?: CourseDetailResponse | null;
  onOverviewClick?: () => void;
  showOverview?: boolean;
  isFavorite?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: () => void;
  completedCount?: number;
  totalCount?: number;
  canAccessLesson?: boolean;
  onOpenAi?: () => void;
  onOpenNotes?: () => void;
}

export default function DocsHeader({
  onMenuClick,
  showMenuButton = false,
  course,
  onOverviewClick,
  isFavorite = false,
  favoriteLoading = false,
  onToggleFavorite,
  completedCount = 0,
  totalCount = 0,
}: DocsHeaderProps) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 h-15 bg-surface/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Mobile menu + Back to courses + Course title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-text-muted hover:text-primary hover:bg-primary-soft rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Mở danh mục bài học"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-full text-xs font-semibold text-text-muted hover:text-primary hover:bg-primary-soft border border-border transition-all shrink-0"
            title="Quay lại danh sách khóa học"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khóa học</span>
          </Link>

          {course && (
            <>
              <div className="h-4 w-px bg-border shrink-0 hidden sm:block" />
              <button
                type="button"
                onClick={onOverviewClick}
                className="flex items-center gap-2 min-w-0 text-left group cursor-pointer"
                title="Xem tổng quan khóa học"
              >
                <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {course.title}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Right: Progress badge, Favorite & Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {course && totalCount > 0 && (
            <div
              className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-full bg-background border border-border text-xs font-medium text-text-muted"
              title={`Đã hoàn thành ${completedCount}/${totalCount} bài học (${progressPercent}%)`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              <span className="tabular-nums font-semibold text-foreground">
                {completedCount}/{totalCount}
              </span>
              <span className="text-[11px] text-text-muted hidden xl:inline">
                ({progressPercent}%)
              </span>
            </div>
          )}

          {course && onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              disabled={favoriteLoading}
              title={isFavorite ? "Bỏ yêu thích" : "Yêu thích khóa học"}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isFavorite
                  ? "bg-error/10 border-error/25 text-error"
                  : "bg-background border-border text-text-muted hover:text-primary"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite ? "fill-current text-error" : ""
                }`}
              />
              <span className="hidden xl:inline">
                {isFavorite ? "Đã lưu" : "Yêu thích"}
              </span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
