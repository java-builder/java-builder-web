"use client";

import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import { Plus, ChevronRight, Edit, Trash2, Loader2, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseContentTabProps {
  chapters: ChapterDetailResponse[];
  expandedChapters: Set<string>;
  chapterLessons: Record<string, LessonDetailResponse[]>;
  loadingLessons: Set<string>;
  onToggleChapter: (chapterId: string) => void;
  onAddChapter: () => void;
  onEditChapter: (chapter: ChapterDetailResponse) => void;
  onDeleteChapter: (chapterId: string, chapterName: string) => void;
  onAddLesson: (chapterId: string) => void;
  onEditLesson: (lesson: LessonDetailResponse, chapterId: string) => void;
  onPreviewLesson: (lesson: LessonDetailResponse) => void;
  onDeleteLesson: (lessonId: string, lessonName: string, chapterId: string) => void;
}

export default function CourseContentTab({
  chapters,
  expandedChapters,
  chapterLessons,
  loadingLessons,
  onToggleChapter,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onPreviewLesson,
  onDeleteLesson,
}: CourseContentTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-foreground">Danh sách chương ({chapters.length})</h3>
        <Button
          variant="accent"
          onClick={onAddChapter}
          className="gap-2 font-medium"
        >
          <Plus className="w-4.5 h-4.5" />
          Thêm chương
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl bg-card">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
          <p className="font-semibold text-foreground">Chưa có chương nào</p>
          <p className="text-sm">Nhấn &quot;Thêm chương&quot; để thiết lập bài giảng khóa học</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="border border-border rounded-xl overflow-hidden bg-card">
              <div
                className="flex items-center justify-between px-4 py-3.5 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => onToggleChapter(chapter.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                  />
                  <span className="text-xs font-bold text-accent dark:text-accent-on-dark uppercase tracking-wider whitespace-nowrap bg-accent/10 px-2 py-0.5 rounded">
                    Chương {index + 1}
                  </span>
                  <span className="font-semibold text-foreground truncate" title={chapter.chapterName}>
                    {chapter.chapterName}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ({chapterLessons[chapter.id]?.length || 0} bài học)
                  </span>
                </div>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onAddLesson(chapter.id)}
                    className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors border border-border/40"
                    title="Thêm bài học"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditChapter(chapter)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40"
                    title="Sửa chương"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteChapter(chapter.id, chapter.chapterName)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40"
                    title="Xóa chương"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expandedChapters.has(chapter.id) && (
                <div className="border-t border-border">
                  {chapter.description && (
                    <p className="text-sm text-muted-foreground px-5 py-3 bg-muted/10 border-b border-border/60">
                      {chapter.description}
                    </p>
                  )}
                  {/* Lessons list */}
                  <div className="divide-y divide-border/60">
                    {loadingLessons.has(chapter.id) ? (
                      <div className="px-4 py-6 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4 text-accent" />
                        Đang tải...
                      </div>
                    ) : chapterLessons[chapter.id] && chapterLessons[chapter.id].length > 0 ? (
                      chapterLessons[chapter.id].map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                           className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-all duration-200 group"
                        >
                          <div 
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                            onClick={() => onPreviewLesson(lesson)}
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200 flex-shrink-0">
                              {lessonIndex + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                                  {lesson.lessonName}
                                </span>
                                {lesson.isFreePreview && (
                                  <span className="px-1.5 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded font-semibold whitespace-nowrap">
                                    Miễn phí
                                  </span>
                                )}
                                {lesson.videoUrl && (
                                  <Play className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                              {lesson.videoUrl && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Play className="w-3 h-3 text-muted-foreground/80" />
                                  Có bài giảng video
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditLesson(lesson, chapter.id);
                              }}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40"
                              title="Sửa bài học"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLesson(lesson.id, lesson.lessonName, chapter.id);
                              }}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-border/40"
                              title="Xóa bài học"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                        Chưa có bài học nào trong chương này
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
