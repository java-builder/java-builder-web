"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QuestionContributionDetail, ContributionStatus } from "@/types/interview";
import { formatLocaleString } from "@/utils/dateUtils";

// Mock data - will be replaced with API call later
const mockContributions: QuestionContributionDetail[] = [
  {
    id: "1",
    question: "Sự khác biệt giữa ArrayList và LinkedList trong Java là gì?",
    answer: "ArrayList sử dụng mảng động để lưu trữ phần tử, truy cập nhanh O(1) nhưng chèn/xóa chậm O(n). LinkedList sử dụng danh sách liên kết đôi, truy cập chậm O(n) nhưng chèn/xóa nhanh O(1) ở đầu/cuối.",
    tips: "Sử dụng ArrayList khi cần truy cập ngẫu nhiên nhiều, LinkedList khi cần thêm/xóa phần tử thường xuyên.",
    difficulty: "MEDIUM",
    status: ContributionStatus.APPROVED,
    questionSetId: "qs-1",
    questionSetTitle: "Java Collections Framework",
    level: "JUNIOR",
    contributorId: "user-1",
    contributorEmail: "user@example.com",
    contributorName: "Nguyễn Văn A",
    reviewedBy: "Admin",
    reviewedAt: "11-02-2026 10:30:00",
    createdAt: "10-02-2026 14:20:00"
  },
  {
    id: "2",
    question: "HashMap hoạt động như thế nào trong Java?",
    answer: "HashMap sử dụng bảng băm (hash table) để lưu trữ cặp key-value. Khi thêm phần tử, key được băm thành hash code để xác định vị trí lưu trữ. Xử lý collision bằng chaining (linked list) hoặc tree (từ Java 8).",
    tips: "Hiểu rõ về hash code, equals(), và cách xử lý collision để tối ưu hiệu suất.",
    difficulty: "HARD",
    status: ContributionStatus.PENDING,
    questionSetId: "qs-1",
    questionSetTitle: "Java Collections Framework",
    level: "MIDDLE",
    contributorId: "user-1",
    contributorEmail: "user@example.com",
    contributorName: "Nguyễn Văn A",
    createdAt: "11-02-2026 09:15:00"
  }
];

const statusColors = {
  [ContributionStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  [ContributionStatus.APPROVED]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [ContributionStatus.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
};

const statusLabels = {
  [ContributionStatus.PENDING]: "Đang chờ",
  [ContributionStatus.APPROVED]: "Đã duyệt",
  [ContributionStatus.REJECTED]: "Từ chối"
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

export default function MyContributionsPage() {
  const [contributions] = useState<QuestionContributionDetail[]>(mockContributions);
  const [selectedContribution, setSelectedContribution] = useState<QuestionContributionDetail | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Câu hỏi đóng góp
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các câu hỏi phỏng vấn bạn đã đóng góp
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contributions.length}
                </p>
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
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {contributions.filter(c => c.status === ContributionStatus.APPROVED).length}
                </p>
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
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {contributions.filter(c => c.status === ContributionStatus.PENDING).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          {contributions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có câu hỏi đóng góp
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bắt đầu đóng góp câu hỏi phỏng vấn để giúp cộng đồng
              </p>
              <Link
                href="/interview/contribute"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Đóng góp câu hỏi
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContribution(contribution)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {contribution.question}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full font-medium ${statusColors[contribution.status]}`}>
                          {statusLabels[contribution.status]}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${difficultyColors[contribution.difficulty]}`}>
                          {difficultyLabels[contribution.difficulty]}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                          {levelLabels[contribution.level]}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                      {formatLocaleString(contribution.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{contribution.questionSetTitle}</span>
                  </div>

                  {contribution.status === ContributionStatus.APPROVED && contribution.reviewedAt && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Đã duyệt bởi {contribution.reviewedBy} - {formatLocaleString(contribution.reviewedAt)}
                    </div>
                  )}

                  {contribution.status === ContributionStatus.REJECTED && contribution.rejectReason && (
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

      {/* Detail Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setSelectedContribution(null)}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chi tiết đóng góp
                </h3>
                <button
                  onClick={() => setSelectedContribution(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Status & Meta Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatLocaleString(selectedContribution.createdAt)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[selectedContribution.status]}`}>
                      {selectedContribution.status === ContributionStatus.APPROVED && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {selectedContribution.status === ContributionStatus.PENDING && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {selectedContribution.status === ContributionStatus.REJECTED && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {statusLabels[selectedContribution.status]}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${difficultyColors[selectedContribution.difficulty]}`}>
                      {difficultyLabels[selectedContribution.difficulty]}
                    </span>
                  </div>
                </div>

                {/* Question Set */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Bộ câu hỏi
                  </label>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    {selectedContribution.questionSetTitle}
                    {selectedContribution.level && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({levelLabels[selectedContribution.level]})
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Câu hỏi
                  </label>
                  <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    {selectedContribution.question}
                  </div>
                </div>

                {/* Answer */}
                {selectedContribution.answer && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Câu trả lời
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 whitespace-pre-wrap">
                      {selectedContribution.answer}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {selectedContribution.tips && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Gợi ý
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 whitespace-pre-wrap">
                      {selectedContribution.tips}
                    </div>
                  </div>
                )}

                {/* Reject Reason */}
                {selectedContribution.rejectReason && (
                  <div>
                    <label className="block text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                      Lý do từ chối
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                      {selectedContribution.rejectReason}
                    </div>
                  </div>
                )}

                {/* Review Info */}
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

      <Footer />
    </div>
  );
}
