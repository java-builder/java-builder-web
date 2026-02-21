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


    </div>
  );
}
