"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import MotionWrapper from "@/components/MotionWrapper";
import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { Document, DocumentType } from "@/types/document";
import { documentApi } from "@/services/document.service";
import { useI18n, TranslationKey } from "@/contexts/I18nContext";

const documentTypes = [
  { type: DocumentType.BOOK, icon: "📚" },
  { type: DocumentType.PDF, icon: "📄" },
  { type: DocumentType.ARTICLE, icon: "📝" },
  { type: DocumentType.VIDEO, icon: "🎬" },
  { type: DocumentType.TUTORIAL, icon: "📖" },
  { type: DocumentType.OTHER, icon: "📁" },
];

const getDocTypeLabel = (type: DocumentType, t: (key: TranslationKey) => string) => {
  switch (type) {
    case DocumentType.BOOK: return t("documentsPage.types.book");
    case DocumentType.PDF: return t("documentsPage.types.pdf");
    case DocumentType.ARTICLE: return t("documentsPage.types.article");
    case DocumentType.VIDEO: return t("documentsPage.types.video");
    case DocumentType.TUTORIAL: return t("documentsPage.types.tutorial");
    case DocumentType.OTHER: return t("documentsPage.types.other");
    default: return type;
  }
};

export default function DocumentsPage() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedType, setSelectedType] = useState<DocumentType | "">("");
  const [totalElements, setTotalElements] = useState(0);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await documentApi.getAll({
        keyword: currentSearch || undefined,
        type: selectedType || undefined,
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

  const handleSearch = () => {
    setCurrentSearch(searchText.trim());
    setSelectedType("");
  };

  const handleTypeFilter = (type: DocumentType | "") => {
    setSelectedType(type);
    setCurrentSearch("");
    setSearchText("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-white to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 text-gray-900 dark:text-white">
                <div className="inline-block">
                  <span className="bg-accent text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {t("documentsPage.heroBadge")}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t("documentsPage.heroTitleStart")}
                  {t("documentsPage.heroTitleHighlight") && (
                    <span className="text-accent">{t("documentsPage.heroTitleHighlight")}</span>
                  )}
                  {t("documentsPage.heroTitleEnd")}
                </h1>

                <p className="mt-3 text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                  {t("documentsPage.heroDesc")}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <a
                    href="#list"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    {t("documentsPage.exploreBtn")}
                  </a>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("documentsPage.availableCount").replace("{count}", String(totalElements))}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                  <Image
                    src="/illustration.svg"
                    alt="Documents hero"
                    width={600}
                    height={400}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <div id="list" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/15 to-accent/15 blur-xl" />
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
            <SearchBar
              placeholder={t("documentsPage.searchPlaceholder")}
              value={searchText}
              onChange={setSearchText}
              onSearch={handleSearch}
              buttonText={t("documentsPage.searchBtn")}
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("documentsPage.filterLabel")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTypeFilter("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === ""
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              {t("documentsPage.allTypes")}
            </button>
            {documentTypes.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleTypeFilter(item.type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === item.type
                    ? "bg-accent text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
              >
                {item.icon} {getDocTypeLabel(item.type, t)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              {t("documentsPage.noDocsFound")}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("documentsPage.noDocsFoundDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {currentSearch
                  ? t("documentsPage.showingCountForKeyword")
                      .replace("{count}", String(documents.length))
                      .replace("{keyword}", currentSearch)
                  : t("documentsPage.showingCount")
                      .replace("{count}", String(documents.length))}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document, index) => (
                <DocumentCard key={document.id} document={document} index={index} />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
