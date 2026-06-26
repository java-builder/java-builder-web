"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import RateLimitModal from "@/components/ui/RateLimitModal";
import { courseApi, lessonApi } from "@/services/course.service";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { paymentApi } from "@/services/payment.service";
import { CreatePaymentResponse } from "@/types/payment";
import { CourseDetailResponse, CourseLevel, LessonDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import { isRateLimitError } from "@/utils/apiError";
import toast from "react-hot-toast";
import ReviewSection from "@/components/courses/ReviewSection";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseTabs from "@/components/courses/CourseTabs";
import CourseCurriculum from "@/components/courses/CourseCurriculum";
import CourseInstructor from "@/components/courses/CourseInstructor";
import CourseSidebar from "@/components/courses/CourseSidebar";
import VideoPreviewModal from "@/components/courses/VideoPreviewModal";
import PaymentModal from "@/components/courses/PaymentModal";
import { useI18n } from "@/contexts/I18nContext";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: currentUser } = useCurrentUser();
  const { locale, t } = useI18n();

  usePaymentWebSocket(slug);

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "description" | "comments" | "curriculum" | "instructor"
  >("curriculum");

  const hasFetched = useRef(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadingLessons, setLoadingLessons] = useState<Set<string>>(new Set());

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
  const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false);

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
          setIsEnrolled(courseData.isEnrolled ?? false);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t("courseDetail.loadError");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, t]);

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
        targetType: FavoriteTargetType.COURSE
      });
      if (result.code === 200) {
        setIsFavorite(result.data ?? false);
        toast.success(result.data ? t("courseDetail.addedFavorite") : t("courseDetail.removedFavorite"));
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

  const fetchLessons = async (chapterId: string) => {
    setLoadingLessons(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.data) {
        setChapterLessons(prev => ({ ...prev, [chapterId]: response.data || [] }));
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoadingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
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
    } catch (error) {
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
      if (isRateLimitError(error)) {
        setRateLimitModalOpen(true);
        return;
      }
      toast.error(t("courseDetail.genericError"));
    }
  };

  const formatPrice = (price: number) => {
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
        parseInt(second),
      );

      return date.toLocaleDateString(locale === "vi" ? "vi-VN" : locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("courseDetail.notFoundTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || t("courseDetail.notFoundMessage")}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {t("courseDetail.backToCourses")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-400 transition-colors"
            >
              {t("common.home")}
            </Link>
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/courses"
              className="text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-400 transition-colors"
            >
              {t("common.courses")}
            </Link>
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
              <CourseHeader
                course={course}
                formatDate={formatDate}
                getLevelText={getLevelText}
              />

              <div className="p-6">
                <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="min-h-[300px]">
                  {activeTab === "description" && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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

                  {activeTab === "instructor" && <CourseInstructor />}

                  {activeTab === "comments" && (
                    <ReviewSection
                      courseId={course?.id || ""}
                      isEnrolled={isEnrolled}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              course={course}
              isEnrolled={isEnrolled}
              isFavorite={isFavorite}
              favoriteLoading={favoriteLoading}
              onPayment={handlePayment}
              onToggleFavorite={handleToggleFavorite}
              formatPrice={formatPrice}
              getLevelText={getLevelText}
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
          handlePayment();
        }}
      />

      <PaymentModal
        isOpen={paymentModal.isOpen}
        isLoading={paymentModal.isLoading}
        data={paymentModal.data}
        courseTitle={course?.title || ""}
        onClose={() => setPaymentModal({ isOpen: false, isLoading: false, data: null })}
      />

      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
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
