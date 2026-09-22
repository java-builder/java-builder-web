"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  X,
  Check,
  FolderGit2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Hash,
  Layers,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface ContributionDetailModalProps {
  contribution: QuestionContributionDetailResponse;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

export default function ContributionDetailModal({
  contribution,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: ContributionDetailModalProps) {
  const { t } = useI18n();
  const [avatarError, setAvatarError] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {t("admin.questionContributions.tabPending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {t("admin.questionContributions.tabApproved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
            {t("admin.questionContributions.tabRejected")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            {t("admin.questionContributions.difficultyEasy")}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            {t("admin.questionContributions.difficultyMedium")}
          </span>
        );
      case "HARD":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
            {t("admin.questionContributions.difficultyHard")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground">
            {difficulty}
          </span>
        );
    }
  };

  const contributorInitials = contribution.contributorName
    ? contribution.contributorName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CB";

  const isValidAvatar =
    contribution.contributorAvatar &&
    (contribution.contributorAvatar.startsWith("http://") ||
      contribution.contributorAvatar.startsWith("https://") ||
      contribution.contributorAvatar.startsWith("/")) &&
    !avatarError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 flex flex-col w-full max-w-3xl max-h-[90vh] rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-card px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">
              {t("admin.questionContributions.pageTitle")}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono tabular-nums">{contribution.id}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto">
            {/* Contributor Profile Banner */}
            <div className="border-b border-border bg-gradient-to-br from-accent/5 to-transparent px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {isValidAvatar ? (
                    <Image
                      src={contribution.contributorAvatar!}
                      alt={contribution.contributorName || "Avatar"}
                      width={44}
                      height={44}
                      onError={() => setAvatarError(true)}
                      className="h-11 w-11 rounded-full object-cover border border-border/80 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                      {contributorInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground leading-snug truncate">
                      {contribution.contributorName || "Ẩn danh"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate" title={contribution.contributorEmail}>
                      {contribution.contributorEmail}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(contribution.status)}
                  {getDifficultyBadge(contribution.difficulty)}
                  {contribution.level && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-muted text-muted-foreground border border-border">
                      {contribution.level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="divide-y divide-border">
              {/* Question & Set */}
              <Section
                icon={<FolderGit2 className="h-3.5 w-3.5" />}
                title="Thông tin bộ câu hỏi"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Bộ câu hỏi"
                    value={contribution.questionSetTitle || t("admin.questionContributions.unassigned")}
                    icon={<FolderGit2 className="h-3.5 w-3.5 text-accent" />}
                  />
                  <Field
                    label="Cấp độ học viên"
                    value={contribution.level || "—"}
                    icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                </div>
              </Section>

              {/* Rejection Alert (if rejected) */}
              {contribution.rejectReason && (
                <Section
                  icon={<AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                  title="Lý do từ chối"
                >
                  <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-3.5 text-xs font-medium text-destructive leading-relaxed">
                    {contribution.rejectReason}
                  </div>
                </Section>
              )}

              {/* Question Content */}
              <Section
                icon={<HelpCircle className="h-3.5 w-3.5" />}
                title="Câu hỏi đóng góp"
              >
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {contribution.question}
                </p>
              </Section>

              {/* Answer Content */}
              {contribution.answer && (
                <Section
                  icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                  title="Câu trả lời chi tiết"
                >
                  <div className="rounded-xl border border-border bg-card p-4 sm:p-5 text-sm leading-relaxed overflow-hidden shadow-2xs">
                    <PublicMarkdownRenderer
                      content={contribution.answer}
                      className="prose-sm sm:prose-base dark:prose-invert max-w-none"
                    />
                  </div>
                </Section>
              )}

              {/* Tips Content */}
              {contribution.tips && (
                <Section
                  icon={<Lightbulb className="h-3.5 w-3.5 text-amber-500" />}
                  title="Gợi ý trả lời (Tips)"
                >
                  <div className="rounded-xl border border-border bg-card p-4 sm:p-5 text-sm leading-relaxed overflow-hidden shadow-2xs">
                    <PublicMarkdownRenderer
                      content={contribution.tips}
                      className="prose-sm sm:prose-base dark:prose-invert max-w-none"
                    />
                  </div>
                </Section>
              )}

              {/* Audit Timeline */}
              <Section
                icon={<Calendar className="h-3.5 w-3.5" />}
                title="Thời gian &amp; Kiểm duyệt"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Ngày gửi"
                    value={formatApiDate(contribution.createdAt)}
                    icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                    mono
                  />
                  {contribution.reviewedBy && (
                    <Field
                      label="Người kiểm duyệt"
                      value={contribution.reviewedBy}
                      icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                    />
                  )}
                  {contribution.reviewedAt && (
                    <Field
                      label="Thời gian duyệt"
                      value={formatApiDate(contribution.reviewedAt)}
                      mono
                    />
                  )}
                </div>
              </Section>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex items-center justify-between border-t border-border bg-muted/10 px-5 py-3.5">
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t("admin.questionContributions.deleteBtn")}</span>
            </Button>

            <div className="flex items-center gap-2">
              {contribution.status === "PENDING" ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onReject}
                    className="gap-1.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{t("admin.questionContributions.rejectBtn")}</span>
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={onApprove}
                    className="gap-1.5 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{t("admin.questionContributions.approveBtn")}</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="cursor-pointer"
                >
                  Đóng
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        {icon}
        <p
          className={`text-sm font-medium text-foreground ${
            mono ? "font-mono tabular-nums" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
