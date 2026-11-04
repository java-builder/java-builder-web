"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Circle,
  Search,
  X,
} from "lucide-react";

interface Topic {
  id: string;
  title: string;
  slug: string;
  completed?: boolean;
}

interface Category {
  id: string;
  title: string;
  topics: Topic[];
}

interface DocsSidebarProps {
  categories: Category[];
  openCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onOverviewClick?: () => void;
  onLessonClick?: (lessonId: string) => void;
  onBackClick?: () => void;
  isOpen: boolean;
  loadedChapters?: Set<string>;
  selectedLessonId?: string | null;
  showOverview?: boolean;
}

export default function DocsSidebar({
  categories,
  openCategories,
  onCategoryToggle,
  onOverviewClick,
  onLessonClick,
  isOpen,
  loadedChapters = new Set(),
  selectedLessonId = null,
  showOverview = false,
}: DocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isOverviewActive = showOverview || !selectedLessonId;

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((cat) => {
        if (cat.id === "overview") return cat;
        const matchedTopics = cat.topics.filter((t) =>
          t.title.toLowerCase().includes(q)
        );
        if (
          cat.title.toLowerCase().includes(q) ||
          matchedTopics.length > 0
        ) {
          return {
            ...cat,
            topics: matchedTopics.length > 0 ? matchedTopics : cat.topics,
          };
        }
        return null;
      })
      .filter(Boolean) as Category[];
  }, [categories, searchQuery]);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "overview" && onOverviewClick) {
      onOverviewClick();
    } else {
      onCategoryToggle(categoryId);
    }
  };

  const handleTopicClick = (e: React.MouseEvent, topicId: string) => {
    if (onLessonClick) {
      e.preventDefault();
      onLessonClick(topicId);
    }
  };

  return (
    <aside
      className={`fixed lg:sticky top-15 left-0 h-[calc(100vh-3.75rem)] w-80 xl:w-84 shrink-0 bg-surface border-r border-border transition-transform duration-300 z-40 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Top Search Box */}
      <div className="p-3.5 border-b border-border bg-surface">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài học..."
            className="w-full h-9 pl-9 pr-8 rounded-xl bg-background border border-border text-xs font-medium text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Syllabus List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <nav className="space-y-1.5">
          {filteredCategories.map((category, categoryIndex) => {
            const isOverview = category.id === "overview";

            const isExpanded =
              Boolean(searchQuery.trim()) ||
              openCategories.includes(category.id);

            const cleanTitle = isOverview
              ? category.title
                  .replace(
                    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu,
                    ""
                  )
                  .trim()
              : category.title.replace(/^Chương\s+\d+\s*[:.-]\s*/i, "");

            if (isOverview) {
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-full text-[13px] transition-all cursor-pointer ${
                    isOverviewActive
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted/70 hover:text-foreground font-medium"
                  }`}
                >
                  <BookOpen
                    className={`w-4 h-4 shrink-0 ${
                      isOverviewActive ? "text-primary" : "text-text-muted"
                    }`}
                  />
                  <span className="truncate">
                    {cleanTitle || "Tổng quan khóa học"}
                  </span>
                </button>
              );
            }

            const completedInChapter = category.topics.filter(
              (t) => t.completed
            ).length;

            return (
              <div
                key={category.id}
                className="pt-2 first:pt-0 border-t border-border/60 first:border-t-0 space-y-1"
              >
                {/* Chapter Group Header */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  title={cleanTitle}
                  className="group w-full flex items-start justify-between gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug shrink-0">
                      {categoryIndex}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {cleanTitle}
                      </p>
                      {category.topics.length > 0 && (
                        <p className="text-[11px] font-medium text-text-muted mt-0.5">
                          Đã học {completedInChapter}/{category.topics.length} bài
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-text-muted group-hover:text-primary transition-transform duration-200 shrink-0 mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Chapter Lessons */}
                {isExpanded && (
                  <ul className="ml-3.5 pl-2.5 border-l border-border space-y-1 py-0.5">
                    {!loadedChapters.has(category.id) ? (
                      <li className="px-3 py-2 text-xs text-text-muted flex items-center gap-2">
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span>Đang tải bài học...</span>
                      </li>
                    ) : category.topics.length > 0 ? (
                      category.topics.map((topic, index) => {
                        const isTopicActive = selectedLessonId === topic.id;
                        const strippedTitle = topic.title.replace(
                          /^\s*\d+[\.\)]\s*/,
                          ""
                        );

                        return (
                          <li key={topic.id} id={`lesson-${topic.id}`}>
                            <button
                              type="button"
                              onClick={(e) => handleTopicClick(e, topic.id)}
                              title={topic.title}
                              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-start gap-2.5 cursor-pointer group/item ${
                                isTopicActive
                                  ? "bg-primary-soft text-primary font-semibold"
                                  : "text-foreground/80 hover:bg-muted/70 hover:text-foreground font-medium"
                              }`}
                            >
                              {topic.completed ? (
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    isTopicActive
                                      ? "text-primary"
                                      : "text-success"
                                  }`}
                                />
                              ) : (
                                <Circle
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    isTopicActive
                                      ? "text-primary fill-primary/20"
                                      : "text-text-muted/50 group-hover/item:text-primary"
                                  }`}
                                />
                              )}
                              <span className="flex-1 leading-snug break-words min-w-0">
                                {index + 1}. {strippedTitle}
                              </span>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1.5 text-xs text-text-muted italic">
                        Chưa có bài học nào
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
