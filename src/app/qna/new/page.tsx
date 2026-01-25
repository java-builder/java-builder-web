"use client";

import Link from "next/link";
import QuestionForm from "@/components/questions/QuestionForm";
import { QuestionFormData } from "@/types/qna";

export default function NewQuestionPage() {
  const handleQuestionSubmit = (data: QuestionFormData) => {
    // Mock submission - in real app this would call an API
    console.log("New question submitted:", data);
    // Redirect to Q&A main page
    window.location.href = "/qna";
  };

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

        <QuestionForm onSubmit={handleQuestionSubmit} />
      </div>
    </div>
  );
}
