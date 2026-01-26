"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PostForm from "@/components/posts/PostForm";
import { CreatePostRequest } from "@/types/post";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { authApi } from "@/services/auth.service";

export default function NewQuestionPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const handleQuestionSubmit = (data: CreatePostRequest) => {
    // Mock submission - in real app this would call an API
    console.log("New post submitted:", data);
    // Redirect to Q&A main page
    window.location.href = "/qna";
  };

  useEffect(() => {
    const hasLocalToken = typeof window !== "undefined" && authApi.isAuthenticated();
    if (hasLocalToken) {
      setShowAuthModal(false);
      setCheckedAuth(true);
      return;
    }

    // Wait until AuthContext finishes loading. Do not show modal while loading to avoid flash.
    if (!isLoading) {
      setCheckedAuth(true);
      if (!isAuthenticated) {
        setShowAuthModal(true);
      } else {
        setShowAuthModal(false);
      }
    } else {
      // still loading; ensure modal hidden
      setShowAuthModal(false);
    }
  }, [isLoading, isAuthenticated]);

  const localToken = typeof window !== "undefined" && authApi.isAuthenticated();
  const showForm = checkedAuth && (localToken || isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-accent"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <Link
                    href="/qna"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-accent"
                  >
                    Q&A
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Đặt câu hỏi mới</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        { !checkedAuth ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra trạng thái đăng nhập...</p>
          </div>
        ) : showForm ? (
          <PostForm onSubmit={handleQuestionSubmit} />
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
    </div>
  );
}
