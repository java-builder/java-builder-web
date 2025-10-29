import Link from 'next/link';
import Image from 'next/image';
import { Blog, BlogTypeDisplayNames } from '@/types/blog';
import BlogTypeIcon from '@/components/admin/blogs/BlogTypeIcon';
import { formatApiDateOnly } from '@/utils/dateUtils';

interface PublicBlogCardProps {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {blog.featuredImage && (
        <Link href={`/blogs/${blog.id}`} className="block">
          <div className="aspect-[16/10] w-full overflow-hidden relative">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}

      <div className="p-4 flex flex-col flex-grow">
        {/* Header với type và date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md">
              <BlogTypeIcon blogType={blog.blogType} className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </div>
          <time className="text-xs text-gray-500" dateTime={blog.createdAt}>
            {formatApiDateOnly(blog.createdAt)}
          </time>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.id}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 leading-tight">
            {blog.title}
          </h3>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{blog.summary}</p>
        )}

        {/* Footer với stats và author */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.viewCount}
              </span>
              <span className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {blog.likeCount}
              </span>
            </div>

            <Link
              href={`/blogs/${blog.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Đọc tiếp
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Author */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Tác giả:</span> {blog.author}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}