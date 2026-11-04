"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthRequiredModal from "@/components/ui/auth-required-modal";
import RateLimitModal from "@/components/ui/rate-limit-modal";
import { courseApi, lessonApi } from "@/services/course.service";
import { enrollmentApi } from "@/services/enrollment.service";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { paymentApi } from "@/services/payment.service";
import { CreatePaymentResponse } from "@/types/payment";
import {
  CourseDetailResponse,
  CourseLevel,
  CourseFormat,
  LessonDetailResponse,
} from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import { isRateLimitError } from "@/utils/apiError";
import { useReviews } from "@/hooks/useReviews";
import toast from "react-hot-toast";
import ReviewSection from "@/components/courses/ReviewSection";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseTabs from "@/components/courses/CourseTabs";
import CourseCurriculum from "@/components/courses/CourseCurriculum";
import CourseInstructor from "@/components/courses/CourseInstructor";
import CourseSidebar from "@/components/courses/CourseSidebar";
import VideoPreviewModal from "@/components/courses/VideoPreviewModal";
import PaymentModal from "@/components/courses/PaymentModal";
import CourseUnlockModal from "@/components/courses/CourseUnlockModal";
import { useI18n } from "@/contexts/I18nContext";
import { FileQuestion } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { data: currentUser } = useCurrentUser();
  const { locale, t } = useI18n();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  usePaymentWebSocket(course?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "description" | "curriculum" | "instructor"
  >("curriculum");

  const hasFetched = useRef(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [chapterLessons, setChapterLessons] = useState<
    Record<string, LessonDetailResponse[]>
  >({});
  const [loadingLessons, setLoadingLessons] = useState<Set<string>>(new Set());

  const { reviews, totalReviews } = useReviews(course?.id || "");
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 5;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    lesson: LessonDetailResponse | null;
  }>({
    isOpen: false,
    lesson: null,
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

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
  const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false);

  const fetchLessons = useCallback(async (chapterId: string) => {
    setLoadingLessons((prev) => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.data) {
        setChapterLessons((prev) => ({
          ...prev,
          [chapterId]: response.data || [],
        }));
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoadingLessons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  }, []);

  useEffect(() => {
    if (!slug || hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await courseApi.getBySlug(slug);
        if (result.code === 200 && result.data) {
          const courseData = result.data;
          setCourse(courseData);
          setIsFavorite(courseData.isFavorite ?? false);
          setIsEnrolled(
            Boolean(courseData.isEnrolled || courseData.isPremiumUser)
          );

          if (courseData.chapters && courseData.chapters.length > 0) {
            const firstChapterId = courseData.chapters[0].id;
            setExpandedChapters(new Set([firstChapterId]));
            fetchLessons(firstChapterId);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t("courseDetail.loadError");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, t, fetchLessons]);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      setIsEnrolled(true);
      setUnlockModalOpen(false);
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      setCourse((prev) =>
        prev ? { ...prev, isEnrolled: true, isPremiumUser: true } : null
      );
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => {
      window.removeEventListener("payment:success", handlePaymentSuccess);
    };
  }, []);

  const handleToggleFavorite = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: t("courseDetail.favoriteLoginTitle"),
        message: t("courseDetail.favoriteLoginMessage"),
      });
      return;
    }

    setFavoriteLoading(true);
    try {
      const result = await favoriteService.toggle({
        targetId: course.id,
        targetType: FavoriteTargetType.COURSE,
      });
      if (result.code === 200) {
        setIsFavorite(result.data ?? false);
        toast.success(
          result.data
            ? t("courseDetail.addedFavorite")
            : t("courseDetail.removedFavorite")
        );
      }
    } catch {
      toast.error(t("courseDetail.genericError"));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const toggleChapter = async (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
      if (!chapterLessons[chapterId]) {
        await fetchLessons(chapterId);
      }
    }
    setExpandedChapters(newExpanded);
  };

  const handleLessonClick = async (lesson: LessonDetailResponse) => {
    if (!currentUser && lesson.isFreePreview) {
      setAuthModal({
        isOpen: true,
        title: t("courseDetail.freePreviewLoginTitle"),
        message: t("courseDetail.freePreviewLoginMessage"),
      });
      return;
    }

    if (isEnrolled || lesson.isFreePreview) {
      if (course?.courseFormat === "TEXT") {
        window.location.href = `/docs/${course.slug}?lessonId=${lesson.id}`;
        return;
      }

      try {
        const response = await lessonApi.getById(lesson.id);
        if (response.data) {
          setPreviewModal({ isOpen: true, lesson: response.data });
        }
      } catch {
        toast.error(t("courseDetail.lessonUnavailable"));
      }
    } else {
      toast.error(t("courseDetail.enrollToWatch"));
    }
  };

  const handleOpenUnlockModal = () => {
    if (!course?.price || course.price === 0) {
      handleEnrollFree();
      return;
    }
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: t("courseDetail.enrollLoginTitle"),
        message: t("courseDetail.enrollLoginMessage"),
      });
      return;
    }
    setUnlockModalOpen(true);
  };

  const handlePayment = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: t("courseDetail.enrollLoginTitle"),
        message: t("courseDetail.enrollLoginMessage"),
      });
      return;
    }

    setPaymentModal({ isOpen: true, isLoading: true, data: null });

    try {
      const result = await paymentApi.createPaymentLink(course.id);
      if (result.code === 201 && result.data) {
        setPaymentModal({ isOpen: true, isLoading: false, data: result.data });
      } else {
        toast.error(t("courseDetail.paymentLinkError"));
        setPaymentModal({ isOpen: false, isLoading: false, data: null });
      }
    } catch (err) {
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      if (isRateLimitError(err)) {
        setRateLimitModalOpen(true);
        return;
      }
      toast.error(t("courseDetail.genericError"));
    }
  };

  const [isEnrollingFree, setIsEnrollingFree] = useState(false);

  const handleEnrollFree = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: t("courseDetail.enrollLoginTitle"),
        message: t("courseDetail.enrollLoginMessage"),
      });
      return;
    }

    setIsEnrollingFree(true);
    try {
      const result = await enrollmentApi.enrollFreeCourse(course.id);
      if (result.code === 200) {
        setIsEnrolled(true);
        const targetUrl =
          course.courseFormat === CourseFormat.TEXT
            ? `/docs/${course.slug}`
            : `/learn/${course.slug}/${course.id}`;
        router.push(targetUrl);
      } else {
        toast.error(result.message || t("courseDetail.genericError"));
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : t("courseDetail.genericError");
      toast.error(errorMsg);
    } finally {
      setIsEnrollingFree(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "0 đ";
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : locale, {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("-");
      const [hour, minute, second] = timePart.split(":");

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );

      return date.toLocaleDateString(locale === "vi" ? "vi-VN" : locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getLevelText = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return t("courseDetail.beginner");
      case CourseLevel.INTERMEDIATE:
        return t("courseDetail.intermediate");
      case CourseLevel.ADVANCED:
        return t("courseDetail.advanced");
      default:
        return level;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-primary border-t-transparent mx-auto mb-3.5" />
          <p className="text-text-muted text-sm font-medium">
            Đang tải thông tin khóa học...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center p-8 rounded-2xl border border-border bg-surface shadow-xs max-w-md w-full">
          <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-muted">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            {t("courseDetail.notFoundTitle")}
          </h2>
          <p className="text-text-muted text-sm mb-6">
            {error || t("courseDetail.notFoundMessage")}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-full transition-colors"
          >
            {t("courseDetail.backToCourses")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl overflow-hidden border border-border shadow-2xs">
              <CourseHeader
                course={course}
                formatDate={formatDate}
                getLevelText={getLevelText}
              />

              <div className="p-6">
                <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="min-h-[260px]">
                  {activeTab === "description" && (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-text-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                        {course.description}
                      </p>
                    </div>
                  )}

                  {activeTab === "curriculum" && (
                    <CourseCurriculum
                      chapters={course.chapters || []}
                      expandedChapters={expandedChapters}
                      chapterLessons={chapterLessons}
                      loadingLessons={loadingLessons}
                      isEnrolled={isEnrolled}
                      onToggleChapter={toggleChapter}
                      onLessonClick={handleLessonClick}
                    />
                  )}

                  {activeTab === "instructor" && (
                    <CourseInstructor instructor={course.instructor} />
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-2xs space-y-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Đánh giá khóa học
                </h2>
                <p className="text-xs sm:text-sm text-text-muted">
                  Ý kiến và đánh giá từ những học viên tham gia học tập
                </p>
              </div>
              <ReviewSection
                courseId={course?.id || ""}
                isEnrolled={isEnrolled}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              course={course}
              isEnrolled={isEnrolled}
              isFavorite={isFavorite}
              favoriteLoading={favoriteLoading}
              isEnrollingFree={isEnrollingFree}
              onPayment={handleOpenUnlockModal}
              onEnrollFree={handleEnrollFree}
              onToggleFavorite={handleToggleFavorite}
              formatPrice={formatPrice}
              getLevelText={getLevelText}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
        </div>
      </div>

      <VideoPreviewModal
        isOpen={previewModal.isOpen}
        lesson={previewModal.lesson}
        isEnrolled={isEnrolled}
        onClose={() => setPreviewModal({ isOpen: false, lesson: null })}
        onEnroll={() => {
          setPreviewModal({ isOpen: false, lesson: null });
          handleOpenUnlockModal();
        }}
      />

      <CourseUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        courseTitle={course?.title || ""}
        coursePrice={course?.price}
        onBuySingleCourse={async () => {
          setUnlockModalOpen(false);
          await handlePayment();
        }}
        isCreatingPayment={paymentModal.isLoading}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        isLoading={paymentModal.isLoading}
        data={paymentModal.data}
        courseTitle={course?.title || ""}
        onClose={() =>
          setPaymentModal({ isOpen: false, isLoading: false, data: null })
        }
      />

      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        redirectTo={`/courses/${slug}`}
        title={authModal.title}
        message={authModal.message}
      />

      <RateLimitModal
        isOpen={rateLimitModalOpen}
        onClose={() => setRateLimitModalOpen(false)}
      />
    </div>
  );
}
