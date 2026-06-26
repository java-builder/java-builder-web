"use client";

import { BookOpen, ChevronDown, ChevronLeft } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  slug: string;
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
}

function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];
  
  let result = '';
  let tempNum = num;
  for (const [value, numeral] of romanNumerals) {
    while (tempNum >= value) {
      result += numeral;
      tempNum -= value;
    }
  }
  return result;
}

export default function DocsSidebar({ 
  categories, 
  openCategories, 
  onCategoryToggle,
  onOverviewClick,
  onLessonClick,
  onBackClick,
  isOpen,
  loadedChapters = new Set(),
  selectedLessonId = null
}: DocsSidebarProps) {
  
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
  
  const isOverviewActive = !selectedLessonId;

  return (
    <aside className={`
      fixed lg:sticky top-16 left-0 lg:left-auto h-[calc(100vh-4rem)] w-72 
      bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/60
      transition-transform duration-300 z-40 flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
        <nav className="space-y-1.5">
          {categories.map((category, categoryIndex) => {
            const isOverview = category.id === "overview";
            
            // Determine if this chapter is currently active (contains the active lesson)
            const isCategoryActive = isOverview
              ? isOverviewActive
              : category.topics.some(t => t.id === selectedLessonId);
              
            const isExpanded = openCategories.includes(category.id);
            
            // Calculate Roman numeral index for chapters
            const chapterIndex = isOverview ? -1 : categoryIndex;
            const romanNumeral = chapterIndex > 0 ? toRoman(chapterIndex) : null;
            
            // Strip emoji from overview title for clean typography
            const cleanTitle = isOverview 
              ? category.title.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim()
              : category.title;
            
            return (
              <div key={category.id} className="space-y-1">
                {/* Chapter Header / Overview Button */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  title={cleanTitle}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                    isCategoryActive
                      ? "bg-accent/5 dark:bg-accent/10 text-accent dark:text-sky-400 border-l-2 border-accent rounded-r-xl rounded-l-none"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/40 hover:text-gray-900 dark:hover:text-white rounded-xl"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0 flex-1">
                    {isOverview ? (
                      <BookOpen className={`w-4 h-4 flex-shrink-0 ${
                        isCategoryActive ? "text-accent dark:text-sky-400" : "text-gray-400 dark:text-slate-500"
                      }`} />
                    ) : (
                      romanNumeral && (
                        <span className={`font-bold flex-shrink-0 text-xs ${
                          isCategoryActive ? "text-accent dark:text-sky-400" : "text-gray-400 dark:text-slate-500"
                        }`}>{romanNumeral}.</span>
                      )
                    )}
                    <span className="truncate leading-none">{cleanTitle}</span>
                  </span>
                  
                  {!isOverview && (
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-250 flex-shrink-0 ${
                        isExpanded ? 'rotate-180 text-accent dark:text-sky-400' : 'group-hover:text-gray-600 dark:group-hover:text-slate-350'
                      }`}
                    />
                  )}
                </button>
              
                {/* Lessons Nested Timeline List */}
                {isExpanded && !isOverview && (
                  <ul className="relative mt-1 ml-4 pl-3.5 border-l border-gray-150 dark:border-slate-700/60 space-y-1 animate-in fade-in duration-200">
                    {!loadedChapters.has(category.id) ? (
                      <li className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tải bài học...
                      </li>
                    ) : category.topics.length > 0 ? (
                      category.topics.map((topic, index) => {
                        const isTopicActive = selectedLessonId === topic.id;
                        
                        return (
                          <li key={topic.id} id={`lesson-${topic.id}`} className="relative group/item">
                            {/* Inner bullet timeline dot */}
                            <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-200 z-10 ${
                              isTopicActive 
                                ? "bg-accent dark:bg-sky-400 scale-125 shadow-sm shadow-accent/50" 
                                : "bg-gray-300 dark:bg-slate-600 group-hover/item:bg-accent/60"
                            }`} />
                            
                            <button
                              onClick={(e) => handleTopicClick(e, topic.id)}
                              title={topic.title}
                              className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all duration-200 flex items-start gap-2 cursor-pointer ${
                                isTopicActive
                                  ? "bg-accent/10 text-accent font-semibold dark:text-sky-400"
                                  : "text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/30"
                              }`}
                            >
                              <span className="font-semibold text-gray-400 dark:text-slate-500">{index + 1}.</span>
                              <span className="truncate leading-normal">{topic.title}</span>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 italic">
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
 
      {/* Back button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700/60 bg-gray-50/50 dark:bg-slate-900/40">
        <button
          onClick={onBackClick}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    </aside>
  );
}
