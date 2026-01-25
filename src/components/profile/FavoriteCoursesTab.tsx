"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { favoriteApi } from "@/services/course.service";
import { FavoriteResponse } from "@/types/favorite";
import toast from "react-hot-toast";

export default function FavoriteCoursesTab() {
  const [courses, setCourses] = useState<FavoriteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const fetchFavoriteCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await favoriteApi.getMyFavorites(currentPage, pageSize);
      if (response.data) {
        setCourses(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch favorite courses", error);
      toast.error("Không thể tải danh sách khóa học yêu thích");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchFavoriteCourses();
  }, [fetchFavoriteCourses]);

  const handleRemoveFavorite = async (courseId: string) => {
    try {
      await favoriteApi.toggle(courseId);
      toast.success("Đã xóa khỏi danh sách yêu thích");
      fetchFavoriteCourses();
    } catch (error) {
      console.error("Failed to remove favorite", error);
      toast.error("Không thể xóa khỏi danh sách yêu thích");
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Khóa học yêu thích</h2>
            <p className="text-sm text-gray-500 mt-1">
              {courses.length > 0
                ? `${courses.length} khóa học`
                : "Chưa có khóa học yêu thích"}
            </p>
          </div>
          {courses.length > 0 && (
            <Link
              href="/courses"
              className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Khám phá thêm →
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có khóa học yêu thích
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Khám phá và lưu các khóa học bạn quan tâm để học sau
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                >
                  {/* Course Cover */}
                  <div className="relative w-full h-48 bg-white border-b border-gray-100">
                    {course.courseCover ? (
                      <div className="relative w-full h-full p-4">
                        <Image
                          src={course.courseCover}
                          alt={course.courseTitle}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Favorite Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveFavorite(course.courseId)}
                        className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all shadow-md border border-gray-200"
                        title="Xóa khỏi yêu thích"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <Link href={`/courses/${course.courseId}`}>
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-accent transition-colors min-h-[3rem]">
                        {course.courseTitle}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                      {course.courseDescription}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-lg font-bold text-accent">
                        {formatPrice(course.coursePrice)}
                      </span>
                      <Link
                        href={`/courses/${course.courseId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                      >
                        Xem chi tiết
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  ← Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-accent text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
