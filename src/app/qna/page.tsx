"use client";

import { useEffect, useState } from "react";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostList from "@/components/posts/PostList";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";

export default function QNAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("all");
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingData(true);
      try {
        const catResp = await categoryService.getAll(CategoryType.POST);
        const cats = catResp?.data ?? [];
        if (mounted) {
          setCategories(cats);
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (mounted) setLoadingData(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Q&A - Hỏi đáp & Giải quyết vấn đề
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Nơi chia sẻ kiến thức, giải quyết các vấn đề lập trình và học hỏi lẫn nhau
              </p>
            </div>
            <button
              onClick={() => {
                if (isLoading) return;
                if (isAuthenticated) {
                  window.location.href = "/qna/new";
                } else {
                  setShowAuthModal(true);
                }
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Đặt câu hỏi
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {loadingData ? (
          <div className="mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full mb-4" />
              <div className="h-8 flex gap-2">
                <div className="w-20 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="w-24 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="w-24 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="w-28 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Left: search + chips (span 2 cols on lg) */}
              <div className="lg:col-span-2">
                <div className="max-w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm câu hỏi..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <svg  
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Chips under the search input */}
                  <div className="mt-3">
                    <div className="flex gap-2 overflow-x-auto py-1">
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setFilterTag("all")}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filterTag === "all" ? "bg-accent text-white border-accent shadow" : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                        >
                          Tất cả
                        </button>
                      </div>
                      {categories.map((c) => {
                        const active = filterTag === c.name;
                        return (
                          <div key={c.id} className="flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setFilterTag(c.name)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${active ? "bg-accent text-white border-accent shadow" : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                            >
                              {c.name}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: sort select (aligned center vertically) */}
              <div className="lg:col-span-1 flex items-center justify-end">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Sắp xếp</span>
                  <div className="relative inline-block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-3 py-1.5 pr-8 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-0"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="popular">Phổ biến</option>
                      <option value="unanswered">Chưa trả lời</option>
                      <option value="resolved">Đã giải quyết</option>
                    </select>
                    {/* subtle chevron */}
                    <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="mb-8">
          {loadingData ? (
            <div className="text-center py-12">Đang tải dữ liệu...</div>
          ) : (
            <PostList searchQuery={searchQuery} sortBy={sortBy} filterTag={filterTag} />
          )}
        </div>

        {/* Stats removed as requested */}
      </div>

      <Footer />
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
