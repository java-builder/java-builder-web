"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";
import { favoriteService } from "@/services/favorite.service";
import { FavoriteTargetType } from "@/types/favorite";
import { authApi } from "@/services/auth.service";
import toast from "react-hot-toast";

interface CourseCardProps {
  course: CourseDetailResponse;
  index?: number;
  initialFavorite?: boolean;
}

export default function CourseCard({ course, index = 0, initialFavorite }: CourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const hasCheckedFavorite = useRef(false);

  useEffect(() => {
    // Skip if initialFavorite is provided or already checked
    if (initialFavorite !== undefined || hasCheckedFavorite.current) return;
    if (!authApi.isAuthenticated()) return;

    hasCheckedFavorite.current = true;

    const checkFavorite = async () => {
      try {
        const result = await favoriteService.check(course.id, FavoriteTargetType.COURSE);
        if (result && result.data !== undefined) {
          setIsFavorite(result.data);
        }
      } catch {
        // Silent fail
      }
    };
    checkFavorite();
  }, [course.id, initialFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authApi.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    setIsLoading(true);
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
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseCategory = (index: number) => {
    const categories = [
      {
        name: "Frontend Developer",
        gradient: "from-purple-500 to-blue-500",
        icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      },
      {
        name: "Backend Developer",
        gradient: "from-green-400 to-green-600",
        icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4a2 2 0 11-4 0 2 2 0 014 0z",
      },
      {
        name: "AI & Machine Learning",
        gradient: "from-pink-500 to-purple-500",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      },
    ];
    return categories[index] || categories[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const category = getCourseCategory(index);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            width={400}
            height={192}
            className={`w-full h-full ${
              course.courseFormat === CourseFormat.TEXT
                ? "object-contain bg-gray-100 dark:bg-slate-700"
                : "object-cover bg-gray-100 dark:bg-slate-700"
            }`}
          />
        ) : (
          <div
            className={`h-full bg-gradient-to-r ${category.gradient} flex items-center justify-center`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={category.icon}
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg">
                {category.name}
              </h3>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{course.title}</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {course.level && (
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${course.level === CourseLevel.BEGINNER
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                  : course.level === CourseLevel.INTERMEDIATE
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300"
                    : "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300"
                  }`}
              >
                {course.level === CourseLevel.BEGINNER
                  ? "Cơ bản"
                  : course.level === CourseLevel.INTERMEDIATE
                    ? "Trung cấp"
                    : "Nâng cao"}
              </span>
            )}
            {course.courseFormat && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${course.courseFormat === CourseFormat.VIDEO
                  ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                  : course.courseFormat === CourseFormat.TEXT
                    ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                    : "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300"
                  }`}
              >
                {course.courseFormat === CourseFormat.VIDEO ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Video
                  </>
                ) : course.courseFormat === CourseFormat.TEXT ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Text
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Mixed
                  </>
                )}
              </span>
            )}
            {course.courseFormat !== CourseFormat.TEXT && course.duration && course.duration > 0 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                {course.duration} giờ
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-accent">
            {formatPrice(course.price)}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={course.courseFormat === CourseFormat.TEXT ? `/docs/${course.slug}` : `/courses/${course.slug}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-accent text-sm font-medium rounded-md hover:bg-accent-50 hover:border-accent/20 transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Xem chi tiết
            </Link>

            <button
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className={`inline-flex items-center justify-center w-8 h-8 p-2 text-sm rounded-md border transition-all duration-200 disabled:opacity-50 ${isFavorite
                ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/30 dark:border-red-800 dark:hover:bg-red-900/50"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600"
                }`}
              aria-label={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
              title={isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
