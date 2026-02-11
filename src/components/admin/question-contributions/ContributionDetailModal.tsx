import { useState } from "react";
import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";
import MarkdownRenderer from "@/components/admin/blogs/MarkdownRenderer";

interface ContributionDetailModalProps {
  contribution: QuestionContributionDetailResponse;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ContributionDetailModal({
  contribution,
  onClose,
  onApprove,
  onReject,
}: ContributionDetailModalProps) {
  const [answerTab, setAnswerTab] = useState<"write" | "preview">("preview");
  const [tipsTab, setTipsTab] = useState<"write" | "preview">("preview");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Chờ duyệt"
        };
      case "APPROVED":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Đã duyệt"
        };
      case "REJECTED":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Đã từ chối"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: null,
          label: status
        };
    }
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          label: "Dễ"
        };
      case "MEDIUM":
        return {
          badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          label: "Trung bình"
        };
      case "HARD":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          label: "Khó"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          label: difficulty
        };
    }
  };

  const statusConfig = getStatusConfig(contribution.status);
  const difficultyConfig = getDifficultyConfig(contribution.difficulty);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chi tiết đóng góp
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              {contribution.contributorAvatar && (
                <Image
                  src={contribution.contributorAvatar}
                  alt={contribution.contributorName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {contribution.contributorName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {contribution.contributorEmail}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatApiDate(contribution.createdAt)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${statusConfig.badge}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${difficultyConfig.badge}`}>
                  {difficultyConfig.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Bộ câu hỏi
              </label>
              <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                {contribution.questionSetTitle || "Chưa có"}
                {contribution.level && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({contribution.level})
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Câu hỏi
              </label>
              <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                {contribution.question}
              </div>
            </div>

            {contribution.answer && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Câu trả lời
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <button
                      type="button"
                      onClick={() => setAnswerTab("write")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        answerTab === "write"
                          ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswerTab("preview")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        answerTab === "preview"
                          ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Xem trước
                    </button>
                  </div>
                  {answerTab === "write" ? (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 max-h-[400px] overflow-y-auto">
                      <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{contribution.answer}</pre>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-white dark:bg-gray-800 max-h-[400px] overflow-y-auto">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={contribution.answer} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {contribution.tips && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Gợi ý
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <button
                      type="button"
                      onClick={() => setTipsTab("write")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        tipsTab === "write"
                          ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipsTab("preview")}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        tipsTab === "preview"
                          ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Xem trước
                    </button>
                  </div>
                  {tipsTab === "write" ? (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 max-h-[300px] overflow-y-auto">
                      <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{contribution.tips}</pre>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-white dark:bg-gray-800 max-h-[300px] overflow-y-auto">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={contribution.tips} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {contribution.rejectReason && (
              <div>
                <label className="block text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                  Lý do từ chối
                </label>
                <div className="text-sm text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
                  {contribution.rejectReason}
                </div>
              </div>
            )}

            {contribution.reviewedBy && contribution.reviewedAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                Đã duyệt bởi {contribution.reviewedBy} vào {formatApiDate(contribution.reviewedAt)}
              </div>
            )}
          </div>

          {contribution.status === "PENDING" && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={onReject}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Từ chối
              </button>
              <button
                onClick={onApprove}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
