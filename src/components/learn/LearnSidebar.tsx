"use client";

import { useState, useMemo } from "react";
import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";
import {
  CheckCircle2,
  ChevronDown,
  PlayCircle,
  Search,
  X,
} from "lucide-react";

interface LearnSidebarProps {
  courseTitle: string;
  chapters: ChapterDetailResponse[];
  chapterLessons: Record<string, LessonDetailResponse[]>;
  expandedChapters: Set<string>;
  loadingChapters: Set<string>;
  currentLessonId?: string;
  isOpen: boolean;
  onClose: () => void;
  onToggleChapter: (chapter: ChapterDetailResponse) => void;
  onSelectLesson: (
    lesson: LessonDetailResponse,
    chapter: ChapterDetailResponse
  ) => void;
}

export default function LearnSidebar({
  chapters,
  chapterLessons,
  expandedChapters,
  loadingChapters,
  currentLessonId,
  isOpen,
  onClose,
  onToggleChapter,
  onSelectLesson,
}: LearnSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return chapters.map((chapter, index) => ({
        chapter,
        chapterIndex: index,
        lessons: chapterLessons[chapter.id] || [],
      }));
    }

    return chapters
      .map((chapter, index) => {
        const allLessons = chapterLessons[chapter.id] || [];
        const matchedLessons = allLessons.filter((l) =>
          l.lessonName.toLowerCase().includes(q)
        );
        const chapterMatches = chapter.chapterName.toLowerCase().includes(q);
        if (chapterMatches || matchedLessons.length > 0) {
          return {
            chapter,
            chapterIndex: index,
            lessons: matchedLessons.length > 0 ? matchedLessons : allLessons,
          };
        }
        return null;
      })
      .filter(Boolean) as {
      chapter: ChapterDetailResponse;
      chapterIndex: number;
      lessons: LessonDetailResponse[];
    }[];
  }, [chapters, chapterLessons, searchQuery]);

  const renderSidebarContent = (showCloseButton = false) => (
    <>
      {/* Top Search Box */}
      <div className="p-3.5 border-b border-border bg-surface shrink-0 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài học..."
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-background border border-border text-xs font-medium text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-muted hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <nav className="space-y-1.5">
          {filteredChapters.map(({ chapter, chapterIndex, lessons }) => {
            const isExpanded =
              Boolean(searchQuery.trim()) || expandedChapters.has(chapter.id);
            const isLoading = loadingChapters.has(chapter.id);
            const completedCount = lessons.filter((l) => l.completed).length;
            const cleanChapterTitle = chapter.chapterName.replace(
              /^Chương\s+\d+\s*[:.-]\s*/i,
              ""
            );

            return (
              <div
                key={chapter.id}
                className="pt-2 first:pt-0 border-t border-border/60 first:border-t-0 space-y-1"
              >
                {/* Chapter Group Header */}
                <button
                  type="button"
                  onClick={() => onToggleChapter(chapter)}
                  title={chapter.chapterName}
                  className="group w-full flex items-start justify-between gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug shrink-0">
                      {chapterIndex + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {cleanChapterTitle}
                      </p>
                      {lessons.length > 0 && (
                        <p className="text-[11px] font-medium text-text-muted mt-0.5">
                          Đã học {completedCount}/{lessons.length} bài
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-text-muted group-hover:text-primary transition-transform duration-200 shrink-0 mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Chapter Lessons */}
                {isExpanded && (
                  <ul className="ml-3.5 pl-2.5 border-l border-border space-y-1 py-0.5">
                    {isLoading ? (
                      <li className="px-3 py-2 text-xs text-text-muted flex items-center gap-2">
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span>Đang tải bài học...</span>
                      </li>
                    ) : lessons.length > 0 ? (
                      lessons.map((lesson, lessonIndex) => {
                        const isActive = currentLessonId === lesson.id;
                        const strippedTitle = lesson.lessonName.replace(
                          /^\s*\d+[\.\)]\s*/,
                          ""
                        );

                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => onSelectLesson(lesson, chapter)}
                              title={lesson.lessonName}
                              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-start gap-2.5 cursor-pointer group/item ${
                                isActive
                                  ? "bg-primary-soft text-primary font-semibold"
                                  : "text-foreground/80 hover:bg-muted/70 hover:text-foreground font-medium"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    isActive ? "text-primary" : "text-success"
                                  }`}
                                />
                              ) : (
                                <PlayCircle
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    isActive
                                      ? "text-primary"
                                      : "text-text-muted/60 group-hover/item:text-primary"
                                  }`}
                                />
                              )}
                              <span className="flex-1 leading-snug break-words min-w-0">
                                {lessonIndex + 1}. {strippedTitle}
                              </span>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1.5 text-xs text-text-muted italic">
                        Chưa có bài học nào
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{ width: isOpen ? 320 : 0 }}
      >
        <aside className="w-80 h-full bg-surface border-r border-border flex flex-col">
          {renderSidebarContent(false)}
        </aside>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed lg:hidden inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-surface border-r border-border flex flex-col h-screen shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
}
