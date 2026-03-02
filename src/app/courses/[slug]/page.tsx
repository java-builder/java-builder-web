"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { courseApi, lessonApi } from "@/services/course.service";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { paymentApi } from "@/services/payment.service";
import { CreatePaymentResponse } from "@/types/payment";
import { CourseDetailResponse, CourseLevel, LessonDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import toast from "react-hot-toast";
import ReviewSection from "@/components/courses/ReviewSection";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseTabs from "@/components/courses/CourseTabs";
import CourseCurriculum from "@/components/courses/CourseCurriculum";
import CourseInstructor from "@/components/courses/CourseInstructor";
import CourseSidebar from "@/components/courses/CourseSidebar";
import VideoPreviewModal from "@/components/courses/VideoPreviewModal";
import PaymentModal from "@/components/courses/PaymentModal";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: currentUser } = useCurrentUser();

  usePaymentWebSocket(slug);

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "description" | "comments" | "curriculum" | "instructor"
  >("curriculum");

  const hasFetched = useRef(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
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
          setIsPremiumUser(courseData.isPremiumUser ?? false);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để yêu thích",
        message: "Bạn cần đăng nhập để thêm khóa học vào danh sách yêu thích.",
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
        toast.success(result.data ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
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
        title: "Đăng nhập để xem video miễn phí",
        message: "Bạn cần đăng nhập để xem các video miễn phí trong khóa học này.",
      });
      return;
    }

    if (isEnrolled || isPremiumUser || lesson.isFreePreview) {
      // If course format is TEXT, redirect to docs page
      if (course?.courseFormat === "TEXT") {
        window.location.href = `/docs/${course.slug}?lessonId=${lesson.id}`;
        return;
      }

      // Otherwise, show video modal
      try {
        const response = await lessonApi.getById(lesson.id);
        if (response.data) {
          setPreviewModal({ isOpen: true, lesson: response.data });
        }
      } catch {
        toast.error("Không thể xem bài học này");
      }
    } else {
      toast.error("Vui lòng đăng ký khóa học để xem bài học này");
    }
  };

  const handlePayment = async () => {
    if (!course?.id) return;
    if (!currentUser) {
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để đăng ký",
        message: "Bạn cần đăng nhập để đăng ký khóa học này.",
      });
      return;
    }

    setPaymentModal({ isOpen: true, isLoading: true, data: null });

    try {
      const result = await paymentApi.createPaymentLink(course.id);
      if (result.code === 201 && result.data) {
        setPaymentModal({ isOpen: true, isLoading: false, data: result.data });
      } else {
        toast.error("Không thể tạo link thanh toán");
        setPaymentModal({ isOpen: false, isLoading: false, data: null });
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      setPaymentModal({ isOpen: false, isLoading: false, data: null });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
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

      return date.toLocaleDateString("vi-VN", {
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
        return "Cơ bản";
      case CourseLevel.INTERMEDIATE:
        return "Trung cấp";
      case CourseLevel.ADVANCED:
        return "Nâng cao";
      default:
        return level;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
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
        <Header />
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
              Không tìm thấy khóa học
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Khóa học không tồn tại hoặc đã bị xóa."}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-400 transition-colors"
            >
              Trang chủ
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
              Khóa học
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
                      isPremiumUser={isPremiumUser}
                      onToggleChapter={toggleChapter}
                      onLessonClick={handleLessonClick}
                    />
                  )}

                  {activeTab === "instructor" && <CourseInstructor />}

                  {activeTab === "comments" && (
                    <ReviewSection
                      courseId={course?.id || ""}
                      isEnrolled={isEnrolled}
                      isPremiumUser={isPremiumUser}
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
              isPremiumUser={isPremiumUser}
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
        isPremiumUser={isPremiumUser}
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

      <Footer />
    </div>
  );
}
