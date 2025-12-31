"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel } from "@/types/course";
import { favoriteApi } from "@/services/course.service";
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
        const result = await favoriteApi.check(course.id);
        if (result.result !== undefined) {
          setIsFavorite(result.result);
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
      const result = await favoriteApi.toggle(course.id);
      if (result.code === 200) {
        setIsFavorite(result.result ?? false);
        toast.success(result.result ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        {course.courseCover ? (
          <Image
            src={course.courseCover}
            alt={course.title}
            width={400}
            height={192}
            className="w-full h-full object-cover"
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
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{course.title}</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {course.level && (
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  course.level === CourseLevel.BEGINNER
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
            {course.duration && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                {course.duration} giờ
              </span>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(0 đánh giá)</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-accent">
            {formatPrice(course.price)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-md transition-all duration-200 hover:shadow-md"
          >
            Xem chi tiết
          </Link>
          <button 
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 disabled:opacity-50 ${
              isFavorite 
                ? "bg-red-50 hover:bg-red-100 text-red-500 border-red-200 hover:border-red-300 dark:bg-red-900/30 dark:border-red-800 dark:hover:bg-red-900/50 dark:hover:border-red-700" 
                : "bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600 dark:hover:border-slate-500"
            }`}
          >
            {isLoading ? (
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
          </button>
        </div>
      </div>
    </div>
  );
}
