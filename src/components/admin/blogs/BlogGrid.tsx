import { Blog } from "@/types/blog";
import BlogCard from "./BlogCard";
import { Newspaper } from "lucide-react";

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
            className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-muted"></div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-muted rounded"></div>
                  <div className="w-16 h-4 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-muted rounded"></div>
                <div className="w-3/4 h-4 bg-muted rounded"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-3 bg-muted rounded"></div>
                <div className="w-5/6 h-3 bg-muted rounded"></div>
                <div className="w-2/3 h-3 bg-muted rounded"></div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-16 h-3 bg-muted rounded"></div>
                <div className="w-20 h-3 bg-muted rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-3 bg-muted rounded"></div>
                <div className="w-20 h-3 bg-muted rounded"></div>
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
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Newspaper className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Chưa có bài viết nào
        </h3>
        <p className="text-muted-foreground mb-6">
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
