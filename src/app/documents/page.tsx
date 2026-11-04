"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import MotionWrapper from "@/components/common/MotionWrapper";
import Image from "next/image";
import { Document, DocumentType } from "@/types/document";
import { documentApi } from "@/services/document.service";
import { useI18n } from "@/contexts/I18nContext";
import { Search, SlidersHorizontal, X, BookOpen, Compass, ArrowRight } from "lucide-react";
import { FilterSelect, FilterOption } from "@/components/ui/select";

export default function DocumentsPage() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [totalElements, setTotalElements] = useState(0);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await documentApi.getAll({
        keyword: currentSearch || undefined,
        type: (selectedType as DocumentType) || undefined,
        page: 1,
        size: 50,
      });
      setDocuments(response.data?.data || []);
      setTotalElements(response.data?.totalElements || 0);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, selectedType]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentSearch(searchText.trim());
  };

  const handleClear = () => {
    setSearchText("");
    setCurrentSearch("");
    setSelectedType("");
  };

  const typeOptions: FilterOption<string>[] = useMemo(() => [
    { value: "", label: t("documentsPage.allTypes") || "Tất cả thể loại" },
    { value: DocumentType.BOOK, label: "📚 " + t("documentsPage.types.book") },
    { value: DocumentType.PDF, label: "📄 " + t("documentsPage.types.pdf") },
    { value: DocumentType.ARTICLE, label: "📝 " + t("documentsPage.types.article") },
    { value: DocumentType.VIDEO, label: "🎬 " + t("documentsPage.types.video") },
    { value: DocumentType.TUTORIAL, label: "📖 " + t("documentsPage.types.tutorial") },
    { value: DocumentType.OTHER, label: "📁 " + t("documentsPage.types.other") },
  ], [t]);

  const hasFilter = Boolean(currentSearch) || Boolean(selectedType);

  return (
    <main className="min-h-screen bg-[#F8F8F8] dark:bg-background transition-colors pb-16">
      {/* 1. HERO SECTION - Proportional with other pages */}
      <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD8C7] dark:border-orange-900/50 bg-[#FFF0E8] dark:bg-orange-950/40 px-3 py-1 text-xs font-semibold text-[#FF5A1F]">
                  <BookOpen className="h-3.5 w-3.5 text-[#FF5A1F]" />
                  <span>{t("documentsPage.heroBadge") || "Thư viện học tập"}</span>
                </span>

                <h1 className="text-3xl font-black tracking-tight text-[#171717] dark:text-white sm:text-4xl md:text-5xl leading-tight">
                  {t("documentsPage.heroTitleStart")}{" "}
                  {t("documentsPage.heroTitleHighlight") && (
                    <span className="text-[#FF5A1F]">{t("documentsPage.heroTitleHighlight")}</span>
                  )}{" "}
                  {t("documentsPage.heroTitleEnd")}
                </h1>

                <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-slate-300">
                  {t("documentsPage.heroDesc")}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="#list"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#FF5A1F]/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Compass className="h-4 w-4" />
                    <span>{t("documentsPage.exploreBtn") || "Khám phá tài liệu"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium">
                    {t("documentsPage.availableCount").replace("{count}", String(totalElements))}
                  </span>
                </div>
              </div>

              <div className="hidden lg:col-span-5 lg:block">
                <div className="relative overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-slate-900 shadow-lg">
                  <Image
                    src="/banners/banner-course.webp"
                    alt="Documents hero"
                    width={600}
                    height={360}
                    className="h-64 w-full object-cover"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FF5A1F]/15 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* 2. FILTER & LIST SECTION */}
      <section id="list" className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* System Filter Bar using standard FilterSelect */}
        <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] dark:border-border px-5 py-3.5 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="h-4 w-4 text-[#FF5A1F]" />
              <span className="text-sm font-bold text-[#171717] dark:text-white">
                {t("documentsPage.filterLabel") || "Bộ lọc tài liệu & sách"}
              </span>
              <span className="rounded-full bg-[#FFF0E8] dark:bg-orange-950/40 border border-[#FFD8C7] dark:border-orange-900/50 px-2.5 py-0.5 text-xs font-semibold text-[#FF5A1F]">
                {loading ? "Đang tải..." : `${documents.length} tài liệu`}
              </span>
            </div>

            {hasFilter && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Search Input */}
              <div className="sm:col-span-8 lg:col-span-9">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    placeholder={t("documentsPage.searchPlaceholder") || "Tìm kiếm sách, tài liệu, hướng dẫn..."}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-slate-50 dark:bg-background py-2 pl-9 pr-3 text-xs sm:text-sm text-[#171717] dark:text-white placeholder:text-[#64748B] focus:border-[#FF5A1F] focus:bg-white dark:focus:bg-surface focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all"
                  />
                </form>
              </div>

              {/* Type Dropdown using FilterSelect */}
              <div className="sm:col-span-4 lg:col-span-3">
                <FilterSelect
                  value={selectedType}
                  onChange={(val) => setSelectedType(String(val))}
                  options={typeOptions}
                  placeholder={t("documentsPage.allTypes") || "Loại tài liệu: Tất cả"}
                  icon={<BookOpen className="h-3.5 w-3.5 text-[#64748B] shrink-0" />}
                  clearable={Boolean(selectedType)}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-surface border border-[#E8E8E8] dark:border-border rounded-2xl p-4 animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-12 text-center shadow-xs space-y-3">
            <BookOpen className="mx-auto h-12 w-12 text-[#64748B] opacity-40" />
            <h3 className="text-base font-bold text-[#171717] dark:text-white">
              {t("documentsPage.noDocsFound") || "Không tìm thấy tài liệu phù hợp"}
            </h3>
            <p className="mx-auto max-w-sm text-xs text-[#64748B] dark:text-slate-400">
              {t("documentsPage.noDocsFoundDesc") || "Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc."}
            </p>
            {hasFilter && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#e04b16] cursor-pointer shadow-xs active:scale-95"
              >
                Xem tất cả tài liệu
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document, index) => (
              <DocumentCard key={document.id} document={document} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
