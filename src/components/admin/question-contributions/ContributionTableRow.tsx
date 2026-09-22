"use client";

import { useState } from "react";
import Image from "next/image";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { formatApiDate } from "@/utils/dateUtils";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, FolderGit2, Calendar, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface ContributionTableRowProps {
  contribution: QuestionContributionDetailResponse;
  isDeleting: boolean;
  onViewDetail: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

export const ContributionTableRow = ({
  contribution,
  isDeleting,
  onViewDetail,
  onApprove,
  onReject,
  onDelete,
}: ContributionTableRowProps) => {
  const { t } = useI18n();
  const [avatarError, setAvatarError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            {t("admin.questionContributions.difficultyEasy")}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            {t("admin.questionContributions.difficultyMedium")}
          </span>
        );
      case "HARD":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
            {t("admin.questionContributions.difficultyHard")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground">
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
    <TableRow
      onClick={onViewDetail}
      className="hover:bg-muted/50 transition-colors group cursor-pointer"
    >
      {/* Contributor */}
      <TableCell className="py-3.5 px-4 align-middle">
        <div className="flex items-center gap-3">
          {isValidAvatar ? (
            <Image
              src={contribution.contributorAvatar!}
              alt={contribution.contributorName || "Avatar"}
              width={36}
              height={36}
              onError={() => setAvatarError(true)}
              className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {contributorInitials}
            </div>
          )}
          <div className="min-w-0 max-w-[170px]">
            <p className="text-sm font-semibold text-foreground truncate leading-snug">
              {contribution.contributorName || "Ẩn danh"}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5" title={contribution.contributorEmail}>
              {contribution.contributorEmail}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Question & Question Set */}
      <TableCell className="py-3.5 px-4 align-middle">
        <div className="max-w-[320px] lg:max-w-[420px] space-y-1.5">
          <p
            className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed group-hover:text-accent transition-colors"
            title={contribution.question}
          >
            {contribution.question}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 border border-border/70 px-2 py-0.5 rounded">
              <FolderGit2 className="h-3 w-3 text-accent/80" />
              <span className="truncate max-w-[200px]">
                {contribution.questionSetTitle || t("admin.questionContributions.unassigned")}
              </span>
            </span>
          </div>
        </div>
      </TableCell>

      {/* Difficulty & Level */}
      <TableCell className="py-3.5 px-4 align-middle whitespace-nowrap">
        <div className="flex flex-col gap-1 items-start">
          {getDifficultyBadge(contribution.difficulty)}
          {contribution.level && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider bg-muted text-muted-foreground border border-border/80 uppercase">
              {contribution.level}
            </span>
          )}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3.5 px-4 align-middle whitespace-nowrap">
        {getStatusBadge(contribution.status)}
      </TableCell>

      {/* Submission Date */}
      <TableCell className="py-3.5 px-4 align-middle whitespace-nowrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{formatApiDate(contribution.createdAt)}</span>
        </div>
      </TableCell>

      {/* Actions (Using system Button for trigger and dropdown menu) */}
      <TableCell className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
        <div className="relative inline-block text-right">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            title="Thao tác"
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 min-w-[170px] bg-popover text-popover-foreground rounded-xl shadow-xl border border-border p-1 z-40 animate-in zoom-in-95 duration-150 space-y-0.5 text-left"
              >
                {contribution.status === "PENDING" && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onApprove();
                      }}
                      className="w-full justify-start text-xs font-medium h-8.5 px-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 gap-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t("admin.questionContributions.approveBtn")}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onReject();
                      }}
                      className="w-full justify-start text-xs font-medium h-8.5 px-2.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-600 gap-2 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>{t("admin.questionContributions.rejectBtn")}</span>
                    </Button>

                    <div className="my-1 h-px bg-border/60" />
                  </>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete();
                  }}
                  disabled={isDeleting}
                  className="w-full justify-start text-xs font-medium h-8.5 px-2.5 gap-2 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t("admin.questionContributions.deleteBtn")}</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
