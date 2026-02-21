"use client";

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
}

export default function DocsSidebar({ 
  categories, 
  openCategories, 
  onCategoryToggle,
  onOverviewClick,
  onLessonClick,
  onBackClick,
  isOpen,
  loadedChapters = new Set()
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
  
  return (
    <aside className={`
      fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 
      bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
      transition-transform duration-300 z-40 flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex-1 overflow-y-auto p-6">
        <nav className="space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                title={category.title}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  openCategories.includes(category.id)
                    ? "bg-accent/10 text-accent"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <span className="truncate">{category.title}</span>
                {category.id !== "overview" && (
                  <svg 
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${
                      openCategories.includes(category.id) ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              
              {openCategories.includes(category.id) && category.id !== "overview" && (
                <ul className="mt-1 ml-3 space-y-1">
                  {!loadedChapters.has(category.id) ? (
                    <li className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tải...
                    </li>
                  ) : category.topics.length > 0 ? (
                    category.topics.map((topic, index) => (
                      <li key={topic.id}>
                        <button
                          onClick={(e) => handleTopicClick(e, topic.id)}
                          title={topic.title}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors flex items-start gap-2"
                        >
                          <span className="flex-shrink-0 font-medium">{index + 1}.</span>
                          <span className="truncate">{topic.title}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 italic">
                      Chưa có bài học nào
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Back button - Fixed at bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <button
          onClick={onBackClick}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
      </div>
    </aside>
  );
}
