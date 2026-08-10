"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { courseApi, lessonApi } from "@/services/course.service";
import { CourseDetailResponse, LessonDetailResponse, ChapterDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/contexts/AuthContext";
import { LearnSidebar, LearnHeader, LessonContent } from "@/components/learn";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const slug = params?.slug as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
        if (lessonDetail.data) {
          setCurrentLesson(lessonDetail.data);
        }
      }
      return;
    }

    setLoadingChapters(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.data) {
        setChapterLessons(prev => ({ ...prev, [chapterId]: response.data || [] }));

        if (selectFirst && response.data?.length) {
          const lessonDetail = await lessonApi.getById(response.data[0].id);
          if (lessonDetail.data) {
            setCurrentLesson(lessonDetail.data);
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
    if (!courseId || authLoading || (isAuthenticated && userLoading)) return;
    
    if (!isAuthenticated || !currentUser) {
      router.push(`/courses/${slug}`);
      return;
    }
    
    if (fetchedCourseIdRef.current === courseId) return;
    fetchedCourseIdRef.current = courseId;

    try {
      setIsLoading(true);
      const courseResult = await courseApi.getById(courseId);
      
      if (courseResult.code !== 200 || !courseResult.data) {
        router.push(`/courses/${slug}`);
        return;
      }

      setCourse(courseResult.data);

      const canAccess = courseResult.data.isEnrolled;
      if (!canAccess) {
        setAccessDenied(true);
        return;
      }

      if (courseResult.data.chapters?.length) {
        const firstChapter = courseResult.data.chapters[0];
        setExpandedChapters(new Set([firstChapter.id]));
        setCurrentChapter(firstChapter);
        await loadChapterLessons(firstChapter.id, true);
      }
    } catch (error) {
      console.error("Failed to initialize course:", error);
      router.push(`/courses/${slug}`);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, slug, currentUser, userLoading, isAuthenticated, authLoading, router, loadChapterLessons]);

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
      if (response.data) {
        setCurrentLesson(response.data);
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

  const totalLessons = useMemo(() => allLessons.length, [allLessons]);
  const completedCount = useMemo(() => allLessons.filter(item => item.lesson.completed).length, [allLessons]);

  const navigateLesson = useCallback(async (direction: "next" | "prev") => {
    if (currentLessonIndex === -1) return;
    await saveProgress();
    setIsLoadingLesson(true);

    const newIndex = direction === "next" ? currentLessonIndex + 1 : currentLessonIndex - 1;

    if (newIndex >= 0 && newIndex < allLessons.length) {
      const { lesson, chapter } = allLessons[newIndex];
      
      try {
        const response = await lessonApi.getById(lesson.id);
        if (response.data) {
          setCurrentLesson(response.data);
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Radial glow background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-2xl p-8 text-center relative z-10 overflow-hidden">
          {/* Header Icon */}
          {!course.price || course.price === 0 ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-500/20 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 dark:bg-accent/20 rounded-2xl text-accent mb-6 border border-accent/20 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {!course.price || course.price === 0 ? "Tham gia khóa học miễn phí" : "Nội dung này đã được khóa"}
          </h1>

          <p className="text-slate-600 dark:text-slate-450 mb-6 text-sm sm:text-base leading-relaxed">
            Để bắt đầu học khóa &quot;<span className="font-semibold text-gray-900 dark:text-white">{course.title}</span>&quot;, 
            vui lòng {!course.price || course.price === 0 ? "đăng ký tham gia khóa học" : "đăng ký mua khóa học"} để mở khóa toàn bộ hệ thống bài giảng video, bài tập thực hành và nhận hỗ trợ 1-1 từ giảng viên.
          </p>

          {course.thumbnailUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden relative w-full aspect-video border border-gray-100 dark:border-slate-700/60 shadow-sm bg-gray-50 dark:bg-slate-900/50">
              <Image 
                src={course.thumbnailUrl} 
                alt={course.title}
                fill
                className="object-contain"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href={`/courses/${slug}`}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all text-sm cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                !course.price || course.price === 0
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30"
                  : "bg-accent hover:bg-accent-600 text-white shadow-accent/20 hover:shadow-accent/30"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!course.price || course.price === 0 ? "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" : "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"} />
              </svg>
              {!course.price || course.price === 0 ? "Tham gia khóa học miễn phí" : "Mua khóa học để truy cập"}
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-150 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Sở hữu trọn đời</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Hỗ trợ học tập 24/7</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Tài liệu & Mã nguồn</span>
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
          completedCount={completedCount}
          totalLessons={totalLessons}
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
