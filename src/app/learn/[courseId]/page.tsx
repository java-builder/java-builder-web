"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { courseApi, lessonApi } from "@/services/course.service";
import { CourseDetailResponse, LessonDetailResponse, ChapterDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LearnSidebar, LearnHeader, LessonContent } from "@/components/learn";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<LessonDetailResponse | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterDetailResponse | null>(null);
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [loadingChapters, setLoadingChapters] = useState<Set<string>>(new Set());

  const [initialTime, setInitialTime] = useState<number>(0);
  const currentTimeRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchedCourseIdRef = useRef<string | null>(null);

  const loadChapterLessons = useCallback(async (chapterId: string, selectFirst = false) => {
    setLoadingChapters(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.result) {
        setChapterLessons(prev => prev[chapterId] ? prev : { ...prev, [chapterId]: response.result || [] });
        
        if (selectFirst && response.result?.length) {
          const lessonDetail = await lessonApi.getById(response.result[0].id);
          setCurrentLesson(lessonDetail.result || response.result[0]);
        }
      }
    } finally {
      setLoadingChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  }, []);

  const initializeCourse = useCallback(async () => {
    if (!courseId || userLoading) return;
    if (!currentUser) { router.push(`/courses/${courseId}`); return; }
    if (fetchedCourseIdRef.current === courseId) return;
    fetchedCourseIdRef.current = courseId;

    try {
      setIsLoading(true);
      const courseResult = await courseApi.getById(courseId);
      
      if (courseResult.code !== 200 || !courseResult.result) {
        router.push(`/courses/${courseId}`);
        return;
      }

      setCourse(courseResult.result);

      // User được vào learn nếu đã enroll HOẶC là premium user
      const canAccess = courseResult.result.isEnrolled || courseResult.result.isPremiumUser;
      if (!canAccess) {
        setAccessDenied(true);
        return;
      }

      if (courseResult.result.chapters?.length) {
        const firstChapter = courseResult.result.chapters[0];
        setExpandedChapters(new Set([firstChapter.id]));
        setCurrentChapter(firstChapter);
        await loadChapterLessons(firstChapter.id, true);
      }
    } catch {
      router.push(`/courses/${courseId}`);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, currentUser, userLoading, router, loadChapterLessons]);

  useEffect(() => { initializeCourse(); }, [initializeCourse]);

  const saveProgress = useCallback(async () => {
    if (!currentLesson || currentTimeRef.current === lastSavedTimeRef.current) return;
    try {
      await lessonApi.updateProgress({ lessonId: currentLesson.id, watchedSeconds: currentTimeRef.current });
      lastSavedTimeRef.current = currentTimeRef.current;
    } catch { /* Silent */ }
  }, [currentLesson]);

  useEffect(() => {
    if (currentLesson?.videoUrl) {
      saveIntervalRef.current = setInterval(saveProgress, 60000);
    }
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      saveProgress();
    };
  }, [currentLesson, saveProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentLesson && currentTimeRef.current > 0) {
        navigator.sendBeacon("/api/v1/lessons/progress", JSON.stringify({
          lessonId: currentLesson.id,
          watchedSeconds: currentTimeRef.current,
        }));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentLesson]);

  const handleTimeUpdate = useCallback((time: number, duration: number) => {
    currentTimeRef.current = time;
    if (!isCompletedRef.current && duration > 0 && time >= duration * 0.9) {
      isCompletedRef.current = true;
      if (currentLesson) {
        lessonApi.updateProgress({ lessonId: currentLesson.id, watchedSeconds: time, completed: true })
          .then(() => {
            // Update the lesson's completed status in chapterLessons
            setChapterLessons(prev => {
              const updated = { ...prev };
              for (const chapterId in updated) {
                updated[chapterId] = updated[chapterId].map(lesson =>
                  lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
                );
              }
              return updated;
            });
          })
          .catch(() => {});
      }
    }
  }, [currentLesson]);

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

  const selectLesson = async (lesson: LessonDetailResponse, chapter: ChapterDetailResponse) => {
    await saveProgress();
    try {
      const response = await lessonApi.getById(lesson.id);
      setCurrentLesson(response.result || lesson);
    } catch {
      setCurrentLesson(lesson);
    }
    setCurrentChapter(chapter);
    resetProgressTracking();
    setSidebarOpen(false);
  };

  const resetProgressTracking = () => {
    setInitialTime(0);
    currentTimeRef.current = 0;
    lastSavedTimeRef.current = 0;
    isCompletedRef.current = false;
  };

  const getAllLessons = useCallback(() => {
    if (!course?.chapters) return [];
    const all: { lesson: LessonDetailResponse; chapter: ChapterDetailResponse }[] = [];
    course.chapters.forEach(chapter => {
      (chapterLessons[chapter.id] || []).forEach(lesson => all.push({ lesson, chapter }));
    });
    return all;
  }, [course, chapterLessons]);

  const navigateLesson = async (direction: "next" | "prev") => {
    if (!currentLesson) return;
    await saveProgress();

    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLesson.id);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < allLessons.length) {
      const { lesson, chapter } = allLessons[newIndex];
      try {
        const response = await lessonApi.getById(lesson.id);
        setCurrentLesson(response.result || lesson);
      } catch {
        setCurrentLesson(lesson);
      }
      setCurrentChapter(chapter);
      resetProgressTracking();
      if (!expandedChapters.has(chapter.id)) {
        setExpandedChapters(prev => new Set(prev).add(chapter.id));
      }
    }
  };

  const canNavigate = (direction: "next" | "prev") => {
    if (!currentLesson) return false;
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex(item => item.lesson.id === currentLesson.id);
    return direction === "next" ? currentIndex < allLessons.length - 1 : currentIndex > 0;
  };

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Không tìm thấy khóa học</p>
          <Link href="/my-courses" className="text-accent hover:underline">Quay lại khóa học của tôi</Link>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Bạn chưa có quyền truy cập
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Để học khóa &quot;<span className="font-medium text-gray-900 dark:text-white">{course.title}</span>&quot;, 
            bạn cần đăng ký khóa học hoặc nâng cấp tài khoản Premium.
          </p>

          {/* Course thumbnail */}
          {course.courseCover && (
            <div className="mb-6 rounded-lg overflow-hidden relative w-full aspect-video">
              <Image 
                src={course.courseCover} 
                alt={course.title}
                fill
                className="object-contain"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/courses/${courseId}`}
              className="flex-1 py-2.5 px-4 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              Đăng ký khóa học
            </Link>
            
            <Link
              href="/pricing"
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center"
            >
              Nâng cấp Premium
            </Link>
          </div>

          <Link
            href={`/courses/${courseId}`}
            className="inline-block mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
          >
            ← Quay lại
          </Link>

          {/* Benefits hint */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Với Premium, bạn được:
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                ✓ Truy cập tất cả khóa học
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                ✓ Không giới hạn thời gian
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                ✓ Cập nhật nội dung mới
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      <LearnSidebar
        courseTitle={course.title}
        chapters={course.chapters || []}
        chapterLessons={chapterLessons}
        expandedChapters={expandedChapters}
        loadingChapters={loadingChapters}
        currentLessonId={currentLesson?.id}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggleChapter={toggleChapter}
        onSelectLesson={selectLesson}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <LearnHeader
          chapterName={currentChapter?.chapterName}
          lessonName={currentLesson?.lessonName}
          canPrev={canNavigate("prev")}
          canNext={canNavigate("next")}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onPrev={() => navigateLesson("prev")}
          onNext={() => navigateLesson("next")}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <LessonContent
            lesson={currentLesson}
            initialTime={initialTime}
            canNext={canNavigate("next")}
            onTimeUpdate={handleTimeUpdate}
            onNext={() => navigateLesson("next")}
          />
        </div>
      </main>
    </div>
  );
}
