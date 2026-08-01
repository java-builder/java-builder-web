"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { UpdatePostRequest } from "@/types/post";
import { CategoryDetailResponse, CategoryType } from "@/types/category";

export default function EditPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [initialData, setInitialData] = useState<Partial<UpdatePostRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryDetailResponse[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await categoryService.getAll(CategoryType.POST);
        if (mounted) setCategories(resp?.data ?? []);
      } catch (e) {
        console.error("Failed to load categories", e);
        if (mounted) setCategories(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const post = await postService.getBySlug(slug);
        if (post) {
          setInitialData({
            title: post.title,
            content: post.content,
            key: post.key ?? undefined,
            categoryId: post.category?.id,
          });
        }
      } catch (e) {
        console.error("Failed to load post for edit", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSubmit = async (data: UpdatePostRequest) => {
    try {
      // Get the current post to get its ID
      const currentPost = await postService.getBySlug(slug);
      const resp = await postService.update(currentPost.id, data);
      const updated = resp?.data;
      const newSlug = updated?.slug;
      router.push(newSlug ? `/qna/${newSlug}` : "/qna");
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {loading ? (
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-6 space-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-32 bg-muted rounded w-full" />
            </div>
            <div className="h-10 bg-muted rounded w-32" />
          </div>
        ) : (
          <PostForm initialData={initialData ?? undefined} onSubmit={handleSubmit} categories={categories} />
        )}
      </div>
    </div>
  );
}


