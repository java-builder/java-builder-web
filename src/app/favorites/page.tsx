"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { favoriteApi } from "@/services/course.service";
import { FavoriteResponse, CourseLevel } from "@/types/course";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hasFetched = useRef(false);

  const fetchFavorites = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await favoriteApi.getMyFavorites(page, 12);
      if (result.result) {
        setFavorites(result.result.result || []);
        setTotalPages(result.result.totalPages || 1);
        setCurrentPage(page);
      }
    } catch {
      toast.error("Vui lòng đăng nhập để xem danh sách yêu thích");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (courseId: string) => {
    try {
      await favoriteApi.toggle(courseId);
      setFavorites(prev => prev.filter(f => f.courseId !== courseId));
      toast.success("Đã xóa khỏi yêu thích");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLevelText = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER: return "Cơ bản";
      case CourseLevel.INTERMEDIATE: return "Trung cấp";
      case CourseLevel.ADVANCED: return "Nâng cao";
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-accent">Trang chủ</Link>
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">Khóa học yêu thích</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Khóa học yêu thích
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Danh sách các khóa học bạn đã lưu</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chưa có khóa học yêu thích</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy khám phá và thêm các khóa học bạn quan tâm</p>
            <Link href="/courses" className="inline-flex items-center px-6 py-2.5 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors">
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <Link href={`/courses/${item.courseId}`}>
                    <div className="relative aspect-video">
                      {item.courseCover ? (
                        <Image src={item.courseCover} alt={item.courseTitle} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                          <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.courseLevel && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-accent-100 dark:bg-accent/20 text-accent-700 dark:text-accent-400 rounded">
                          {getLevelText(item.courseLevel)}
                        </span>
                      )}
                      {item.courseDuration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.courseDuration} giờ</span>
                      )}
                    </div>
                    <Link href={`/courses/${item.courseId}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent transition-colors">
                        {item.courseTitle}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{item.courseDescription}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                      <span className="font-bold text-accent">{formatPrice(item.coursePrice)}</span>
                      <button
                        onClick={() => handleRemoveFavorite(item.courseId)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Xóa khỏi yêu thích"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => fetchFavorites(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => fetchFavorites(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
