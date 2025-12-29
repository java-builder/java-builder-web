import { Blog } from "@/types/blog";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: string, title: string) => void;
  onPreview?: (blog: Blog) => void;
  isDeleting?: string;
  isLoading?: boolean;
}

export default function BlogGrid({
  blogs,
  onEdit,
  onDelete,
  onPreview,
  isDeleting,
  isLoading,
}: BlogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có bài viết nào
        </h3>
        <p className="text-gray-500 mb-6">
          Hãy tạo bài viết đầu tiên để chia sẻ kiến thức của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
          isDeleting={isDeleting === blog.id}
        />
      ))}
    </div>
  );
}
