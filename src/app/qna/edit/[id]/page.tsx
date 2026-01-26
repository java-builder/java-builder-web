"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostForm from "@/components/posts/PostForm";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { UpdatePostRequest } from "@/types/post";
import { CategoryDetailResponse } from "@/types/category";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [initialData, setInitialData] = useState<Partial<UpdatePostRequest & { thumbnail?: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryDetailResponse[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await categoryService.getAll();
        if (mounted) setCategories(resp?.data ?? []);
      } catch (e) {
        console.error("Failed to load categories", e);
        if (mounted) setCategories(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const resp = await postService.getById(id);
        if (resp?.data) {
          setInitialData({
            title: resp.data.title,
            content: resp.data.content,
            thumbnail: resp.data.thumbnail ?? undefined,
            categoryId: resp.data.categoryId,
          });
        }
      } catch (e) {
        console.error("Failed to load post for edit", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: UpdatePostRequest) => {
    try {
      const resp = await postService.update(id, data);
      const updated = resp?.data;
      const slug = updated?.slug;
      router.push(slug ? `/qna/${slug}` : "/qna");
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : (
          <PostForm initialData={initialData ?? undefined} onSubmit={handleSubmit} categories={categories} />
        )}
      </div>
      <Footer />
    </div>
  );
}


