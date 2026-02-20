"use client";

import Link from "next/link";

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
  isOpen: boolean;
}

export default function DocsSidebar({ 
  categories, 
  openCategories, 
  onCategoryToggle,
  isOpen 
}: DocsSidebarProps) {
  return (
    <aside className={`
      fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 
      bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
      overflow-y-auto transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6">
        <nav className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.id}>
              <button
                onClick={() => onCategoryToggle(category.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  openCategories.includes(category.id)
                    ? "bg-accent text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{category.title}</span>
                <svg 
                  className={`w-5 h-5 transition-transform flex-shrink-0 ${
                    openCategories.includes(category.id) ? 'rotate-90' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {openCategories.includes(category.id) && (
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
                      <Link
                        href={`/docs/${category.id}/${topic.slug}`}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                      >
                        {topic.title}
                      </Link>
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

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Liên kết nhanh
          </h3>
          <ul className="space-y-1">
            <li>
              <Link 
                href="/blogs" 
                className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
              >
                Bài viết chia sẻ
              </Link>
            </li>
            <li>
              <Link 
                href="/qna" 
                className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
              >
                Hỏi đáp
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
