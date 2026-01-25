"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionList from "@/components/questions/QuestionList";

export default function QNAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Q&A - Hỏi đáp & Giải quyết vấn đề
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Nơi chia sẻ kiến thức, giải quyết các vấn đề lập trình và học hỏi lẫn nhau
              </p>
            </div>
            <Link
              href="/qna/new"
              className="inline-flex items-center px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Đặt câu hỏi
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Box */}
            <div className="flex-1 max-w-md">
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
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sắp xếp:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-slate-600 rounded-md px-3 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="unanswered">Chưa trả lời</option>
                  <option value="resolved">Đã giải quyết</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tag:
                </label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-slate-600 rounded-md px-3 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tất cả</option>
                  <option value="java">java</option>
                  <option value="spring-boot">spring-boot</option>
                  <option value="react">react</option>
                  <option value="nextjs">nextjs</option>
                  <option value="docker">docker</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="mb-8">
          <QuestionList
            searchQuery={searchQuery}
            sortBy={sortBy}
            filterTag={filterTag}
          />
        </div>

        {/* Stats removed as requested */}
      </div>

      <Footer />
    </div>
  );
}
