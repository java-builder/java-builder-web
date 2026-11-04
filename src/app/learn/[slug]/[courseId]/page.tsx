"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { courseApi, lessonApi } from "@/services/course.service";
import {
  CourseDetailResponse,
  LessonDetailResponse,
  ChapterDetailResponse,
} from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/contexts/AuthContext";
import { LearnSidebar, LearnHeader, LessonContent } from "@/components/learn";
import { API } from "@/api/api";
import { Check, Lock, ShoppingBag, UserPlus } from "lucide-react";

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

  const [currentLesson, setCurrentLesson] =
    useState<LessonDetailResponse | null>(null);
  const [currentChapter, setCurrentChapter] =
    useState<ChapterDetailResponse | null>(null);
  const [chapterLessons, setChapterLessons] = useState<
    Record<string, LessonDetailResponse[]>
  >({});
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [loadingChapters, setLoadingChapters] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const [initialTime, setInitialTime] = useState<number>(0);
  const currentTimeRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchedCourseIdRef = useRef<string | null>(null);

  const loadChapterLessons = useCallback(
    async (chapterId: string, selectFirst = false) => {
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

      setLoadingChapters((prev) => new Set(prev).add(chapterId));
      try {
        const response = await lessonApi.getByChapterId(chapterId);
        if (response.data) {
          setChapterLessons((prev) => ({
            ...prev,
            [chapterId]: response.data || [],
          }));

          if (selectFirst && response.data?.length) {
            const lessonDetail = await lessonApi.getById(response.data[0].id);
            if (lessonDetail.data) {
              setCurrentLesson(lessonDetail.data);
            }
          }
        }
      } finally {
        setLoadingChapters((prev) => {
          const newSet = new Set(prev);
          newSet.delete(chapterId);
          return newSet;
        });
      }
    },
    [chapterLessons]
  );

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

      const canAccess = Boolean(
        courseResult.data.isEnrolled || courseResult.data.isPremiumUser
      );
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
  }, [
    courseId,
    slug,
    currentUser,
    userLoading,
    isAuthenticated,
    authLoading,
    router,
    loadChapterLessons,
  ]);

  useEffect(() => {
    initializeCourse();
  }, [initializeCourse]);

  const saveProgress = useCallback(async () => {
    if (!currentLesson || currentTimeRef.current === lastSavedTimeRef.current)
      return;
    try {
      await lessonApi.updateProgress({
        lessonId: currentLesson.id,
        watchedSeconds: currentTimeRef.current,
      });
      lastSavedTimeRef.current = currentTimeRef.current;
    } catch {
      /* Silent */
    }
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
        navigator.sendBeacon(
          API.LESSON_PROGRESS,
          JSON.stringify({
            lessonId: currentLesson.id,
            watchedSeconds: currentTimeRef.current,
          })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentLesson]);

  const handleTimeUpdate = useCallback(
    (time: number, duration: number) => {
      currentTimeRef.current = time;
      if (!isCompletedRef.current && duration > 0 && time >= duration * 0.9) {
        isCompletedRef.current = true;
        if (currentLesson) {
          lessonApi
            .updateProgress({
              lessonId: currentLesson.id,
              watchedSeconds: time,
              completed: true,
            })
            .then(() => {
              setChapterLessons((prev) => {
                const updated = { ...prev };
                for (const chapterId in updated) {
                  updated[chapterId] = updated[chapterId].map((lesson) =>
                    lesson.id === currentLesson.id
                      ? { ...lesson, completed: true }
                      : lesson
                  );
                }
                return updated;
              });
            })
            .catch(() => {});
        }
      }
    },
    [currentLesson]
  );

  const toggleChapter = useCallback(
    async (chapter: ChapterDetailResponse) => {
      setExpandedChapters((prev) => {
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
    },
    [chapterLessons, loadChapterLessons]
  );

  const resetProgressTracking = useCallback(() => {
    setInitialTime(0);
    currentTimeRef.current = 0;
    lastSavedTimeRef.current = 0;
    isCompletedRef.current = false;
  }, []);

  const selectLesson = useCallback(
    async (lesson: LessonDetailResponse, chapter: ChapterDetailResponse) => {
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
    },
    [currentLesson?.id, saveProgress, resetProgressTracking]
  );

  const allLessons = useMemo(() => {
    if (!course?.chapters) return [];
    const all: {
      lesson: LessonDetailResponse;
      chapter: ChapterDetailResponse;
    }[] = [];
    course.chapters.forEach((chapter) => {
      (chapterLessons[chapter.id] || []).forEach((lesson) =>
        all.push({ lesson, chapter })
      );
    });
    return all;
  }, [course?.chapters, chapterLessons]);

  const currentLessonIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return allLessons.findIndex((item) => item.lesson.id === currentLesson.id);
  }, [allLessons, currentLesson]);

  const totalLessons = useMemo(() => allLessons.length, [allLessons]);
  const completedCount = useMemo(
    () => allLessons.filter((item) => item.lesson.completed).length,
    [allLessons]
  );

  const navigateLesson = useCallback(
    async (direction: "next" | "prev") => {
      if (currentLessonIndex === -1) return;
      await saveProgress();
      setIsLoadingLesson(true);

      const newIndex =
        direction === "next" ? currentLessonIndex + 1 : currentLessonIndex - 1;

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
          setExpandedChapters((prev) => new Set(prev).add(chapter.id));
        }
      } else {
        setIsLoadingLesson(false);
      }
    },
    [
      currentLessonIndex,
      allLessons,
      saveProgress,
      resetProgressTracking,
      expandedChapters,
    ]
  );

  const canPrev = currentLessonIndex > 0;
  const canNext =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1;

  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const handleToggleSidebar = useCallback(
    () => setSidebarOpen((prev) => !prev),
    []
  );
  const handlePrev = useCallback(
    () => navigateLesson("prev"),
    [navigateLesson]
  );
  const handleNext = useCallback(
    () => navigateLesson("next"),
    [navigateLesson]
  );

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm font-medium text-text-muted">
            Đang tải khóa học...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Không tìm thấy khóa học</p>
          <Link
            href="/my-courses"
            className="text-primary font-semibold hover:underline"
          >
            Quay lại khóa học của tôi
          </Link>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    const isFree = !course.price || course.price === 0;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-surface rounded-2xl border border-border shadow-xl p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 border ${
              isFree
                ? "bg-success/10 text-success border-success/20"
                : "bg-primary-soft text-primary border-primary/20"
            }`}
          >
            {isFree ? (
              <UserPlus className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            {isFree ? "Tham gia khóa học miễn phí" : "Nội dung này đã được khóa"}
          </h1>

          <p className="text-text-muted mb-6 text-sm sm:text-base leading-relaxed">
            Để bắt đầu học khóa &quot;
            <span className="font-semibold text-foreground">{course.title}</span>
            &quot;, vui lòng{" "}
            {isFree ? "đăng ký tham gia khóa học" : "đăng ký mua khóa học"} để
            mở khóa toàn bộ hệ thống bài giảng video, bài tập thực hành và nhận
            hỗ trợ từ giảng viên.
          </p>

          {course.thumbnailUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden relative w-full aspect-video border border-border bg-background">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-full transition-all text-sm cursor-pointer shadow-sm hover:shadow active:scale-95 bg-primary hover:bg-primary-hover text-white"
            >
              {isFree ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>
                {isFree
                  ? "Tham gia khóa học miễn phí"
                  : "Mua khóa học để truy cập"}
              </span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-text-muted">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              <span>Sở hữu trọn đời</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              <span>Hỗ trợ học tập 24/7</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              <span>Tài liệu & Mã nguồn</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
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
          courseSlug={slug}
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
