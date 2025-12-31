"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import VideoPlayer from "@/components/VideoPlayer";
import { courseApi, lessonApi, favoriteApi } from "@/services/course.service";
import { CourseDetailResponse, CourseLevel, LessonDetailResponse } from "@/types/course";
import toast from "react-hot-toast";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "description" | "comments" | "curriculum" | "instructor"
  >("curriculum");

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

  const fetchCourseDetail = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError("");
      const result = await courseApi.getById(courseId);
      if (result.code === 200 && result.result) {
        setCourse(result.result);
      }
      
      // Check favorite status
      try {
        const favoriteResult = await favoriteApi.check(courseId);
        if (favoriteResult.result !== undefined) {
          setIsFavorite(favoriteResult.result);
        }
      } catch {
        // Silent fail for favorite check
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  // Toggle favorite handler
  const handleToggleFavorite = async () => {
    if (!courseId) return;
    setFavoriteLoading(true);
    try {
      const result = await favoriteApi.toggle(courseId);
      if (result.code === 200) {
        setIsFavorite(result.result ?? false);
        toast.success(result.result ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
      }
    } catch {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
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

  // Handle lesson click
  const handleLessonClick = (lesson: LessonDetailResponse) => {
    if (lesson.isFreePreview) {
      setPreviewModal({ isOpen: true, lesson });
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
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab("curriculum")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "curriculum"
                            ? "border-accent text-accent-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Nội dung khóa học
                      </button>
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "description"
                            ? "border-accent text-accent-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Nội dung khóa học
                      </button>
                      <button
                        onClick={() => setActiveTab("instructor")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "instructor"
                            ? "border-accent text-accent-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Thông tin tác giả
                      </button>
                      <button
                        onClick={() => setActiveTab("comments")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "comments"
                            ? "border-accent text-accent-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Bình luận
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
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleChapter(chapter.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-500">Chương {index + 1}</span>
                                  <span className="font-medium text-gray-900">{chapter.chapterName}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {chapterLessons[chapter.id] ? `${chapterLessons[chapter.id].length} bài học` : ""}
                                </span>
                              </div>

                              {/* Lessons List */}
                              {expandedChapters.has(chapter.id) && (
                                <div className="border-t border-gray-200">
                                  {chapter.description && (
                                    <p className="text-sm text-gray-600 px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                                      {chapter.description}
                                    </p>
                                  )}
                                  <div className="divide-y divide-gray-100">
                                    {loadingLessons.has(chapter.id) ? (
                                      <div className="px-4 py-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang tải...
                                      </div>
                                    ) : chapterLessons[chapter.id] && chapterLessons[chapter.id].length > 0 ? (
                                      chapterLessons[chapter.id].map((lesson, lessonIndex) => (
                                        <div
                                          key={lesson.id}
                                          className={`flex items-center justify-between px-4 py-3 transition-colors ${
                                            lesson.isFreePreview 
                                              ? "hover:bg-accent-50 cursor-pointer group" 
                                              : "bg-gray-50/30"
                                          }`}
                                          onClick={() => handleLessonClick(lesson)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs ${
                                              lesson.isFreePreview 
                                                ? "bg-accent-100 text-accent-600 group-hover:bg-accent group-hover:text-white" 
                                                : "bg-gray-100 text-gray-400"
                                            } transition-colors`}>
                                              {lessonIndex + 1}
                                            </span>
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <span className={`text-sm ${
                                                  lesson.isFreePreview 
                                                    ? "text-gray-900 group-hover:text-accent" 
                                                    : "text-gray-500"
                                                } transition-colors`}>
                                                  {lesson.lessonName}
                                                </span>
                                                {lesson.isFreePreview && (
                                                  <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                                    Miễn phí
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
                                          {lesson.isFreePreview ? (
                                            <svg className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M8 5v14l11-7z" />
                                            </svg>
                                          ) : (
                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-6 text-center text-gray-400 text-sm">
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
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src="/favicon-academic.svg"
                              alt="Marino"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              Marino
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có bình luận nào
                        </h3>
                        <p className="text-gray-600">
                          Hãy là người đầu tiên đánh giá khóa học này!
                        </p>
                      </div>
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
                {/* Price */}
                <div className="text-center mb-5">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Một lần thanh toán, học mãi mãi
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 mb-6">
                  <button className="w-full bg-accent hover:bg-accent-600 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 hover:shadow-md cursor-pointer">
                    Đăng ký ngay
                  </button>
                  <button 
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-full font-medium py-2.5 px-4 rounded-md border transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                      isFavorite 
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewModal({ isOpen: false, lesson: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewModal.lesson.lessonName}</h3>
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  Xem miễn phí
                </span>
              </div>
              <button
                onClick={() => setPreviewModal({ isOpen: false, lesson: null })}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả bài học</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{previewModal.lesson.description}</p>
              </div>
            )}

            {/* CTA */}
            <div className="px-6 py-4 border-t border-gray-200 bg-accent-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Đăng ký khóa học để xem tất cả bài học
                </p>
                <button className="px-4 py-2 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
