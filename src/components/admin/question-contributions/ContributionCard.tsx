import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";

interface ContributionCardProps {
  contribution: QuestionContributionDetailResponse;
  onViewDetail: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ContributionCard({
  contribution,
  onViewDetail,
  onApprove,
  onReject,
}: ContributionCardProps) {
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
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {contribution.contributorAvatar && (
            <Image
              src={contribution.contributorAvatar}
              alt={contribution.contributorName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {contribution.contributorName}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.badge}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${difficultyConfig.badge}`}>
                {difficultyConfig.label}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatApiDate(contribution.createdAt)}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {contribution.question}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium">{contribution.questionSetTitle || "Chưa có"}</span>
            </span>
            {contribution.level && (
              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">
                {contribution.level}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewDetail}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-sky-700 dark:text-sky-300 bg-accent-100 dark:bg-accent-900/30 hover:bg-accent-200 dark:hover:bg-accent-800/40 rounded-md transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem
          </button>
          {contribution.status === "PENDING" && (
            <>
              <button
                onClick={onApprove}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Duyệt
              </button>
              <button
                onClick={onReject}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-md transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Từ chối
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
