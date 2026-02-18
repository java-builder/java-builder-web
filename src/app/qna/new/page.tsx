 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostForm from "@/components/posts/PostForm";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { postService } from "@/services/post.service";
import { CreatePostRequest, CreatePostResponse } from "@/types/post";
import { ApiResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { authApi } from "@/services/auth.service";

export default function NewPostPage() {
  const [categories, setCategories] = useState<CategoryDetailResponse[] | null>(null);
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

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
    const hasLocalToken = typeof window !== "undefined" && authApi.isAuthenticated();
    if (hasLocalToken) {
      setShowAuthModal(false);
      setCheckedAuth(true);
      return;
    }

    if (!isLoading) {
      setCheckedAuth(true);
      if (!isAuthenticated) {
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    } else {
      setShowAuthModal(false);
    }
  }, [isLoading, isAuthenticated]);

  const localToken = typeof window !== "undefined" && authApi.isAuthenticated();
  const showForm = checkedAuth && (localToken || isAuthenticated);

  const handleCreate = async (data: CreatePostRequest) => {
    try {
      const resp = await postService.create(data) as ApiResponse<CreatePostResponse>;
      const created = resp?.data;
      const slug = created?.slug;
      router.push(slug ? `/qna/${slug}` : "/qna");
    } catch (e) {
      console.error("Create post failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        { !checkedAuth ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra trạng thái đăng nhập...</p>
          </div>
        ) : showForm ? (
          <PostForm categories={categories} onSubmit={handleCreate} />
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Bạn cần đăng nhập để đặt câu hỏi.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link href="/login" className="py-2 px-4 bg-accent text-white rounded-lg">Đăng nhập</Link>
              <Link href="/qna" className="py-2 px-4 bg-gray-100 rounded-lg">Quay lại</Link>
            </div>
          </div>
        )}
      </div>
      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Footer />
    </div>
  );
}
