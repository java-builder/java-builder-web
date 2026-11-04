"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CourseDetailResponse, LessonDetailResponse } from "@/types/course";
import { formatDate } from "@/utils/dateUtils";
import {
  GraduationCap,
  Layers,
  BookOpen,
  Calendar,
  ChevronRight,
  Video,
  FileText,
  Lock,
  CheckCircle2,
  UserPlus,
  ShoppingCart,
  ArrowRight,
  Crown,
  Heart,
} from "lucide-react";

interface CourseOverviewProps {
  course: CourseDetailResponse;
  chapterLessons?: Record<string, LessonDetailResponse[]>;
  onLessonClick?: (lessonId: string) => void;
  onEnrollClick?: () => void;
  selectedLessonId?: string | null;
  isFavorite?: boolean;
  favoriteLoading?: boolean;
  onToggleFavorite?: () => void;
}

export default function CourseOverview({
  course,
  chapterLessons,
  onLessonClick,
  onEnrollClick,
  selectedLessonId,
  isFavorite = false,
  favoriteLoading = false,
  onToggleFavorite,
}: CourseOverviewProps) {
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >(() => {
    const firstId = course.chapters?.[0]?.id;
    return firstId ? { [firstId]: true } : {};
  });

  useEffect(() => {
    if (selectedLessonId && course.chapters) {
      const activeChapter = course.chapters.find((ch) => {
        const lessons = chapterLessons?.[ch.id] || ch.lessons || [];
        return lessons.some((l) => l.id === selectedLessonId);
      });
      if (activeChapter) {
        setExpandedChapters((prev) => ({
          ...prev,
          [activeChapter.id]: true,
        }));
      }
    }
  }, [selectedLessonId, course.chapters, chapterLessons]);

  const levelText: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
    EXPERT: "Chuyên gia",
  };

  const levelDisplay = course.level
    ? levelText[course.level] || course.level
    : "Cơ bản";

  const totalLessons = (course.chapters || []).reduce((acc, ch) => {
    const lessons = chapterLessons?.[ch.id] || ch.lessons || [];
    return acc + lessons.length;
  }, 0);

  const formattedPrice =
    course.price != null && course.price > 0
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(course.price)
      : "Miễn phí";

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const expandAll = () => {
    const allOpen = course.chapters?.every((ch) => expandedChapters[ch.id]);
    const next: Record<string, boolean> = {};
    for (const ch of course.chapters || []) {
      next[ch.id] = !allOpen;
    }
    setExpandedChapters(next);
  };

  const isFree = !course.price || course.price === 0;

  return (
    <div className="space-y-8">
      {/* Unified Hero Overview Card */}
      <div className="rounded-2xl border border-border bg-background/60 p-6 sm:p-7">
        {/* Top Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-text-muted">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-soft text-primary font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              {levelDisplay}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground/80">
              <Layers className="w-3.5 h-3.5 text-primary" />
              {course.chapters?.length || 0} chương
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-foreground/80">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              {totalLessons} bài học
            </span>
            {(course.updatedAt || course.createdAt) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                Cập nhật {formatDate(course.updatedAt || course.createdAt)}
              </span>
            )}
          </div>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              disabled={favoriteLoading}
              className={`inline-flex items-center gap-1.5 h-8.5 px-3.5 text-xs font-semibold rounded-full border transition-all cursor-pointer shrink-0 active:scale-95 ${
                isFavorite
                  ? "bg-error/10 border-error/25 text-error hover:bg-error/15"
                  : "bg-surface border-border text-foreground hover:text-primary"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite ? "fill-error text-error" : ""
                }`}
              />
              <span>{isFavorite ? "Đã lưu" : "Lưu khóa học"}</span>
            </button>
          )}
        </div>

        {/* Course Title & Description */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug">
          {course.title}
        </h1>
        {course.description && (
          <p className="text-sm sm:text-[15px] text-text-muted leading-relaxed mt-2.5 max-w-4xl">
            {course.description}
          </p>
        )}

        {/* Bottom Enrollment Bar (only when not enrolled) */}
        {!course.isEnrolled && (
          <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Đăng ký để mở khóa toàn bộ nội dung
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Trọn bộ {course.chapters?.length || 0} chương • {totalLessons} bài học & trợ giảng AI
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {isFree ? (
                <button
                  type="button"
                  onClick={() => onEnrollClick?.()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs active:scale-95 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tham gia miễn phí</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onEnrollClick?.()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Mua khóa học • {formattedPrice}</span>
                  </button>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-warning transition hover:opacity-90"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Gói Premium</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Curriculum List */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Nội dung khóa học
            </h2>
            <span className="text-xs font-medium text-text-muted">
              ({course.chapters?.length || 0} chương • {totalLessons} bài)
            </span>
          </div>
          {course.chapters && course.chapters.length > 1 && (
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {course.chapters.every((ch) => expandedChapters[ch.id])
                ? "Thu gọn tất cả"
                : "Mở rộng tất cả"}
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
          {course.chapters?.map((chapter, index) => {
            const isExpanded = !!expandedChapters[chapter.id];
            const lessons =
              chapterLessons?.[chapter.id] || chapter.lessons || [];
            const lessonsCount = lessons.length;
            const completedInCh = lessons.filter((l) => l.completed).length;

            return (
              <div key={chapter.id} className="transition-colors">
                {/* Chapter Header */}
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.id)}
                  className={`w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isExpanded
                      ? "bg-background/80 hover:bg-muted/60"
                      : "bg-background/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <ChevronRight
                      className={`w-4 h-4 text-text-muted transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-90 text-primary" : ""
                      }`}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted shrink-0">
                        Chương {index + 1}
                      </span>
                      <span className="hidden sm:inline text-border">•</span>
                      <h3 className="text-sm sm:text-[15px] font-bold text-foreground truncate">
                        {chapter.chapterName}
                      </h3>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs font-medium text-text-muted tabular-nums shrink-0">
                    {completedInCh > 0
                      ? `${completedInCh}/${lessonsCount} bài`
                      : `${lessonsCount} bài`}
                  </span>
                </button>

                {/* Chapter Lessons */}
                {isExpanded && (
                  <div className="border-t border-border divide-y divide-border/60 bg-surface">
                    {lessonsCount > 0 ? (
                      lessons.map((lesson, lessonIdx) => {
                        const isSelected = selectedLessonId === lesson.id;
                        const isLocked = lesson.canAccess === false;
                        const cleanName = lesson.lessonName.replace(
                          /^\s*\d+[\.\)]\s*/,
                          ""
                        );

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() =>
                              (!isLocked || lesson.isFreePreview) &&
                              onLessonClick?.(lesson.id)
                            }
                            disabled={isLocked && !lesson.isFreePreview}
                            className={`w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 transition-colors group/lesson ${
                              isSelected
                                ? "bg-primary-soft text-primary"
                                : "hover:bg-muted/50"
                            } ${
                              isLocked && !lesson.isFreePreview
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {lesson.completed ? (
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 ${
                                    isSelected ? "text-primary" : "text-success"
                                  }`}
                                />
                              ) : lesson.lessonFormat === "VIDEO" ? (
                                <Video
                                  className={`w-4 h-4 shrink-0 ${
                                    isSelected
                                      ? "text-primary"
                                      : "text-text-muted group-hover/lesson:text-primary"
                                  }`}
                                />
                              ) : (
                                <FileText
                                  className={`w-4 h-4 shrink-0 ${
                                    isSelected
                                      ? "text-primary"
                                      : "text-text-muted group-hover/lesson:text-primary"
                                  }`}
                                />
                              )}

                              <span
                                className={`text-[13.5px] truncate ${
                                  isSelected
                                    ? "text-primary font-semibold"
                                    : "text-foreground/90 font-medium group-hover/lesson:text-primary"
                                }`}
                              >
                                {lessonIdx + 1}. {cleanName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isFreePreview && (
                                <span className="text-[10px] font-semibold text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded-full">
                                  Học thử
                                </span>
                              )}
                              {isLocked && !lesson.isFreePreview ? (
                                <Lock className="w-3.5 h-3.5 text-text-muted" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover/lesson:opacity-100 group-hover/lesson:text-primary transition-all" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-text-muted">
                        Nội dung chương đang được cập nhật
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
