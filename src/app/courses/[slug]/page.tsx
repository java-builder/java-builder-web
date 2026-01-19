"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import VideoPlayer from "@/components/VideoPlayer";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import ReviewSection from "@/components/course/ReviewSection";
import { courseApi, lessonApi, favoriteApi } from "@/services/course.service";
import { paymentApi } from "@/services/payment.service";
import { CreatePaymentResponse } from "@/types/payment";
import { CourseDetailResponse, CourseLevel, LessonDetailResponse } from "@/types/course";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

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

  // Prevent duplicate API calls
  const hasFetched = useRef(false);

  // Enrollment state
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Premium user state
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Curriculum state
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [chapterLessons, setChapterLessons] = useState<Record<string, LessonDetailResponse[]>>({});
  const [loadingLessons, setLoadingLessons] = useState<Set<string>>(new Set());

  // Video preview modal
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    lesson: LessonDetailResponse | null;
  }>({
    isOpen: false,
    lesson: null,
  });

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Auth required modal
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Payment modal state
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
        // Fetch course detail (includes isFavorite, isEnrolled, isPremiumUser)
        const result = await courseApi.getBySlug(slug);
        if (result.code === 200 && result.result) {
          setCourse(result.result);
          // Set user-specific states from response
          setIsFavorite(result.result.isFavorite ?? false);
          setIsEnrolled(result.result.isEnrolled ?? false);
          setIsPremiumUser(result.result.isPremiumUser ?? false);
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

  // Toggle favorite handler
  const handleToggleFavorite = async () => {
    if (!course?.id) return;

    // Check if user is logged in
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
      const result = await favoriteApi.toggle(course.id);
      if (result.code === 200) {
        setIsFavorite(result.result ?? false);
        toast.success(result.result ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Toggle chapter expand and load lessons
  const toggleChapter = async (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
      // Load lessons if not loaded yet
      if (!chapterLessons[chapterId]) {
        await fetchLessons(chapterId);
      }
    }
    setExpandedChapters(newExpanded);
  };

  // Fetch lessons for a chapter
  const fetchLessons = async (chapterId: string) => {
    setLoadingLessons(prev => new Set(prev).add(chapterId));
    try {
      const response = await lessonApi.getByChapterId(chapterId);
      if (response.result) {
        setChapterLessons(prev => ({ ...prev, [chapterId]: response.result || [] }));
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
    if (isEnrolled || isPremiumUser || lesson.isFreePreview) {
      try {
        const response = await lessonApi.getById(lesson.id);
        if (response.result) {
          setPreviewModal({ isOpen: true, lesson: response.result });
        }
      } catch {
        toast.error("Không thể xem bài học này");
      }
    } else {
      toast.error("Vui lòng đăng ký khóa học để xem bài học này");
    }
  };

  // Handle payment
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
      if (result.code === 201 && result.result) {
        setPaymentModal({ isOpen: true, isLoading: false, data: result.result });
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

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return "bg-accent-100 text-accent-800";
      case CourseLevel.INTERMEDIATE:
        return "bg-accent-100 text-accent-800";
      case CourseLevel.ADVANCED:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy khóa học
            </h2>
            <p className="text-gray-600 mb-6">
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              Trang chủ
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
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
              className="text-gray-500 hover:text-accent transition-colors"
            >
              Khóa học
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
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
            <span className="text-gray-900 font-medium">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <MotionWrapper animation="fadeInUp" duration={0.6}>
              <div className="bg-white rounded-xl overflow-hidden">
                {/* Course Cover */}
                <div className="relative aspect-video overflow-hidden">
                  {course.courseCover ? (
                    <Image
                      src={course.courseCover}
                      alt={course.title}
                      fill
                      priority
                      className="object-contain bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg
                          className="w-16 h-16 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <p className="text-lg font-medium">Khóa học</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {course.title}
                      </h1>

                      <div className="flex items-center space-x-3 mb-4">
                        {course.level && (
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}
                          >
                            {getLevelText(course.level)}
                          </span>
                        )}
                        {course.duration && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            {course.duration} giờ
                          </span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs font-medium">
                          {formatDate(course.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
                      <button
                        onClick={() => setActiveTab("curriculum")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "curriculum"
                          ? "border-accent text-accent-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        Nội dung
                      </button>
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "description"
                          ? "border-accent text-accent-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        Mô tả
                      </button>
                      <button
                        onClick={() => setActiveTab("instructor")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "instructor"
                          ? "border-accent text-accent-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        Tác giả
                      </button>
                      <button
                        onClick={() => setActiveTab("comments")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "comments"
                          ? "border-accent text-accent-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                      >
                        Đánh giá
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    {activeTab === "description" && (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {course.description}
                        </p>
                      </div>
                    )}

                    {activeTab === "curriculum" && (
                      <div className="space-y-3">
                        {course.chapters && course.chapters.length > 0 ? (
                          course.chapters.map((chapter, index) => (
                            <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              {/* Chapter Header */}
                              <div
                                className="flex items-start sm:items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors gap-2"
                                onClick={() => toggleChapter(chapter.id)}
                              >
                                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 mt-0.5 sm:mt-0 ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                                    <span className="text-xs sm:text-sm font-medium text-gray-500 flex-shrink-0">Chương {index + 1}</span>
                                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{chapter.chapterName}</span>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {chapterLessons[chapter.id] ? `${chapterLessons[chapter.id].length} bài` : ""}
                                </span>
                              </div>

                              {/* Lessons List */}
                              {expandedChapters.has(chapter.id) && (
                                <div className="border-t border-gray-200">
                                  {chapter.description && (
                                    <p className="text-sm text-gray-600 px-3 sm:px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                                      {chapter.description}
                                    </p>
                                  )}
                                  <div className="divide-y divide-gray-100">
                                    {loadingLessons.has(chapter.id) ? (
                                      <div className="px-3 sm:px-4 py-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang tải...
                                      </div>
                                    ) : chapterLessons[chapter.id] && chapterLessons[chapter.id].length > 0 ? (
                                      chapterLessons[chapter.id].map((lesson, lessonIndex) => {
                                        const canWatch = isEnrolled || isPremiumUser || lesson.isFreePreview;
                                        return (
                                          <div
                                            key={lesson.id}
                                            className={`flex items-start sm:items-center justify-between px-3 sm:px-4 py-3 transition-colors gap-2 ${canWatch
                                              ? "hover:bg-accent-50 cursor-pointer group"
                                              : "bg-gray-50/30"
                                              }`}
                                            onClick={() => handleLessonClick(lesson)}
                                          >
                                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                              <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold flex-shrink-0 ${canWatch
                                                ? "bg-accent/10 text-accent"
                                                : "bg-gray-100 text-gray-400"
                                                } transition-colors`}>
                                                {lessonIndex + 1}
                                              </span>
                                              <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                  <span className={`text-sm ${canWatch
                                                    ? "text-gray-900 group-hover:text-accent"
                                                    : "text-gray-500"
                                                    } transition-colors break-words`}>
                                                    {lesson.lessonName}
                                                  </span>
                                                  {lesson.isFreePreview && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full flex-shrink-0">
                                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                      </svg>
                                                      Xem miễn phí
                                                    </span>
                                                  )}
                                                </div>
                                                {lesson.videoUrl && (
                                                  <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Video
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                              {canWatch ? (
                                                <svg className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M8 5v14l11-7z" />
                                                </svg>
                                              ) : (
                                                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="px-3 sm:px-4 py-6 text-center text-gray-400 text-sm">
                                        Chưa có bài học nào
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                              <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Chưa có nội dung
                            </h3>
                            <p className="text-gray-600">
                              Nội dung khóa học đang được cập nhật
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "instructor" && (
                      <div className="space-y-6">
                        {/* Instructor Profile */}
                        <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white">
                            <Image
                              src="/logos/java-logo.png"
                              alt="JavaBuilder"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              JavaBuilder
                            </h3>
                            <p className="text-accent-600 font-medium mb-2">
                              Backend Developer
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Chuyên gia phát triển backend với kinh nghiệm sâu
                              về Java, Spring Boot và các công nghệ cloud. Tôi
                              đam mê chia sẻ kiến thức và giúp đỡ các bạn trẻ
                              phát triển kỹ năng lập trình backend.
                            </p>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Kỹ năng chuyên môn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Java",
                              "Spring Boot",
                              "Docker",
                              "PostgreSQL",
                              "MongoDB",
                              "AWS",
                              "Kubernetes",
                            ].map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="p-4 bg-accent-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Liên hệ với giảng viên
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Có câu hỏi về khóa học? Hãy liên hệ trực tiếp với
                            tôi!
                          </p>
                          <button className="bg-accent hover:bg-accent-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm">
                            Gửi tin nhắn
                          </button>
                        </div>
                      </div>
                    )}

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
            </MotionWrapper>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
              <div className="bg-white rounded-xl p-5 sticky top-8">
                {/* Price / Enrolled Status */}
                <div className="text-center mb-5">
                  {isEnrolled || isPremiumUser ? (
                    <>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${isPremiumUser && !isEnrolled
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                        }`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">
                          {isPremiumUser && !isEnrolled ? "Premium Member" : "Đã đăng ký"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isPremiumUser && !isEnrolled
                          ? "Bạn có quyền truy cập với tư cách Premium"
                          : "Bạn có quyền truy cập đầy đủ khóa học này"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-accent mb-2">
                        {formatPrice(course.price)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Một lần thanh toán, học mãi mãi
                      </p>
                    </>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 mb-6">
                  {isEnrolled || isPremiumUser ? (
                    <Link
                      href={`/learn/${course.slug}/${course.id}`}
                      className="w-full bg-accent hover:bg-accent-600 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Học ngay
                    </Link>
                  ) : (
                    <button
                      onClick={handlePayment}
                      className="w-full bg-accent hover:bg-accent-600 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      Đăng ký ngay
                    </button>
                  )}
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-full font-medium py-2.5 px-4 rounded-md border transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${isFavorite
                      ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {favoriteLoading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill={isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    <span>{isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}</span>
                  </button>
                </div>

                {/* Course Stats */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    Thông tin khóa học
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trình độ:</span>
                      <span className="font-medium text-gray-900">
                        {getLevelText(course.level || CourseLevel.BEGINNER)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span className="font-medium text-gray-900">
                        {course.duration || 0} giờ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Đánh giá:</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(0)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewModal.isOpen && previewModal.lesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewModal({ isOpen: false, lesson: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{previewModal.lesson.lessonName}</h3>
                {isPremiumUser && !isEnrolled ? (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                    Premium Member
                  </span>
                ) : isEnrolled ? (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    Đã đăng ký
                  </span>
                ) : (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    Xem miễn phí
                  </span>
                )}
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, lesson: null })}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="bg-black">
              {previewModal.lesson.videoUrl ? (
                <VideoPlayer
                  src={previewModal.lesson.videoUrl}
                  autoPlay
                  className="w-full"
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-900">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Chưa có video cho bài học này</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {previewModal.lesson.description && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả bài học</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{previewModal.lesson.description}</p>
              </div>
            )}

            {/* CTA - Only show if not enrolled and not premium */}
            {!isEnrolled && !isPremiumUser && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-accent-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    Đăng ký khóa học để xem tất cả bài học
                  </p>
                  <button
                    onClick={() => {
                      setPreviewModal({ isOpen: false, lesson: null });
                      handlePayment();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !paymentModal.isLoading && setPaymentModal({ isOpen: false, isLoading: false, data: null })}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-accent to-accent-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Thanh toán khóa học</h3>
                    <p className="text-white/70 text-sm">Quét mã QR hoặc chuyển khoản</p>
                  </div>
                </div>
                {!paymentModal.isLoading && (
                  <button
                    onClick={() => setPaymentModal({ isOpen: false, isLoading: false, data: null })}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentModal.isLoading ? (
                <div className="text-center py-12">
                  {/* Professional spinner with multiple rings */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
                    {/* Middle spinning ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent border-r-accent animate-spin"></div>
                    {/* Inner pulsing dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">Đang tạo mã thanh toán</p>
                  <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát...</p>
                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : paymentModal.data ? (
                <div>
                  {/* Course Info */}
                  <div className="text-center mb-5">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{course?.title}</h4>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-xl font-bold text-accent">
                        {new Intl.NumberFormat("vi-VN").format(paymentModal.data.totalPrice)}đ
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Chờ thanh toán
                      </span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  {paymentModal.data.qrCode && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <QRCodeSVG
                          value={paymentModal.data.qrCode}
                          size={200}
                          level="M"
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
                    <span className="text-sm text-gray-500">Mã đơn hàng</span>
                    <span className="font-mono font-semibold text-gray-900">{paymentModal.data.orderCode}</span>
                  </div>

                  {/* Checkout Button */}
                  {paymentModal.data.checkoutUrl && (
                    <a
                      href={paymentModal.data.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Thanh toán qua PayOS
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Footer Note */}
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Thanh toán được bảo mật bởi PayOS. Khóa học sẽ được kích hoạt tự động sau khi thanh toán thành công.</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        title={authModal.title}
        message={authModal.message}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

