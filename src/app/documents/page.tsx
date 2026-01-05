"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/documents/DocumentCard";
import MotionWrapper from "@/components/MotionWrapper";
import SearchBar from "@/components/ui/SearchBar";
import Image from "next/image";
import { Document, DocumentType } from "@/types/document";
import { documentApi } from "@/services/document.service";

const documentTypes = [
  { type: DocumentType.BOOK, label: "Sách", icon: "📚" },
  { type: DocumentType.PDF, label: "PDF", icon: "📄" },
  { type: DocumentType.ARTICLE, label: "Bài viết", icon: "📝" },
  { type: DocumentType.VIDEO, label: "Video", icon: "🎬" },
  { type: DocumentType.TUTORIAL, label: "Hướng dẫn", icon: "📖" },
  { type: DocumentType.OTHER, label: "Khác", icon: "📁" },
];

export default function DocumentsPage() {
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
      setDocuments(response.result?.result || []);
      setTotalElements(response.result?.totalElements || 0);
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
      <Header />

      {/* Hero */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-white to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 text-indigo-400 font-mono text-xs">
              <div>const documents = [</div>
              <div>&nbsp;&nbsp;&quot;React Guide&quot;, &quot;Node.js&quot;,</div>
              <div>&nbsp;&nbsp;&quot;Python&quot;, &quot;AWS&quot;,</div>
              <div>&nbsp;&nbsp;&quot;Design Patterns&quot;</div>
              <div>];</div>
            </div>
            <div className="absolute top-32 right-20 text-purple-400 font-mono text-xs">
              <div>function learn() {`{`}</div>
              <div>&nbsp;&nbsp;return &quot;knowledge&quot;;</div>
              <div>{`}`}</div>
            </div>
            <div className="absolute bottom-32 left-20 text-blue-400 font-mono text-xs">
              <div>while (learning) {`{`}</div>
              <div>&nbsp;&nbsp;grow();</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 xl:col-span-7 text-gray-900 dark:text-white">
                <div className="inline-block">
                  <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    📚 Sách & Tài liệu
                  </span>
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  Sách & Tài liệu <span className="text-accent">chất lượng</span>
                </h1>

                <p className="mt-4 text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                  Bộ sưu tập sách và tài liệu chuyên sâu về Spring Boot, Microservices,
                  Java Backend và Cloud Native development.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <a
                    href="#list"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-[1.02]"
                  >
                    Khám phá tài liệu
                  </a>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {totalElements} tài liệu có sẵn
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 xl:col-span-5">
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                  <Image
                    src="/illustration.svg"
                    alt="Documents hero"
                    width={600}
                    height={400}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      <div id="list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/15 to-accent/15 blur-xl" />
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
            <SearchBar
              placeholder="Tìm sách, tài liệu..."
              value={searchText}
              onChange={setSearchText}
              onSearch={handleSearch}
              buttonText="Tìm kiếm"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loại tài liệu</h3>
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
              Tất cả
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
                {item.icon} {item.label}
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
              Không tìm thấy tài liệu
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Hiển thị {documents.length} tài liệu
                {currentSearch && ` cho "${currentSearch}"`}
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

      <Footer />
    </div>
  );
}
