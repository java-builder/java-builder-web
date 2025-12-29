"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/documents/DocumentCard";
import MotionWrapper from "@/components/MotionWrapper";
import Image from "next/image";
import { sampleDocuments, documentCategories } from "@/data/documents";

export default function DocumentsPage() {
  const [searchText, setSearchText] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = () => {
    setCurrentSearch(searchText.trim());
  };

  const filteredDocuments = useMemo(() => {
    let filtered = sampleDocuments;

    // Filter by search text
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower) ||
          doc.author?.toLowerCase().includes(searchLower) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    return filtered;
  }, [currentSearch, selectedCategory]);


  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[50vh] bg-gradient-to-r from-white to-indigo-100">
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
              <div className="lg:col-span-6 xl:col-span-7 text-gray-900">
                <div className="inline-block">
                  <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    📚 Sách & Tài liệu
                  </span>
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
                  Sách & Tài liệu <span className="text-accent">chất lượng</span>
                </h1>

                <p className="mt-4 text-base md:text-lg text-gray-700 max-w-3xl">
                  Bộ sưu tập sách và tài liệu chuyên sâu về Spring Boot, Microservices,
                  Java Backend và Cloud Native development. Được tuyển chọn kỹ lưỡng
                  từ các nguồn uy tín để hỗ trợ quá trình học tập của bạn.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <a
                    href="#list"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-[1.02]"
                  >
                    Khám phá tài liệu
                  </a>
                  <span className="text-sm text-gray-600">
                    {sampleDocuments.length} sách có sẵn
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
          <div className="relative bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex gap-3">
              {/* Search input */}
              <div className="flex-1">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm sách, tài liệu, tác giả..."
                    className="w-full h-12 rounded-lg border border-gray-300 pl-11 pr-4 text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Search button */}
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 h-12 bg-accent hover:bg-accent-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Tìm sách
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-accent text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tất cả
              </button>
              {documentCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? "bg-accent text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 mb-4"
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
            <p className="text-gray-700 font-medium mb-1">
              Không tìm thấy sách phù hợp
            </p>
            <p className="text-gray-500 text-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Hiển thị {filteredDocuments.length} sách
                {currentSearch && ` cho "${currentSearch}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document, index) => (
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
