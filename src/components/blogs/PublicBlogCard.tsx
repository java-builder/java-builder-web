import Link from 'next/link';
import Image from 'next/image';
import { Blog, BlogTypeDisplayNames } from '@/types/blog';
import BlogTypeIcon from '@/components/admin/blogs/BlogTypeIcon';

interface PublicBlogCardProps {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {blog.featuredImage && (
        <Link href={`/blogs/${blog.id}`} className="block">
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BlogTypeIcon blogType={blog.blogType} className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-700">
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </div>
        </div>

        <Link href={`/blogs/${blog.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {blog.title}
          </h3>
        </Link>

        {blog.summary && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blog.summary}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {blog.viewCount}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {blog.likeCount}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Tác giả: {blog.author}</span>
            <span>•</span>
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
          </div>
        </div>
      </div>
    </article>
  );
}