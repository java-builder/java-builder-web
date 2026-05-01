"use client";

import { useState } from "react";
import Link from "next/link";
import { formatLocaleString } from "@/utils/dateUtils";
import { useMyContributions } from "@/hooks/useMyContributions";
import { QuestionContributionDetailResponse } from "@/types/interview";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const statusLabels = {
  PENDING: "Đang chờ",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối"
};

const difficultyColors = {
  EASY: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HARD: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const difficultyLabels = {
  EASY: "Dễ",
  MEDIUM: "Trung bình",
  HARD: "Khó"
};

const levelLabels = {
  INTERN: "Intern",
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MIDDLE: "Middle",
  SENIOR: "Senior"
};

// Component for Answer view with tabs
function ContributionAnswerView({ content }: { content: string }) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("preview");

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Câu trả lời</label>
      <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "write"
                ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Xem trước
          </button>
        </div>
        {activeTab === "write" ? (
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900/50 max-h-[400px] overflow-y-auto">
            <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        ) : (
          <div className="px-4 py-3 bg-white dark:bg-slate-800 max-h-[400px] overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for Tips view with tabs
function ContributionTipsView({ content }: { content: string }) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("preview");

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Gợi ý</label>
      <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "write"
                ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white dark:bg-slate-800 text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Xem trước
          </button>
        </div>
        {activeTab === "write" ? (
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900/50 max-h-[300px] overflow-y-auto">
            <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        ) : (
          <div className="px-4 py-3 bg-white dark:bg-slate-800 max-h-[300px] overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyContributionsPage() {
  const [selectedContribution, setSelectedContribution] = useState<QuestionContributionDetailResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useMyContributions(1, 100, statusFilter);

  const contributions = data?.data?.data || [];
  const totalContributions = contributions.length;
  const approvedCount = contributions.filter((c: QuestionContributionDetailResponse) => c.status === "APPROVED").length;
  const pendingCount = contributions.filter((c: QuestionContributionDetailResponse) => c.status === "PENDING").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-20 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Không thể tải danh sách đóng góp
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Câu hỏi đóng góp
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quản lý các câu hỏi phỏng vấn bạn đã đóng góp cho cộng đồng
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalContributions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đang chờ</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <button onClick={() => setStatusFilter(undefined)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === undefined ? "bg-accent text-white" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
              Tất cả
            </button>
            <button onClick={() => setStatusFilter("PENDING")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "PENDING" ? "bg-accent text-white" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
              Đang chờ
            </button>
            <button onClick={() => setStatusFilter("APPROVED")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "APPROVED" ? "bg-accent text-white" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
              Đã duyệt
            </button>
            <button onClick={() => setStatusFilter("REJECTED")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "REJECTED" ? "bg-accent text-white" : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
              Từ chối
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          {contributions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chưa có câu hỏi đóng góp</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Bắt đầu đóng góp câu hỏi phỏng vấn để giúp cộng đồng</p>
              <Link href="/interview/contribute">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Đóng góp câu hỏi
                </span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {contributions.map((contribution: QuestionContributionDetailResponse) => (
                <div key={contribution.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => setSelectedContribution(contribution)}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{contribution.question}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full font-medium ${statusColors[contribution.status as keyof typeof statusColors]}`}>
                          {statusLabels[contribution.status as keyof typeof statusLabels]}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${difficultyColors[contribution.difficulty as keyof typeof difficultyColors]}`}>
                          {difficultyLabels[contribution.difficulty as keyof typeof difficultyLabels]}
                        </span>
                        {contribution.level && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                            {levelLabels[contribution.level as keyof typeof levelLabels]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-right">{formatLocaleString(contribution.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{contribution.questionSetTitle}</span>
                  </div>
                  {contribution.status === "APPROVED" && contribution.reviewedAt && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Đã duyệt bởi {contribution.reviewedBy} - {formatLocaleString(contribution.reviewedAt)}
                    </div>
                  )}
                  {contribution.status === "REJECTED" && contribution.rejectReason && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        <span className="font-medium">Lý do từ chối:</span> {contribution.rejectReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedContribution && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setSelectedContribution(null)} />
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết đóng góp</h3>
                <button onClick={() => setSelectedContribution(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatLocaleString(selectedContribution.createdAt)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[selectedContribution.status as keyof typeof statusColors]}`}>
                      {selectedContribution.status === "APPROVED" && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {selectedContribution.status === "PENDING" && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {selectedContribution.status === "REJECTED" && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {statusLabels[selectedContribution.status as keyof typeof statusLabels]}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${difficultyColors[selectedContribution.difficulty as keyof typeof difficultyColors]}`}>
                      {difficultyLabels[selectedContribution.difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Bộ câu hỏi</label>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    {selectedContribution.questionSetTitle}
                    {selectedContribution.level && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({levelLabels[selectedContribution.level as keyof typeof levelLabels]})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Câu hỏi</label>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    {selectedContribution.question}
                  </div>
                </div>
                {selectedContribution.answer && (
                  <ContributionAnswerView content={selectedContribution.answer} />
                )}
                {selectedContribution.tips && (
                  <ContributionTipsView content={selectedContribution.tips} />
                )}
                {selectedContribution.rejectReason && (
                  <div>
                    <label className="block text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">Lý do từ chối</label>
                    <div className="text-sm text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                      {selectedContribution.rejectReason}
                    </div>
                  </div>
                )}
                {selectedContribution.reviewedBy && selectedContribution.reviewedAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-slate-700">
                    Đã duyệt bởi {selectedContribution.reviewedBy} vào {formatLocaleString(selectedContribution.reviewedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
