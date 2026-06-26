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

      {/* Sidebar Wrapper - controls width transition (Desktop - Right Side) */}
      <div 
        className="hidden lg:block flex-shrink-0 overflow-hidden"
        style={{
          width: isOpen ? 320 : 0,
          transition: "width 300ms ease-in-out"
        }}
      >
        <aside className="w-80 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/60 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700/60 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <Link href="/my-courses" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-sky-400 text-sm font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </Link>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm lg:text-base leading-snug">{courseTitle}</h2>
          </div>

          {/* Chapters List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
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
      </div>

      {/* Mobile Sidebar - Slides in from the Left */}
      <aside className={`
        fixed lg:hidden inset-y-0 left-0 z-50
        w-[85%] max-w-[320px]
        bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/60 
        flex flex-col h-screen shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700/60 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <Link href="/my-courses" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-sky-400 text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-500 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm lg:text-base leading-snug">{courseTitle}</h2>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
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
  const completedCount = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const isAllCompleted = totalLessons > 0 && completedCount === totalLessons;
  
  return (
    <div className="border-b border-gray-150 dark:border-slate-700/50">
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3.5 transition-all text-left flex flex-col gap-1 cursor-pointer ${
          isExpanded 
            ? "bg-accent/5 dark:bg-accent/10 border-r-2 border-accent" 
            : "hover:bg-gray-55 dark:hover:bg-slate-700/30"
        }`}
      >
        {/* Chapter Header */}
        <div className="flex items-start gap-3 w-full">
          {/* Chapter Number Badge */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
            isAllCompleted
              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30"
              : isExpanded
                ? "bg-accent/15 text-accent dark:bg-accent/20 dark:text-sky-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-550 dark:text-slate-400"
          }`}>
            {isAllCompleted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              chapterIndex + 1
            )}
          </div>

          {/* Chapter Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                isExpanded ? "text-accent dark:text-sky-400" : "text-gray-400 dark:text-slate-500"
              }`}>
                Chương {chapterIndex + 1}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {totalLessons > 0 && (
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">
                    {completedCount}/{totalLessons} bài
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-transform duration-250 ${isExpanded ? "rotate-180 text-accent dark:text-sky-400" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${
              isExpanded 
                ? "text-gray-900 dark:text-white" 
                : "text-gray-700 dark:text-slate-200"
            }`}>
              {chapter.chapterName}
            </p>
          </div>
        </div>
      </button>

      {/* Lessons List */}
      {isExpanded && (
        <div className="pb-2 bg-gray-50/50 dark:bg-slate-900/10">
          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : lessons.length > 0 ? (
            <div className="space-y-0.5 mt-0.5">
              {lessons.map((lesson, lessonIndex) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lessonIndex={lessonIndex}
                  isActive={currentLessonId === lesson.id}
                  onSelect={() => onSelectLesson(lesson)}
                />
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-xs text-gray-400 dark:text-slate-500 italic text-center">Chưa có bài học</p>
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
  const isCompleted = lesson.completed;
  
  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-2.5 flex items-start gap-3 text-left transition-all cursor-pointer ${
        isActive 
          ? "bg-accent/10 border-l-2 border-accent dark:bg-accent/15" 
          : "hover:bg-gray-100 dark:hover:bg-slate-700/20"
      }`}
    >
      <span className={`text-xs font-bold flex-shrink-0 mt-0.5 ${
        isActive 
          ? "text-accent dark:text-sky-400" 
          : isCompleted 
            ? "text-emerald-500 dark:text-emerald-400" 
            : "text-gray-400 dark:text-slate-500"
      }`}>
        {lessonIndex + 1}.
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs sm:text-sm leading-normal ${
          isActive 
            ? "text-accent dark:text-sky-400 font-bold" 
            : isCompleted 
              ? "text-emerald-600 dark:text-emerald-400 font-medium" 
              : "text-gray-700 dark:text-slate-300"
        }`}>
          {lesson.lessonName}
        </p>
        
        <div className="flex items-center gap-2 mt-1">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Đã hoàn thành
            </span>
          ) : (
            <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bài học video
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
