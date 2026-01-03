"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { courseApi, lessonApi, enrollmentApi } from "@/services/course.service";
import { CourseDetailResponse, LessonDetailResponse, ChapterDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Current lesson state
  const [currentLesson, setCurrentLesson] = useState<LessonDetailResponse | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterDetailResponse | null>(null);

  // Lessons by chapter
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [loadingChapters, setLoadingChapters] = useState<Set<string>>(new Set());

  // Load lessons for a chapter
  const loadChapterLessons = useCallback(async (chapterId: string, selectFirst = false) => {
    setLoadingChapters(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.result) {
        setChapterLessons(prev => {
          // Check if already loaded
          if (prev[chapterId]) {
            if (selectFirst && prev[chapterId].length > 0) {
              setCurrentLesson(prev[chapterId][0]);
            }
            return prev;
          }
          if (selectFirst && response.result && response.result.length > 0) {
            setCurrentLesson(response.result[0]);
          }
          return { ...prev, [chapterId]: response.result || [] };
        });
      }
    } finally {
      setLoadingChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  }, []);

  // Check enrollment and load course
  const initializeCourse = useCallback(async () => {
    if (!courseId || userLoading) return;

    // Redirect if not logged in
    if (!currentUser) {
      router.push(`/courses/${courseId}`);
      return;
    }

    try {
      setIsLoading(true);

      // Check enrollment
      const enrollmentResult = await enrollmentApi.checkEnrollment(courseId);
      if (!enrollmentResult.result) {
        router.push(`/courses/${courseId}`);
        return;
      }

      // Load course
      const courseResult = await courseApi.getById(courseId);
      if (courseResult.code === 200 && courseResult.result) {
        setCourse(courseResult.result);

        // Auto expand first chapter and load its lessons
        if (courseResult.result.chapters && courseResult.result.chapters.length > 0) {
          const firstChapter = courseResult.result.chapters[0];
          setExpandedChapters(new Set([firstChapter.id]));
          setCurrentChapter(firstChapter);
          await loadChapterLessons(firstChapter.id, true);
        }
      }
    } catch {
      router.push(`/courses/${courseId}`);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, currentUser, userLoading, router, loadChapterLessons]);

  useEffect(() => {
    initializeCourse();
  }, [initializeCourse]);

  // Toggle chapter
  const toggleChapter = async (chapter: ChapterDetailResponse) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapter.id)) {
      newExpanded.delete(chapter.id);
    } else {
      newExpanded.add(chapter.id);
      await loadChapterLessons(chapter.id);
    }
    setExpandedChapters(newExpanded);
  };

  // Select lesson
  const selectLesson = (lesson: LessonDetailResponse, chapter: ChapterDetailResponse) => {
    setCurrentLesson(lesson);
    setCurrentChapter(chapter);
  };

  // Navigate to next/prev lesson
  const navigateLesson = (direction: "next" | "prev") => {
    if (!course?.chapters || !currentLesson || !currentChapter) return;

    const allLessons: { lesson: LessonDetailResponse; chapter: ChapterDetailResponse }[] = [];
    course.chapters.forEach(chapter => {
      const lessons = chapterLessons[chapter.id] || [];
      lessons.forEach(lesson => allLessons.push({ lesson, chapter }));
    });

    const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLesson.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < allLessons.length) {
      const { lesson, chapter } = allLessons[newIndex];
      setCurrentLesson(lesson);
      setCurrentChapter(chapter);
      
      // Expand chapter if not expanded
      if (!expandedChapters.has(chapter.id)) {
        setExpandedChapters(prev => new Set(prev).add(chapter.id));
      }
    }
  };

  // Check if can navigate
  const canNavigate = (direction: "next" | "prev") => {
    if (!course?.chapters || !currentLesson) return false;

    const allLessons: LessonDetailResponse[] = [];
    course.chapters.forEach(chapter => {
      const lessons = chapterLessons[chapter.id] || [];
      allLessons.push(...lessons);
    });

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (direction === "next") return currentIndex < allLessons.length - 1;
    return currentIndex > 0;
  };

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Không tìm thấy khóa học</p>
          <Link href="/my-courses" className="text-accent hover:underline">
            Quay lại khóa học của tôi
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-80" : "w-0"} bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <Link href="/my-courses" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
          <h2 className="font-semibold text-white line-clamp-2">{course.title}</h2>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto">
          {course.chapters?.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="border-b border-gray-700/50">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter)}
                className="w-full px-4 py-3 hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs text-gray-500 font-medium">Chương {chapterIndex + 1}</span>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {chapterLessons[chapter.id]?.length || 0} bài
                  </span>
                </div>
                <p className="text-sm text-gray-300 pl-6">{chapter.chapterName}</p>
              </button>

              {/* Lessons */}
              {expandedChapters.has(chapter.id) && (
                <div className="pb-2">
                  {loadingChapters.has(chapter.id) ? (
                    <div className="px-4 py-3 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent mx-auto"></div>
                    </div>
                  ) : chapterLessons[chapter.id]?.length > 0 ? (
                    chapterLessons[chapter.id].map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lesson, chapter)}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
                          currentLesson?.id === lesson.id
                            ? "bg-accent/20 border-l-2 border-accent"
                            : "hover:bg-gray-700/30"
                        }`}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                          currentLesson?.id === lesson.id
                            ? "bg-accent text-white"
                            : "bg-gray-700 text-gray-400"
                        }`}>
                          {lessonIndex + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            currentLesson?.id === lesson.id ? "text-white" : "text-gray-300"
                          }`}>
                            {lesson.lessonName}
                          </p>
                          {lesson.videoUrl && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                              </svg>
                              Video
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500 text-center">Chưa có bài học</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {currentLesson && currentChapter && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{currentChapter.chapterName}</p>
              <p className="text-sm text-white truncate">{currentLesson.lessonName}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateLesson("prev")}
              disabled={!canNavigate("prev")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateLesson("next")}
              disabled={!canNavigate("next")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {currentLesson ? (
            <>
              {/* Video Player */}
              <div className="bg-black flex-shrink-0">
                {currentLesson.videoUrl ? (
                  <div className="max-w-5xl mx-auto">
                    <VideoPlayer
                      key={currentLesson.id}
                      src={currentLesson.videoUrl}
                      autoPlay
                    />
                  </div>
                ) : (
                  <div className="aspect-video max-w-5xl mx-auto flex items-center justify-center bg-gray-800">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p>Chưa có video cho bài học này</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-xl font-semibold text-white mb-4">{currentLesson.lessonName}</h1>
                  {currentLesson.description && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap">{currentLesson.description}</p>
                    </div>
                  )}

                  {/* Next Lesson CTA */}
                  {canNavigate("next") && (
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Bài tiếp theo</p>
                        <p className="text-white font-medium">Tiếp tục học</p>
                      </div>
                      <button
                        onClick={() => navigateLesson("next")}
                        className="px-4 py-2 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        Bài tiếp theo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400">Chọn một bài học để bắt đầu</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
