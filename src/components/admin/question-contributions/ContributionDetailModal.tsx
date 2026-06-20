
import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-black/60 transition-opacity animate-in fade-in" onClick={onClose} />
        <div className="relative bg-card rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-border animate-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-foreground">
              Chi tiết đóng góp
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              {contribution.contributorAvatar && (
                <Image
                  src={contribution.contributorAvatar}
                  alt={contribution.contributorName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border border-border"
                />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {contribution.contributorName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {contribution.contributorEmail}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatApiDate(contribution.createdAt)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusConfig.badge}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${difficultyConfig.badge}`}>
                  {difficultyConfig.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Bộ câu hỏi
              </label>
              <div className="text-sm text-foreground bg-muted/10 px-4 py-3 rounded-lg border border-border">
                {contribution.questionSetTitle || "Chưa có"}
                {contribution.level && (
                  <span className="ml-2 text-xs text-muted-foreground font-semibold">
                    ({contribution.level})
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Câu hỏi
              </label>
              <div className="text-sm text-foreground bg-muted/10 px-4 py-3 rounded-lg border border-border font-medium leading-relaxed">
                {contribution.question}
              </div>
            </div>

            {contribution.answer && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Câu trả lời
                </label>
                <MarkdownEditor
                  value={contribution.answer}
                  readOnly={true}
                  height={600}
                />
              </div>
            )}

            {contribution.tips && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Gợi ý
                </label>
                <MarkdownEditor
                  value={contribution.tips}
                  readOnly={true}
                  height={120}
                />
              </div>
            )}

            {contribution.rejectReason && (
              <div>
                <label className="block text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
                  Lý do từ chối
                </label>
                <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/25 leading-relaxed font-medium">
                  {contribution.rejectReason}
                </div>
              </div>
            )}

            {contribution.reviewedBy && contribution.reviewedAt && (
              <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                Đã duyệt bởi {contribution.reviewedBy} vào {formatApiDate(contribution.reviewedAt)}
              </div>
            )}
          </div>

          {contribution.status === "PENDING" && (
            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={onReject}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Từ chối
              </Button>
              <Button
                variant="outline"
                onClick={onApprove}
                className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Duyệt
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
