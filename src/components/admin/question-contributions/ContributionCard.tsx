import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";

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
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Chờ duyệt"
        };
      case "APPROVED":
        return {
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Đã duyệt"
        };
      case "REJECTED":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/25",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Đã từ chối"
        };
      default:
        return {
          badge: "bg-muted text-muted-foreground border-border",
          icon: null,
          label: status
        };
    }
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return {
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          label: "Dễ"
        };
      case "MEDIUM":
        return {
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          label: "Trung bình"
        };
      case "HARD":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/25",
          label: "Khó"
        };
      default:
        return {
          badge: "bg-muted text-muted-foreground border-border",
          label: difficulty
        };
    }
  };

  const statusConfig = getStatusConfig(contribution.status);
  const difficultyConfig = getDifficultyConfig(contribution.difficulty);

  return (
    <div 
      className="bg-card rounded-xl border border-border p-4 sm:p-5 hover:border-accent/60 hover:shadow-sm transition-all duration-200"
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
              <span className="text-sm font-semibold text-foreground">
                {contribution.contributorName}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusConfig.badge}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${difficultyConfig.badge}`}>
                {difficultyConfig.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatApiDate(contribution.createdAt)}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
            {contribution.question}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium">{contribution.questionSetTitle || "Chưa có"}</span>
            </span>
            {contribution.level && (
              <span className="px-2 py-0.5 border border-border bg-muted text-muted-foreground rounded text-[11px] font-semibold tracking-wider">
                {contribution.level}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetail}
            className="text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/20"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem
          </Button>
          {contribution.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onApprove}
                className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Duyệt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Từ chối
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
