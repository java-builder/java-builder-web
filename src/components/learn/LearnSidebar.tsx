"use client";

import Link from "next/link";
import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";

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
  onSelectLesson: (lesson: LessonDetailResponse, chapter: ChapterDetailResponse) => void;
}

export default function LearnSidebar({
  courseTitle,
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
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-[85%] max-w-[320px] lg:w-80
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <Link href="/my-courses" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm lg:text-base">{courseTitle}</h2>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto">
          {chapters.map((chapter, chapterIndex) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              chapterIndex={chapterIndex}
              lessons={chapterLessons[chapter.id] || []}
              isExpanded={expandedChapters.has(chapter.id)}
              isLoading={loadingChapters.has(chapter.id)}
              currentLessonId={currentLessonId}
              onToggle={() => onToggleChapter(chapter)}
              onSelectLesson={(lesson) => onSelectLesson(lesson, chapter)}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

interface ChapterItemProps {
  chapter: ChapterDetailResponse;
  chapterIndex: number;
  lessons: LessonDetailResponse[];
  isExpanded: boolean;
  isLoading: boolean;
  currentLessonId?: string;
  onToggle: () => void;
  onSelectLesson: (lesson: LessonDetailResponse) => void;
}

function ChapterItem({
  chapter,
  chapterIndex,
  lessons,
  isExpanded,
  isLoading,
  currentLessonId,
  onToggle,
  onSelectLesson,
}: ChapterItemProps) {
  return (
    <div className="border-b border-gray-200/50 dark:border-gray-700/50">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Chương {chapterIndex + 1}</span>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">{lessons.length} bài</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 pl-6 line-clamp-2">{chapter.chapterName}</p>
      </button>

      {isExpanded && (
        <div className="pb-2">
          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, lessonIndex) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                lessonIndex={lessonIndex}
                isActive={currentLessonId === lesson.id}
                onSelect={() => onSelectLesson(lesson)}
              />
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500 text-center">Chưa có bài học</p>
          )}
        </div>
      )}
    </div>
  );
}

interface LessonItemProps {
  lesson: LessonDetailResponse;
  lessonIndex: number;
  isActive: boolean;
  onSelect: () => void;
}

function LessonItem({ lesson, lessonIndex, isActive, onSelect }: LessonItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
        isActive ? "bg-accent/20 border-l-2 border-accent" : "hover:bg-gray-100 dark:hover:bg-gray-700/30"
      }`}
    >
      <span className={`w-6 h-6 flex items-center justify-center rounded text-xs flex-shrink-0 ${
        isActive ? "bg-accent text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      }`}>
        {lessonIndex + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm line-clamp-2 ${isActive ? "text-accent dark:text-white font-medium" : "text-gray-700 dark:text-gray-300"}`}>
          {lesson.lessonName}
        </p>
        {lesson.videoUrl && (
          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            Video
          </span>
        )}
      </div>
    </button>
  );
}
