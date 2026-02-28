"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { favoriteService } from "@/services/favorite.service";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteTargetType } from "@/types/favorite";
import { CourseLevel } from "@/types/course";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<FavoriteTargetType>(FavoriteTargetType.COURSE);
  const [currentPage, setCurrentPage] = useState(1);
  const { favorites, isLoading, totalPages, refetch } = useFavorites(currentPage, 12, activeTab);

  const handleTabChange = (tab: FavoriteTargetType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleRemoveFavorite = async (targetId: string, targetType: FavoriteTargetType) => {
    try {
      await favoriteService.toggle({ targetId, targetType });
      refetch();
      toast.success("Đã xóa khỏi yêu thích");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getLevelText = (level?: string) => {
    if (!level) return "";
    switch (level as CourseLevel) {
      case CourseLevel.BEGINNER: return "Cơ bản";
      case CourseLevel.INTERMEDIATE: return "Trung cấp";
      case CourseLevel.ADVANCED: return "Nâng cao";
      default: return level;
    }
  };

  const getItemUrl = (item: typeof favorites[0]) => {
    return item.targetType === FavoriteTargetType.COURSE 
      ? `/courses/${item.targetId}` 
      : `/blogs/${item.targetId}`;
  };

  const getItemIcon = (targetType: FavoriteTargetType) => {
    return targetType === FavoriteTargetType.COURSE ? (
      <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) : (
      <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    );
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
          <span className="text-gray-900 dark:text-white font-medium">Nội dung yêu thích</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Nội dung yêu thích
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Danh sách khóa học và bài viết bạn đã lưu</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-8">
            <button
              onClick={() => handleTabChange(FavoriteTargetType.COURSE)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === FavoriteTargetType.COURSE
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Khóa học
              </div>
            </button>
            <button
              onClick={() => handleTabChange(FavoriteTargetType.BLOG)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === FavoriteTargetType.BLOG
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Bài viết
              </div>
            </button>
          </nav>
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {activeTab === FavoriteTargetType.COURSE ? "Chưa có khóa học yêu thích" : "Chưa có bài viết yêu thích"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {activeTab === FavoriteTargetType.COURSE 
                ? "Hãy khám phá và thêm các khóa học bạn quan tâm" 
                : "Hãy khám phá và thêm các bài viết bạn quan tâm"}
            </p>
            <Link 
              href={activeTab === FavoriteTargetType.COURSE ? "/courses" : "/blogs"} 
              className="inline-flex items-center px-6 py-2.5 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
            >
              {activeTab === FavoriteTargetType.COURSE ? "Khám phá khóa học" : "Xem bài viết"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-200 dark:border-slate-700">
                  <Link href={getItemUrl(item)}>
                    <div className="relative aspect-video">
                      {item.thumbnailUrl ? (
                        <Image src={item.thumbnailUrl} alt={item.targetTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                          {getItemIcon(item.targetType)}
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.targetType === FavoriteTargetType.COURSE 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-purple-500 text-white'
                        }`}>
                          {item.targetType === FavoriteTargetType.COURSE ? 'Khóa học' : 'Bài viết'}
                        </span>
                      </div>
                      {/* Favorite Button */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFavorite(item.targetId, item.targetType);
                          }}
                          className="p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full shadow-lg transition-colors"
                          title="Xóa khỏi yêu thích"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {item.courseLevel && (
                        <span className="px-3 py-1 text-sm font-medium bg-accent-100 dark:bg-accent/20 text-accent-700 dark:text-accent-400 rounded-lg">
                          {getLevelText(item.courseLevel)}
                        </span>
                      )}
                      {item.courseDuration && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.courseDuration} giờ</span>
                      )}
                    </div>
                    <Link href={getItemUrl(item)}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent transition-colors">
                        {item.targetTitle}
                      </h3>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 mb-4">{item.targetDescription}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                      {item.targetType === FavoriteTargetType.COURSE && item.coursePrice !== undefined ? (
                        <span className="text-xl font-bold text-accent">{formatPrice(item.coursePrice)}</span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                      <Link
                        href={getItemUrl(item)}
                        className="px-4 py-2 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
