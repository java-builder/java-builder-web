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
}

export default function DocsSidebar({ 
  categories, 
  openCategories, 
  onCategoryToggle,
  onOverviewClick,
  onLessonClick,
  onBackClick,
  isOpen 
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
        <nav className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  openCategories.includes(category.id)
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{category.title}</span>
                {category.topics.length > 0 && (
                  <svg 
                    className={`w-4 h-4 transition-transform flex-shrink-0 ${
                      openCategories.includes(category.id) ? 'rotate-90' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              
              {openCategories.includes(category.id) && category.topics.length > 0 && (
                <ul className="mt-3 ml-6 space-y-1 relative">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topic.id} className="relative pl-5">
                      {/* Tree line - vertical */}
                      {topicIndex < category.topics.length - 1 && (
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-slate-600" />
                      )}
                      {/* Tree line - horizontal */}
                      <div className={`absolute left-0 top-4 w-4 h-px bg-gray-300 dark:bg-slate-600 ${
                        topicIndex === category.topics.length - 1 ? 'before:absolute before:left-0 before:top-0 before:bottom-4 before:w-px before:bg-gray-300 dark:before:bg-slate-600' : ''
                      }`} />
                      {/* Corner for last item */}
                      {topicIndex === category.topics.length - 1 && (
                        <div className="absolute left-0 top-0 h-4 w-px bg-gray-300 dark:bg-slate-600" />
                      )}
                      <button
                        onClick={(e) => handleTopicClick(e, topic.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                      >
                        {topic.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Divider between categories */}
              {index < categories.length - 1 && (
                <div className="my-4 border-t border-gray-200 dark:border-slate-700" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Back button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <button
          onClick={onBackClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
      </div>
    </aside>
  );
}
