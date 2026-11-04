"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsArticle from "@/components/docs/DocsArticle";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import CourseOverview from "@/components/docs/CourseOverview";
import ReviewSection from "@/components/courses/ReviewSection";
import PaymentModal from "@/components/courses/PaymentModal";
import CourseUnlockModal from "@/components/courses/CourseUnlockModal";
import AuthRequiredModal from "@/components/ui/auth-required-modal";
import { courseApi, lessonApi } from "@/services/course.service";
import { enrollmentApi } from "@/services/enrollment.service";
import { CourseDetailResponse, LessonDetailResponse } from "@/types/course";
import { formatDate } from "@/utils/dateUtils";
import { extractHeadings } from "@/utils/markdown";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { useCreatePaymentLink } from "@/hooks/usePayment";
import { CreatePaymentResponse } from "@/types/payment";
import toast from "react-hot-toast";
import { ChevronRight, Lock, FileQuestion } from "lucide-react";

export default function DocsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const currentLessonIdRef = useRef<string | null>(null);

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const lessonIdFromUrl = searchParams.get("lessonId");
  const [showOverview, setShowOverview] = useState(!lessonIdFromUrl);
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadedChapters, setLoadedChapters] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<LessonDetailResponse | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(!!lessonIdFromUrl);
  const lessonCacheRef = useRef<Record<string, LessonDetailResponse>>({});

  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    tab: "notes" | "ai";
  }>({
    isOpen: false,
    tab: "notes",
  });

  const hasAccess = Boolean(course?.isEnrolled || course?.isPremiumUser);

  usePaymentWebSocket(course?.id);
  const createPaymentMutation = useCreatePaymentLink();

  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    data: CreatePaymentResponse | null;
  }>({
    isOpen: false,
    isLoading: false,
    data: null,
  });

  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handlePayment = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để đăng ký khóa học",
        message: "Bạn cần đăng nhập để mua khóa học này.",
      });
      return;
    }

    setPaymentModal({ isOpen: true, isLoading: true, data: null });

    try {
      const result = await createPaymentMutation.mutateAsync(course.id);
      if (result.code === 201 && result.data) {
        setPaymentModal({ isOpen: true, isLoading: false, data: result.data });
      } else {
        toast.error("Không thể tạo link thanh toán");
        setPaymentModal({ isOpen: false, isLoading: false, data: null });
      }
    } catch {
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      toast.error("Có lỗi xảy ra khi tạo mã thanh toán.");
    }
  };

  const [isEnrollingFree, setIsEnrollingFree] = useState(false);

  const handleEnrollFree = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để tham gia khóa học",
        message: "Bạn cần đăng nhập để tham gia khóa học này.",
      });
      return;
    }

    setIsEnrollingFree(true);
    try {
      const result = await enrollmentApi.enrollFreeCourse(course.id);
      if (result.code === 200) {
        setCourse((prev) => (prev ? { ...prev, isEnrolled: true } : null));
        toast.success("Đăng ký tham gia khóa học thành công!");
        lessonCacheRef.current = {};
        if (selectedChapter) {
          setIsLoadingLesson(true);
          await loadLessonContent(selectedChapter);
          setIsLoadingLesson(false);
        }
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi đăng ký khóa học.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng ký khóa học.";
      toast.error(errorMsg);
    } finally {
      setIsEnrollingFree(false);
    }
  };

  const handleEnrollClick = () => {
    if (!course?.price || course.price === 0) {
      handleEnrollFree();
    } else {
      if (!currentUser) {
        setAuthModal({
          isOpen: true,
          title: "Đăng nhập để tiếp tục",
          message: "Bạn cần đăng nhập để mua khóa học hoặc nâng cấp gói Premium.",
        });
        return;
      }
      setUnlockModalOpen(true);
    }
  };

  useEffect(() => {
    if (isLoadingUser) {
      return;
    }

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);

        const response = await courseApi.getBySlug(slug);
        if (response.code === 200 && response.data) {
          const courseData = response.data;
          setCourse(courseData);
          setIsFavorite(courseData.isFavorite ?? false);

          if (courseData.chapters && courseData.chapters.length > 0) {
            setOpenCategories([courseData.chapters[0].id]);
            const fetchAllLessonNames = async () => {
              const lessonsMap: Record<string, LessonDetailResponse[]> = {};
              const loadedIds = new Set<string>();
              await Promise.all(
                courseData.chapters!.map(async (chapter) => {
                  try {
                    const lessonsResponse = await lessonApi.getByChapterId(chapter.id);
                    if (lessonsResponse.data) {
                      lessonsMap[chapter.id] = lessonsResponse.data.map((lesson) => ({
                        ...lesson,
                        content: undefined,
                      }));
                    } else {
                      lessonsMap[chapter.id] = [];
                    }
                    loadedIds.add(chapter.id);
                  } catch (error) {
                    console.error(`Error fetching lessons for chapter ${chapter.id}:`, error);
                    lessonsMap[chapter.id] = [];
                    loadedIds.add(chapter.id);
                  }
                })
              );
              setChapterLessons(lessonsMap);
              setLoadedChapters(loadedIds);
            };
            fetchAllLessonNames();
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug, currentUser, isLoadingUser]);

  const loadLessonContent = useCallback(
    async (lessonId: string) => {
      if (lessonCacheRef.current[lessonId]) {
        setSelectedLesson(lessonCacheRef.current[lessonId]);
        return lessonCacheRef.current[lessonId];
      }

      const response = await lessonApi.getById(lessonId);
      if (response.data) {
        const lesson = response.data;
        if (lesson.content) {
          if (course?.description) {
            lesson.content = lesson.content.replace(course.description, "").trim();
          }
          lesson.content = lesson.content.replace(/\n*\*Tiếp theo:[\s\S]*?\*\s*$/, "").trim();
        }
        lessonCacheRef.current[lessonId] = lesson;
        setSelectedLesson(lesson);
        return lesson;
      }
      return null;
    },
    [course?.description]
  );

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      setUnlockModalOpen(false);
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      setCourse((prev) => (prev ? { ...prev, isEnrolled: true, isPremiumUser: true } : null));
      lessonCacheRef.current = {};
      if (selectedChapter) {
        setIsLoadingLesson(true);
        await loadLessonContent(selectedChapter);
        setIsLoadingLesson(false);
      }
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => {
      window.removeEventListener("payment:success", handlePaymentSuccess);
    };
  }, [selectedChapter, loadLessonContent]);

  useEffect(() => {
    if (!course || !chapterLessons || Object.keys(chapterLessons).length === 0) return;
    if (currentLessonIdRef.current) return;

    const lessonId = searchParams.get("lessonId");
    if (!lessonId) return;

    const loadInitialLesson = async () => {
      for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
        const targetLesson = lessons.find((l) => l.id === lessonId);
        if (targetLesson) {
          setOpenCategories((prev) => {
            if (!prev.includes(chapterId)) {
              return [...prev, chapterId];
            }
            return prev;
          });
          try {
            currentLessonIdRef.current = lessonId;
            setSelectedChapter(lessonId);
            await loadLessonContent(lessonId);
          } catch (error) {
            console.error("Error fetching lesson:", error);
            currentLessonIdRef.current = null;
          } finally {
            setIsLoadingLesson(false);
          }
          break;
        }
      }
    };

    loadInitialLesson();
  }, [course, chapterLessons, searchParams, loadLessonContent]);

  const handleLessonClick = useCallback(
    async (lessonId: string) => {
      if (currentLessonIdRef.current === lessonId || isLoadingLesson) {
        return;
      }

      try {
        currentLessonIdRef.current = lessonId;

        setSelectedChapter(lessonId);
        setShowOverview(false);
        setIsLoadingLesson(true);
        setIsSidebarOpen(false);

        let parentChapterId: string | null = null;
        for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
          if (lessons.some((l) => l.id === lessonId)) {
            parentChapterId = chapterId;
            break;
          }
        }

        if (parentChapterId) {
          setOpenCategories((prev) => {
            if (!prev.includes(parentChapterId!)) {
              return [...prev, parentChapterId!];
            }
            return prev;
          });
        }

        const url = new URL(window.location.href);
        url.searchParams.set("lessonId", lessonId);
        window.history.replaceState({}, "", url.pathname + url.search);

        await loadLessonContent(lessonId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching lesson:", error);
        currentLessonIdRef.current = null;
      } finally {
        setIsLoadingLesson(false);
      }
    },
    [isLoadingLesson, loadLessonContent, chapterLessons]
  );

  const handleOverviewClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("lessonId");
    window.history.replaceState({}, "", url.pathname + url.search);

    setShowOverview(true);
    setSelectedChapter(null);
    setSelectedLesson(null);
    setIsLoadingLesson(false);
    setIsSidebarOpen(false);
    currentLessonIdRef.current = null;
  };

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const categories = useMemo(
    () => [
      {
        id: "overview",
        title: "Tổng quan khóa học",
        topics: [],
      },
      ...(course?.chapters?.map((chapter) => ({
        id: chapter.id,
        title: chapter.chapterName,
        topics:
          chapterLessons[chapter.id]?.map((lesson) => ({
            id: lesson.id,
            title: lesson.lessonName,
            slug: lesson.id,
            completed: lesson.completed,
          })) || [],
      })) || []),
    ],
    [course?.chapters, chapterLessons]
  );

  const flatLessons = useMemo(() => {
    const list: { id: string; title: string; chapterName: string; completed?: boolean }[] = [];
    for (const chapter of course?.chapters || []) {
      const lessons = chapterLessons[chapter.id] || [];
      for (const lesson of lessons) {
        list.push({
          id: lesson.id,
          title: lesson.lessonName,
          chapterName: chapter.chapterName,
          completed: lesson.completed,
        });
      }
    }
    return list;
  }, [course?.chapters, chapterLessons]);

  const { prevLesson, nextLesson } = useMemo(() => {
    if (!selectedChapter || flatLessons.length === 0) {
      return { prevLesson: null, nextLesson: null };
    }
    const idx = flatLessons.findIndex((l) => l.id === selectedChapter);
    if (idx === -1) return { prevLesson: null, nextLesson: null };
    return {
      prevLesson: idx > 0 ? flatLessons[idx - 1] : null,
      nextLesson: idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null,
    };
  }, [selectedChapter, flatLessons]);

  const { completedCount, totalCount } = useMemo(() => {
    const total = flatLessons.length;
    const completed = flatLessons.filter((l) => l.completed).length;
    return { completedCount: completed, totalCount: total };
  }, [flatLessons]);

  const currentLesson = selectedLesson;

  const currentChapter = useMemo(
    () => course?.chapters?.find((c) => chapterLessons[c.id]?.some((l) => l.id === selectedChapter)),
    [course?.chapters, chapterLessons, selectedChapter]
  );

  const tocItems = useMemo(() => {
    if (showOverview || !currentLesson?.content) return [];
    const cleaned = currentLesson.content.replace(/^\s*#\s+[^\n]+\n*/, "").trim();
    return extractHeadings(cleaned);
  }, [showOverview, currentLesson?.content]);

  const isCurrentLessonCompleted = useMemo(() => {
    const lessonId = selectedChapter;
    if (!lessonId) return false;
    for (const lessons of Object.values(chapterLessons)) {
      const found = lessons.find((l) => l.id === lessonId);
      if (found) return !!found.completed;
    }
    return false;
  }, [selectedChapter, chapterLessons]);

  const handleToggleComplete = useCallback(async () => {
    const lessonId = selectedChapter;
    if (!lessonId) return;

    let isCompleted = false;
    let targetChapterId = "";
    for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
      const found = lessons.find((l) => l.id === lessonId);
      if (found) {
        isCompleted = !!found.completed;
        targetChapterId = chapterId;
        break;
      }
    }

    const nextCompletedState = !isCompleted;

    try {
      await lessonApi.updateProgress({
        lessonId,
        completed: nextCompletedState,
      });

      setChapterLessons((prev) => {
        const updated = { ...prev };
        if (updated[targetChapterId]) {
          updated[targetChapterId] = updated[targetChapterId].map((l) =>
            l.id === lessonId ? { ...l, completed: nextCompletedState } : l
          );
        }
        return updated;
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      toast.error("Không thể cập nhật tiến độ bài học");
    }
  }, [selectedChapter, chapterLessons]);

  const handleAutoComplete = useCallback(async () => {
    const lessonId = selectedChapter;
    if (!lessonId) return;

    let isCompleted = false;
    let targetChapterId = "";
    for (const [chapterId, lessons] of Object.entries(chapterLessons)) {
      const found = lessons.find((l) => l.id === lessonId);
      if (found) {
        isCompleted = !!found.completed;
        targetChapterId = chapterId;
        break;
      }
    }

    if (isCompleted) return;

    try {
      await lessonApi.updateProgress({
        lessonId,
        completed: true,
      });

      setChapterLessons((prev) => {
        const updated = { ...prev };
        if (updated[targetChapterId]) {
          updated[targetChapterId] = updated[targetChapterId].map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          );
        }
        return updated;
      });
    } catch (error) {
      console.error("Error auto updating lesson progress:", error);
    }
  }, [selectedChapter, chapterLessons]);

  const handleToggleFavorite = async () => {
    if (!course?.id) return;
    setFavoriteLoading(true);
    try {
      const result = await favoriteService.toggle({
        targetId: course.id,
        targetType: FavoriteTargetType.COURSE,
      });
      if (result.code === 200) {
        setIsFavorite(result.data ?? false);
        toast.success(
          result.data ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích"
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Không thể cập nhật danh sách yêu thích");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (isLoadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-primary border-t-transparent mx-auto mb-3.5" />
          <p className="text-text-muted text-sm font-medium">Đang tải nội dung bài học...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <DocsHeader showMenuButton={false} onMenuClick={() => {}} />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center p-8 rounded-2xl border border-border bg-surface shadow-sm">
            <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-text-muted text-sm mb-6">
              Bạn cần đăng nhập để xem nội dung khóa học và tài liệu này.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const target =
                    typeof window !== "undefined"
                      ? window.location.pathname + window.location.search
                      : `/docs/${slug}`;
                  router.push(`/login?redirect=${encodeURIComponent(target)}`);
                }}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 text-white font-semibold rounded-full shadow-sm transition-all text-sm cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  const target =
                    typeof window !== "undefined"
                      ? window.location.pathname + window.location.search
                      : `/docs/${slug}`;
                  router.push(`/register?redirect=${encodeURIComponent(target)}`);
                }}
                className="px-6 py-2.5 bg-surface border border-border text-foreground hover:text-primary hover:bg-primary-soft/50 font-semibold rounded-full transition-all text-sm cursor-pointer"
              >
                Đăng ký tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <DocsHeader />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="text-center p-8 rounded-2xl border border-border bg-surface shadow-sm max-w-md w-full">
            <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-muted">
              <FileQuestion className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Không tìm thấy khóa học</h3>
            <p className="text-text-muted text-sm mb-6">
              Khóa học này không tồn tại hoặc đã bị xóa khỏi hệ thống.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canAccessCurrentLesson = Boolean(
    currentLesson && currentLesson.canAccess !== false
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DocsHeader
        showMenuButton={true}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        course={course}
        onOverviewClick={handleOverviewClick}
        showOverview={showOverview}
        isFavorite={isFavorite}
        favoriteLoading={favoriteLoading}
        onToggleFavorite={handleToggleFavorite}
        completedCount={completedCount}
        totalCount={totalCount}
        canAccessLesson={canAccessCurrentLesson}
        onOpenAi={() => setDrawerState({ isOpen: true, tab: "ai" })}
        onOpenNotes={() => setDrawerState({ isOpen: true, tab: "notes" })}
      />

      <div className="flex w-full min-h-[calc(100vh-3.75rem)]">
        <DocsSidebar
          categories={categories}
          openCategories={openCategories}
          onCategoryToggle={handleCategoryToggle}
          onOverviewClick={handleOverviewClick}
          onLessonClick={handleLessonClick}
          onBackClick={() => router.push("/courses")}
          isOpen={isSidebarOpen}
          loadedChapters={loadedChapters}
          selectedLessonId={selectedChapter}
          showOverview={showOverview}
        />

        <main className="flex-1 min-w-0 bg-surface transition-opacity duration-200">
          {showOverview ? (
            <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 animate-in fade-in duration-300">
              <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-muted mb-5">
                <Link href="/courses" className="hover:text-primary transition-colors">
                  Khóa học
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-border shrink-0" />
                <span className="text-foreground font-semibold truncate" title={course.title || ""}>
                  {course.title || ""}
                </span>
              </nav>

              <CourseOverview
                course={{ ...course, isEnrolled: hasAccess }}
                chapterLessons={chapterLessons}
                onLessonClick={handleLessonClick}
                onEnrollClick={handleEnrollClick}
                selectedLessonId={selectedChapter}
                isFavorite={isFavorite}
                favoriteLoading={favoriteLoading}
                onToggleFavorite={handleToggleFavorite}
              />

              <div className="mt-10 pt-8 border-t border-border space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Đánh giá khóa học
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted">
                    Ý kiến và đánh giá từ những học viên tham gia học tập
                  </p>
                </div>
                <ReviewSection courseId={course.id} isEnrolled={hasAccess} />
              </div>
            </div>
          ) : isLoadingLesson ? (
            <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-8 lg:py-10 animate-pulse">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-4 bg-border rounded w-20" />
                <div className="h-4 bg-border rounded w-4" />
                <div className="h-4 bg-border rounded w-32" />
                <div className="h-4 bg-border rounded w-4" />
                <div className="h-4 bg-border rounded w-40" />
              </div>

              <div className="mb-8 pb-6 border-b border-border">
                <div className="h-9 bg-border rounded-lg w-3/4 mb-4" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="h-4 bg-border rounded w-24" />
                  <div className="h-4 bg-border rounded w-32" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-border rounded w-full" />
                <div className="h-4 bg-border rounded w-5/6" />
                <div className="h-4 bg-border rounded w-4/6" />
                <div className="h-4 bg-border rounded w-full" />
                <div className="h-4 bg-border rounded w-3/4" />
                <div className="h-4 bg-border rounded w-5/6" />
                <div className="h-4 bg-border rounded w-2/3" />
              </div>
            </div>
          ) : (
            <div key={currentLesson?.id || "overview"} className="animate-in fade-in duration-300">
              <DocsArticle
                title={currentLesson?.lessonName || course.title || ""}
                description={currentLesson?.description || ""}
                readTime="15 phút đọc"
                lastUpdated={formatDate(course.updatedAt || course.createdAt || "")}
                content={currentLesson?.content || ""}
                lessonId={currentLesson?.id}
                canAccess={currentLesson?.canAccess}
                isFreePreview={currentLesson?.isFreePreview}
                courseSlug={course.slug}
                coursePrice={course.price}
                onEnrollClick={handleEnrollClick}
                isEnrollingFree={isEnrollingFree}
                completed={isCurrentLessonCompleted}
                onToggleComplete={handleToggleComplete}
                onAutoComplete={handleAutoComplete}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                onNavigateLesson={handleLessonClick}
                drawerState={drawerState}
                onOpenDrawer={(tab) => setDrawerState({ isOpen: true, tab })}
                onCloseDrawer={() => setDrawerState((prev) => ({ ...prev, isOpen: false }))}
                breadcrumbs={[
                  { label: "Khóa học", href: "/courses" },
                  { label: course.title, onClick: handleOverviewClick },
                  ...(currentChapter ? [{ label: currentChapter.chapterName }] : []),
                  ...(currentLesson ? [{ label: currentLesson.lessonName }] : []),
                ]}
              />
            </div>
          )}
        </main>

        <DocsTableOfContents
          items={tocItems}
          showTools={!showOverview && canAccessCurrentLesson}
          onOpenAi={() => setDrawerState({ isOpen: true, tab: "ai" })}
          onOpenNotes={() => setDrawerState({ isOpen: true, tab: "notes" })}
        />
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <CourseUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        courseTitle={course.title || ""}
        coursePrice={course.price}
        onBuySingleCourse={async () => {
          setUnlockModalOpen(false);
          await handlePayment();
        }}
        isCreatingPayment={createPaymentMutation.isPending}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        isLoading={paymentModal.isLoading}
        data={paymentModal.data}
        courseTitle={course.title || ""}
        onClose={() => setPaymentModal({ isOpen: false, isLoading: false, data: null })}
      />

      <AuthRequiredModal
        isOpen={authModal.isOpen}
        title={authModal.title}
        message={authModal.message}
        redirectTo={`/docs/${slug}`}
        onClose={() => setAuthModal({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
}
