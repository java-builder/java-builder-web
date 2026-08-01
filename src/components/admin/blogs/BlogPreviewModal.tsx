"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "./BlogTypeIcon";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { formatApiDate } from "@/utils/dateUtils";
import { blogService } from "@/services/blog.service";
import { Button } from "@/components/ui/button";
import {
  X,
  Loader2,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogSlug: string | null;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  blogSlug,
}: BlogPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogSlug || !isOpen) {
        setBlog(null);
        return;
      }

      setIsLoading(true);
      try {
        const blogData = await blogService.getBlogBySlug(blogSlug);
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogSlug, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative flex flex-col w-full max-w-4xl bg-card border border-border text-foreground rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center space-x-3">
              {blog && (
                <>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <BlogTypeIcon
                      blogType={blog.blogType}
                      className="w-5 h-5 text-accent"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Preview Bài viết
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {BlogTypeDisplayNames[blog.blogType]} •{" "}
                      {formatApiDate(blog.createdAt)}
                    </p>
                  </div>
                </>
              )}
              {!blog && (
                <h2 className="text-xl font-bold text-foreground">
                  Preview Bài viết
                </h2>
              )}
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon-sm"
              className="hover:bg-muted text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-background">
            {isLoading ? (
              <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="animate-spin h-10 w-10 text-accent mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">Đang tải bài viết...</p>
                </div>
              </div>
            ) : !blog ? (
              <div className="p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground text-sm">Không tìm thấy bài viết</p>
              </div>
            ) : (
              <article className="p-6 text-foreground">
                {/* Featured Image */}
                {blog.thumbnailUrl && (
                  <div className="mb-6 relative w-full h-64 bg-muted rounded-lg overflow-hidden border border-border">
                    <Image
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground pb-4 border-b border-border">
                  {blog.author && (
                    <>
                      <span>Tác giả: {typeof blog.author === "object" ? blog.author?.username : blog.author}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatApiDate(blog.createdAt)}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blog.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {blog.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {blog.commentCount}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                {blog.summary && (
                  <div className="mb-6 p-4 bg-accent/5 border-l-4 border-accent rounded-r-lg">
                    <h3 className="font-semibold text-accent mb-2">Tóm tắt</h3>
                    {mounted ? (
                      <PublicMarkdownRenderer
                        content={blog.summary}
                        className="text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{blog.summary}</p>
                    )}
                  </div>
                )}

                {/* Content */}
                {mounted ? (
                  <PublicMarkdownRenderer content={blog.content} className="text-foreground leading-relaxed" />
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                )}
              </article>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Bài viết này sẽ hiển thị như thế này khi được xuất bản
              </div>
              <Button
                onClick={onClose}
                variant="outline"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
