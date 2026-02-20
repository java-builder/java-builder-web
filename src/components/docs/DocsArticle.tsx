import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface DocsArticleProps {
  title: string;
  description: string;
  readTime: string;
  lastUpdated: string;
  content: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function DocsArticle({
  title,
  description,
  readTime,
  lastUpdated,
  content,
  breadcrumbs
}: DocsArticleProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-accent">
                {crumb.label}
              </Link>
            ) : (
              <span className={index === breadcrumbs.length - 1 ? "text-gray-900 dark:text-white" : ""}>
                {crumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Cập nhật: {lastUpdated}
          </span>
        </div>
      </header>

      {/* Article Content */}
      <PublicMarkdownRenderer 
        content={content} 
        className="prose prose-lg dark:prose-invert max-w-none" 
      />

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <Link
            href="#"
            className="flex items-center gap-2 text-accent hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Bài trước
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-accent hover:underline"
          >
            Bài tiếp theo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-8 p-6 bg-gray-100 dark:bg-slate-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Bài viết này có hữu ích không?
        </h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
            👍 Có
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
            👎 Không
          </button>
        </div>
      </div>
    </div>
  );
}
