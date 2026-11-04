"use client";

import { useI18n } from "@/contexts/I18nContext";
import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import {
  ChevronRight,
  CheckCircle2,
  Video,
  FileText,
  Lock,
  Loader2,
  Layers,
} from "lucide-react";

interface CourseCurriculumProps {
  chapters: ChapterDetailResponse[];
  expandedChapters: Set<string>;
  chapterLessons: Record<string, LessonDetailResponse[]>;
  loadingLessons: Set<string>;
  isEnrolled: boolean;
  onToggleChapter: (chapterId: string) => void;
  onLessonClick: (lesson: LessonDetailResponse) => void;
}

export default function CourseCurriculum({
  chapters,
  expandedChapters,
  chapterLessons,
  loadingLessons,
  isEnrolled,
  onToggleChapter,
  onLessonClick,
}: CourseCurriculumProps) {
  const { t } = useI18n();

  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-border bg-background/40">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-3 text-text-muted">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">
          {t("courseDetail.emptyCurriculumTitle")}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted">
          {t("courseDetail.emptyCurriculumMessage")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
      {chapters.map((chapter, index) => {
        const isExpanded = expandedChapters.has(chapter.id);
        const lessons = chapterLessons[chapter.id] || [];
        const isLoading = loadingLessons.has(chapter.id);
        const completedInCh = lessons.filter((l) => l.completed).length;

        return (
          <div key={chapter.id} className="transition-colors">
            {/* Chapter Header */}
            <button
              type="button"
              onClick={() => onToggleChapter(chapter.id)}
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
                    {t("courseDetail.chapter")} {index + 1}
                  </span>
                  <span className="hidden sm:inline text-border">•</span>
                  <h3 className="text-sm sm:text-[15px] font-bold text-foreground truncate">
                    {chapter.chapterName}
                  </h3>
                </div>
              </div>

              {chapterLessons[chapter.id] && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs font-medium text-text-muted tabular-nums shrink-0">
                  {completedInCh > 0
                    ? `${completedInCh}/${lessons.length} ${t("courseDetail.lessonCount")}`
                    : `${lessons.length} ${t("courseDetail.lessonCount")}`}
                </span>
              )}
            </button>

            {/* Lessons List */}
            {isExpanded && (
              <div className="border-t border-border bg-surface">
                {chapter.description && (
                  <p className="text-xs sm:text-sm text-text-muted px-5 py-2.5 bg-background/30 border-b border-border">
                    {chapter.description}
                  </p>
                )}

                <div className="divide-y divide-border/60">
                  {isLoading ? (
                    <div className="px-5 py-6 text-center text-text-muted text-xs sm:text-sm flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : lessons.length > 0 ? (
                    lessons.map((lesson, lessonIndex) => {
                      const canWatch = isEnrolled || lesson.isFreePreview;
                      const cleanName = lesson.lessonName.replace(
                        /^\s*\d+[\.\)]\s*/,
                        ""
                      );

                      return (
                        <button
                          key={lesson.id}
                          id={`lesson-${lesson.id}`}
                          type="button"
                          onClick={() => onLessonClick(lesson)}
                          className={`w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 transition-colors group/lesson ${
                            canWatch
                              ? "hover:bg-muted/50 cursor-pointer"
                              : "bg-background/20 opacity-75 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                            ) : lesson.videoUrl ||
                              lesson.lessonFormat === "VIDEO" ? (
                              <Video
                                className={`w-4 h-4 shrink-0 ${
                                  canWatch
                                    ? "text-text-muted group-hover/lesson:text-primary"
                                    : "text-text-muted/60"
                                }`}
                              />
                            ) : (
                              <FileText
                                className={`w-4 h-4 shrink-0 ${
                                  canWatch
                                    ? "text-text-muted group-hover/lesson:text-primary"
                                    : "text-text-muted/60"
                                }`}
                              />
                            )}

                            <span
                              className={`text-[13.5px] truncate ${
                                canWatch
                                  ? "text-foreground/90 font-medium group-hover/lesson:text-primary"
                                  : "text-text-muted"
                              }`}
                            >
                              {lessonIndex + 1}. {cleanName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.isFreePreview && (
                              <span className="text-[10px] font-semibold text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded-full">
                                {t("courseDetail.freePreview")}
                              </span>
                            )}
                            {canWatch ? (
                              <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover/lesson:opacity-100 group-hover/lesson:text-primary transition-all" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-text-muted" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-6 text-center text-text-muted text-xs">
                      {t("courseDetail.noLessons")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
