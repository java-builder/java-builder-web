"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { HelpCircle } from "lucide-react";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { ContributionTableRow } from "./ContributionTableRow";
import { useI18n } from "@/contexts/I18nContext";

interface ContributionTableProps {
  contributions: QuestionContributionDetailResponse[];
  isLoading: boolean;
  totalElements: number;
  deletingId: string;
  onViewDetail: (contribution: QuestionContributionDetailResponse) => void;
  onApprove: (contribution: QuestionContributionDetailResponse) => void;
  onReject: (contribution: QuestionContributionDetailResponse) => void;
  onDelete: (contribution: QuestionContributionDetailResponse) => void;
}

export const ContributionTable = ({
  contributions,
  isLoading,
  totalElements,
  deletingId,
  onViewDetail,
  onApprove,
  onReject,
  onDelete,
}: ContributionTableProps) => {
  const { t } = useI18n();

  const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
    { label: t("admin.questionContributions.colContributor") },
    { label: t("admin.questionContributions.colQuestion") },
    { label: t("admin.questionContributions.colDifficulty") },
    { label: t("admin.questionContributions.colStatus") },
    { label: t("admin.questionContributions.colCreatedAt") },
    { label: t("admin.questionContributions.colActions"), align: "right" },
  ];

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-card">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.questionContributions.pageTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("admin.questionContributions.pageSubtitle")}
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {totalElements.toLocaleString()} {t("admin.questionContributions.totalQuestionsBadge")}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {COLUMN_HEADERS.map((col) => (
                <TableHead
                  key={col.label}
                  className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.align === "right" ? "text-right" : "text-left"
                    }`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-muted rounded w-28" />
                        <div className="h-3 bg-muted rounded w-36" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="space-y-2">
                      <div className="h-3.5 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="h-4 bg-muted rounded w-16" />
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="h-5 bg-muted rounded-full w-20" />
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="h-3.5 bg-muted rounded w-24" />
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <div className="h-8 bg-muted rounded w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : contributions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMN_HEADERS.length} className="py-14 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <HelpCircle className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {t("admin.questionContributions.noContributionsFound")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    {t("admin.questionContributions.noContributionsSubtitle")}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              contributions.map((contribution) => (
                <ContributionTableRow
                  key={contribution.id}
                  contribution={contribution}
                  isDeleting={deletingId === contribution.id}
                  onViewDetail={() => onViewDetail(contribution)}
                  onApprove={() => onApprove(contribution)}
                  onReject={() => onReject(contribution)}
                  onDelete={() => onDelete(contribution)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
