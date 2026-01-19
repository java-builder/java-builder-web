"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const slug = params?.slug as string;
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<LessonDetailResponse | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterDetailResponse | null>(null);
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [loadingChapters, setLoadingChapters] = useState<Set<string>>(new Set());
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const [initialTime, setInitialTime] = useState<number>(0);
  const currentTimeRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchedCourseIdRef = useRef<string | null>(null);

  const loadChapterLessons = useCallback(async (chapterId: string, selectFirst = false) => {
    if (chapterLessons[chapterId]) {
      if (selectFirst && chapterLessons[chapterId].length > 0) {
        const firstLesson = chapterLessons[chapterId][0];
        const lessonDetail = await lessonApi.getById(firstLesson.id);
        if (lessonDetail.result) {
          setCurrentLesson(lessonDetail.result);
        }
      }
      return;
    }

    setLoadingChapters(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.result) {
        setChapterLessons(prev => ({ ...prev, [chapterId]: response.result || [] }));
        
        if (selectFirst && response.result?.length) {
          const lessonDetail = await lessonApi.getById(response.result[0].id);
          if (lessonDetail.result) {
            setCurrentLesson(lessonDetail.result);
          }
        }
      }
    } finally {
      setLoadingChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  }, [chapterLessons]);

  const initializeCourse = useCallback(async () => {
    if (!courseId || userLoading) return;
    if (!currentUser) { router.push(`/courses/${slug}`); return; }
    if (fetchedCourseIdRef.current === courseId) return;
    fetchedCourseIdRef.current = courseId;

    try {
      setIsLoading(true);
      const courseResult = await courseApi.getById(courseId);
      
      if (courseResult.code !== 200 || !courseResult.result) {
        router.push(`/courses/${slug}`);
        return;
      }

      setCourse(courseResult.result);

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
      router.push(`/courses/${slug}`);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, slug, currentUser, userLoading, router, loadChapterLessons]);

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

  const toggleChapter = useCallback(async (chapter: ChapterDetailResponse) => {
    setExpandedChapters(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(chapter.id)) {
        newExpanded.delete(chapter.id);
      } else {
        newExpanded.add(chapter.id);
        if (!chapterLessons[chapter.id]) {
          loadChapterLessons(chapter.id);
        }
      }
      return newExpanded;
    });
  }, [chapterLessons, loadChapterLessons]);

  const resetProgressTracking = useCallback(() => {
    setInitialTime(0);
    currentTimeRef.current = 0;
    lastSavedTimeRef.current = 0;
    isCompletedRef.current = false;
  }, []);

  const selectLesson = useCallback(async (lesson: LessonDetailResponse, chapter: ChapterDetailResponse) => {
    if (currentLesson?.id === lesson.id) return;
    
    await saveProgress();
    setIsLoadingLesson(true);
    
    try {
      const response = await lessonApi.getById(lesson.id);
      if (response.result) {
        setCurrentLesson(response.result);
      }
    } catch {
      setCurrentLesson(lesson);
    } finally {
      setIsLoadingLesson(false);
    }
    
    setCurrentChapter(chapter);
    resetProgressTracking();
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentLesson?.id, saveProgress, resetProgressTracking]);

  const allLessons = useMemo(() => {
    if (!course?.chapters) return [];
    const all: { lesson: LessonDetailResponse; chapter: ChapterDetailResponse }[] = [];
    course.chapters.forEach(chapter => {
      (chapterLessons[chapter.id] || []).forEach(lesson => all.push({ lesson, chapter }));
    });
    return all;
  }, [course?.chapters, chapterLessons]);

  const currentLessonIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return allLessons.findIndex(item => item.lesson.id === currentLesson.id);
  }, [allLessons, currentLesson]);

  const navigateLesson = useCallback(async (direction: "next" | "prev") => {
    if (currentLessonIndex === -1) return;
    await saveProgress();
    setIsLoadingLesson(true);

    const newIndex = direction === "next" ? currentLessonIndex + 1 : currentLessonIndex - 1;

    if (newIndex >= 0 && newIndex < allLessons.length) {
      const { lesson, chapter } = allLessons[newIndex];
      
      try {
        const response = await lessonApi.getById(lesson.id);
        if (response.result) {
          setCurrentLesson(response.result);
        }
      } catch {
        setCurrentLesson(lesson);
      } finally {
        setIsLoadingLesson(false);
      }
      
      setCurrentChapter(chapter);
      resetProgressTracking();
      
      if (!expandedChapters.has(chapter.id)) {
        setExpandedChapters(prev => new Set(prev).add(chapter.id));
      }
    } else {
      setIsLoadingLesson(false);
    }
  }, [currentLessonIndex, allLessons, saveProgress, resetProgressTracking, expandedChapters]);

  const canPrev = currentLessonIndex > 0;
  const canNext = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1;

  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const handleToggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handlePrev = useCallback(() => navigateLesson("prev"), [navigateLesson]);
  const handleNext = useCallback(() => navigateLesson("next"), [navigateLesson]);

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
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Bạn chưa có quyền truy cập
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Để học khóa &quot;<span className="font-medium text-gray-900 dark:text-white">{course.title}</span>&quot;, 
            bạn cần đăng ký khóa học hoặc nâng cấp tài khoản Premium.
          </p>

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

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/courses/${slug}`}
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
            href={`/courses/${slug}`}
            className="inline-block mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
          >
            ← Quay lại
          </Link>

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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row overflow-hidden">
      <LearnSidebar
        courseTitle={course.title}
        chapters={course.chapters || []}
        chapterLessons={chapterLessons}
        expandedChapters={expandedChapters}
        loadingChapters={loadingChapters}
        currentLessonId={currentLesson?.id}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onToggleChapter={toggleChapter}
        onSelectLesson={selectLesson}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <LearnHeader
          chapterName={currentChapter?.chapterName}
          lessonName={currentLesson?.lessonName}
          canPrev={canPrev}
          canNext={canNext}
          onToggleSidebar={handleToggleSidebar}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="flex-1 overflow-y-auto">
          <LessonContent
            lesson={currentLesson}
            initialTime={initialTime}
            canNext={canNext}
            isLoading={isLoadingLesson}
            onTimeUpdate={handleTimeUpdate}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
