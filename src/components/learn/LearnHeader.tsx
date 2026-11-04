"use client";

import Link from "next/link";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";

interface LearnHeaderProps {
  courseSlug?: string;
  chapterName?: string;
  lessonName?: string;
  canPrev: boolean;
  canNext: boolean;
  completedCount?: number;
  totalLessons?: number;
  onToggleSidebar: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LearnHeader({
  courseSlug,
  chapterName,
  canPrev,
  canNext,
  completedCount = 0,
  totalLessons = 0,
  onToggleSidebar,
  onPrev,
  onNext,
}: LearnHeaderProps) {
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="relative h-15 bg-surface/95 backdrop-blur-md border-b border-border flex items-center px-4 sm:px-6 justify-between gap-3 shrink-0 transition-colors z-30">
      {/* Left: Sidebar Toggle + Back Link + Chapter Name */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Đóng/Mở danh mục bài học"
          className="flex items-center justify-center w-9 h-9 text-text-muted hover:text-primary hover:bg-primary-soft rounded-full transition-colors cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          <PanelLeft className="w-4.5 h-4.5" />
        </button>

        <Link
          href={courseSlug ? `/courses/${courseSlug}` : "/my-courses"}
          className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-full text-xs font-semibold text-text-muted hover:text-primary hover:bg-primary-soft border border-border transition-all shrink-0"
          title="Quay lại khóa học"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Khóa học</span>
        </Link>

        {chapterName && (
          <>
            <div className="h-4 w-px bg-border shrink-0 hidden sm:block" />
            <h1
              className="text-sm font-bold text-foreground truncate leading-tight pr-2"
              title={chapterName}
            >
              {chapterName}
            </h1>
          </>
        )}
      </div>

      {/* Right Controls Group */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Progress Pill */}
        {totalLessons > 0 && (
          <div
            className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-full bg-background border border-border text-xs font-medium text-text-muted"
            title={`Đã hoàn thành ${completedCount}/${totalLessons} bài học (${percent}%)`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
            <span className="tabular-nums font-semibold text-foreground">
              {completedCount}/{totalLessons}
            </span>
            <span className="text-[11px] text-text-muted hidden xl:inline">
              ({percent}%)
            </span>
          </div>
        )}

        {/* Prev / Next Navigation Buttons */}
        <div className="flex items-center bg-background border border-border rounded-full p-0.5 gap-0.5">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            title="Bài học trước"
            className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-semibold text-text-muted hover:text-primary hover:bg-primary-soft rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted cursor-pointer"
            aria-label="Previous lesson"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Bài trước</span>
          </button>
          <div className="h-3.5 w-px bg-border" />
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            title="Bài học tiếp theo"
            className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-semibold text-text-muted hover:text-primary hover:bg-primary-soft rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted cursor-pointer"
            aria-label="Next lesson"
          >
            <span className="hidden lg:inline">Bài tiếp</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ThemeToggle />
      </div>

      {/* Bottom Thin Primary Progress Bar */}
      {totalLessons > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-r-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
}
