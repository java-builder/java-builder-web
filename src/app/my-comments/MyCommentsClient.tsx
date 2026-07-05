"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { formatShortDate } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";
import { useMyComments } from "@/hooks/useMyComments";

type TabType = "blogs" | "courses" | "docs";

export default function MyCommentsClient() {
  const { t } = useI18n();
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("blogs");

  const getTargetTypeFromTab = (tab: TabType): "BLOG" | "LESSON" | "DOCS" => {
    switch (tab) {
      case "blogs":
        return "BLOG";
      case "courses":
        return "LESSON";
      case "docs":
        return "DOCS";
    }
  };

  const {
    comments,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
  } = useMyComments(page, PAGE_SIZE, getTargetTypeFromTab(activeTab));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const getTargetTypeBadge = (type?: string) => {
    if (!type) return { label: "", className: "", icon: null };
    switch (type) {
      case "BLOG":
        return {
          label: t("myCommentsPage.blogsTab"),
          className: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          ),
        };
      case "LESSON":
        return {
          label: t("myCommentsPage.coursesTab"),
          className: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84a50.58 50.58 0 00-2.657.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          ),
        };
      case "DOCS":
        return {
          label: t("myCommentsPage.docBadge"),
          className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          ),
        };
      case "POST":
        return {
          label: t("sidebar.qna"),
          className: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          ),
        };
      default:
        return {
          label: type || "",
          className: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l3.255-4.143a.75.75 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          ),
        };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: t("common.home"), href: "/" },
            { label: t("myCommentsPage.title") },
          ]}
        />

        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {t("myCommentsPage.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("myCommentsPage.subtitle")}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-8">
            <button
              onClick={() => handleTabChange("blogs")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "blogs"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {t("myCommentsPage.blogsTab")}
              </div>
            </button>

            <button
              onClick={() => handleTabChange("courses")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "courses"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t("myCommentsPage.coursesTab")}
              </div>
            </button>

            <button
              onClick={() => handleTabChange("docs")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "docs"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("myCommentsPage.docsTab")}
              </div>
            </button>
          </nav>
        </div>

        {/* Total Comments Count */}
        {totalElements > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium px-1">
            {t("myCommentsPage.totalComments").split("{count}").map((text, index, arr) => (
              <span key={index}>
                {text}
                {index < arr.length - 1 && (
                  <span className="font-semibold text-gray-900 dark:text-white mx-0.5">
                    {totalElements}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                  <div className="h-4 bg-muted rounded w-28" />
                  <div className="h-3.5 bg-muted rounded w-16" />
                </div>
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-3.5 bg-muted rounded w-1/4 pt-2" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/40 rounded-xl border border-gray-200/80 dark:border-slate-700/60 shadow-sm px-6">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t("myCommentsPage.emptyTitle")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t("myCommentsPage.emptyDesc")}
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
            >
              {t("myCommentsPage.exploreBtn")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((item) => {
              const badge = getTargetTypeBadge(item.commentTargetType);
              const isTargetDeleted = !item.targetUrlPath;
              const CardContent = (
                <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-gray-200/80 dark:border-slate-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-650 flex flex-col group/card cursor-pointer overflow-hidden">
                  
                  {/* Card Header: Type Badge, Target Title & Date */}
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/20 dark:bg-slate-900/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md border flex-shrink-0 ${badge.className}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                      {isTargetDeleted ? (
                        <span className="font-semibold text-xs text-rose-500 dark:text-rose-400 flex items-center gap-0.5">
                          ⚠️ {t("myCommentsPage.statusDeletedTarget")}
                        </span>
                      ) : (
                        <h3 className="font-semibold text-[13px] text-gray-700 dark:text-gray-300 group-hover/card:text-accent transition-colors duration-200 truncate max-w-[280px] sm:max-w-md">
                          {item.targetTitle}
                        </h3>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 dark:text-gray-550 whitespace-nowrap">
                        {formatShortDate(item.createdAt)}
                      </span>
                      {!isTargetDeleted && (
                        <span className="text-[11px] font-semibold text-accent hover:text-accent/90 flex items-center gap-0.5 transition-colors whitespace-nowrap">
                          {t("favoritesPage.viewDetails")}
                          <svg className="w-3 h-3 transition-transform duration-200 group-hover/card:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Discussion Body */}
                  {item.parentComment ? (
                    // IF REPLY: Nested conversation layout
                    <div className="flex flex-col">
                      {/* Parent Comment (The other person's comment) */}
                      <div className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={item.parentComment.avatar || `https://i.pravatar.cc/150?u=${item.parentComment.username}`}
                              alt={item.parentComment.username}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-gray-900 dark:text-white mb-0.5">
                              {item.parentComment.username}
                            </h4>
                            <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                              {item.parentComment.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reply Box (My comment) connected visually */}
                      <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/10">
                        <div className="p-3 pl-12 relative">
                          {/* Connection Lines */}
                          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-slate-700" />
                          <div className="absolute left-8 top-7.5 w-4 h-px bg-gray-200 dark:bg-slate-700" />
                          <div className="absolute left-8 top-0 h-7.5 w-px bg-gray-200 dark:bg-slate-700" />

                          <div className="flex items-start gap-2.5 relative">
                            {/* My Avatar */}
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={item.avatar || `https://i.pravatar.cc/150?u=${item.username}`}
                                alt={item.username}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                                  {item.username}
                                </h4>
                                <span className="inline-flex items-center px-1.5 py-0.1 rounded text-[8px] font-semibold bg-accent/10 text-accent border border-accent/15">
                                  {t("myCommentsPage.you")}
                                </span>
                              </div>
                              <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed break-words font-medium">
                                {item.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // IF ROOT COMMENT: Simple single comment layout
                    <div className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        {/* My Avatar */}
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={item.avatar || `https://i.pravatar.cc/150?u=${item.username}`}
                            alt={item.username}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
                              {item.username}
                            </h4>
                            <span className="inline-flex items-center px-1.5 py-0.1 rounded text-[8px] font-semibold bg-accent/10 text-accent border border-accent/15">
                              {t("myCommentsPage.you")}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed break-words font-medium">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );

              return isTargetDeleted ? (
                <div key={item.id}>{CardContent}</div>
              ) : (
                <Link key={item.id} href={item.targetUrlPath || "#"} className="block no-underline">
                  {CardContent}
                </Link>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  itemName={t("myCommentsPage.itemUnit").toLowerCase()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
