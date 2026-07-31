"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { useAuth } from "@/contexts/AuthContext";
import PostList from "@/components/posts/PostList";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { useI18n } from "@/contexts/I18nContext";
import {
  Search,
  Plus,
  Sparkles,
  X,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ChevronDown,
  Check,
} from "lucide-react";

export default function QNAClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "unanswered", "resolved"
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();

  const sortOptions = [
    { value: "newest", label: t("qnaPage.sortNewest") },
    { value: "popular", label: t("qnaPage.sortPopular") },
    { value: "oldest", label: t("qnaPage.sortOldest") },
    { value: "unanswered", label: t("qnaPage.sortUnanswered") },
    { value: "resolved", label: t("qnaPage.sortResolved") },
  ];

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || t("qnaPage.sortNewest");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* System Hero Banner */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        {/* System Accent halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.08),transparent_60%)]"
        />

        {/* System Floating Tech Logos */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-6 top-8 animate-float opacity-20 dark:opacity-30 md:left-12 lg:left-20">
            <Image src="/logos/logo-java.png" alt="" width={50} height={50} className="h-12 w-12 object-contain" />
          </div>
          <div className="absolute right-8 top-10 animate-float-delayed opacity-20 dark:opacity-30 md:right-16 lg:right-24" style={{ animationDelay: "1s" }}>
            <Image src="/logos/logo-springboot.png" alt="" width={50} height={50} className="h-12 w-12 object-contain" />
          </div>
          <div className="absolute bottom-6 left-12 animate-float opacity-20 dark:opacity-30 md:left-24" style={{ animationDelay: "1.5s" }}>
            <Image src="/logos/logo-microservices.png" alt="" width={45} height={45} className="h-10 w-10 object-contain" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent ring-1 ring-accent/20 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Q&A - Hỏi đáp & Giải quyết vấn đề</span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Cộng đồng{" "}
                <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent">
                  Hỏi Đáp Lập Trình
                </span>
              </h1>

              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t("qnaPage.subtitle")}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  if (isLoading) return;
                  if (isAuthenticated) {
                    window.location.href = "/qna/new";
                  } else {
                    setShowAuthModal(true);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t("qnaPage.askQuestion")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filter Controls */}
        {loadingData ? (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-full" />
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              <div className="w-28 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Search and Status Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Bar */}
              <div className="md:col-span-7 lg:col-span-8 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("qnaPage.searchPlaceholder")}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="md:col-span-5 lg:col-span-4 flex items-center justify-end">
                <div className="inline-flex p-1 bg-gray-100 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-700 w-full sm:w-auto">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === "all"
                        ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setStatusFilter("unanswered")}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === "unanswered"
                        ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Chờ trả lời
                  </button>
                  <button
                    onClick={() => setStatusFilter("resolved")}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === "resolved"
                        ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Đã giải quyết
                  </button>
                </div>
              </div>
            </div>

            {/* Categories & Sorting Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-slate-700/60">
              {/* Category Chips Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilterTag("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterTag === "all"
                      ? "bg-accent text-white shadow-sm"
                      : "bg-gray-100 dark:bg-slate-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  Tất cả danh mục
                </button>
                {categories.map((c) => {
                  const active = filterTag === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFilterTag(c.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        active
                          ? "bg-accent text-white shadow-sm"
                          : "bg-gray-100 dark:bg-slate-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              {/* Professional Custom Sort Dropdown */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {t("qnaPage.sortBy")}:
                </span>

                <div className="relative inline-block text-left" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm transition-all"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-accent" />
                    <span>{currentSortLabel}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isSortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Floating Menu Popover */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
                      {sortOptions.map((opt) => {
                        const isSelected = opt.value === sortBy;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                              isSelected
                                ? "bg-accent/10 text-accent font-semibold"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="mb-8">
          <PostList
            searchQuery={searchQuery}
            sortBy={sortBy}
            filterTag={filterTag}
            statusFilter={statusFilter}
          />
        </div>
      </div>

      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
