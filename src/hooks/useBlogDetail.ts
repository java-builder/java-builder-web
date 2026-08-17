import { useState, useEffect, useRef } from "react";
import { Blog } from "@/types/blog";
import { blogService } from "@/services/blog.service";

export function useBlogDetail(blogSlug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasIncrementedViewRef = useRef(false);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!blogSlug) return;

      try {
        setIsLoading(true);
        setIsLoadingRelated(true);
        setError(null);

        const blogData = await blogService.getBlogBySlug(blogSlug);
        setBlog(blogData);
        setIsLoading(false);

        const relatedData = await blogService.getBlogs({
          page: 1,
          size: 10,
          blogType: blogData.blogType,
        });

        const filtered = relatedData.data?.data
          ?.filter((b) => b.slug !== blogSlug)
          ?.slice(0, 6) || [];
        setRelatedBlogs(filtered);
        setIsLoadingRelated(false);
      } catch {
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setIsLoading(false);
        setIsLoadingRelated(false);
      }
    };

    fetchBlogDetail();
  }, [blogSlug]);

  useEffect(() => {
    const incrementView = async () => {
      if (!blogSlug || !blog || hasIncrementedViewRef.current) return;
      try {
        hasIncrementedViewRef.current = true;
        const newCount = await blogService.incrementView(blogSlug);
        setBlog((prev) =>
          prev
            ? {
              ...prev,
              viewCount: typeof newCount === "number" ? newCount : prev.viewCount + 1,
            }
            : prev,
        );
      } catch {}
    };
    incrementView();
  }, [blogSlug, blog]);

  return {
    blog,
    setBlog,
    relatedBlogs,
    isLoading,
    isLoadingRelated,
    error,
  };
}
