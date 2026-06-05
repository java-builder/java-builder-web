"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { formatLocaleString } from "@/utils/dateUtils";
import { useMyContributions } from "@/hooks/useMyContributions";
import { QuestionContributionDetailResponse } from "@/types/interview";
import { useI18n } from "@/contexts/I18nContext";
import {
  ContributionDetailModal,
  ContributionListItem,
  MyContributionsEmptyState,
  MyContributionsFilter,
  MyContributionsHeader,
  MyContributionsListCard,
  MyContributionsLoadingState,
  MyContributionsStats,
  type StatusFilterId,
} from "@/components/my-contributions";

const LOCALE_MAP: Record<string, string> = {
  vi: "vi-VN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
};

export default function MyContributionsClient() {
  const { t, locale } = useI18n();
  const [selectedContribution, setSelectedContribution] =
    useState<QuestionContributionDetailResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>("ALL");

  const apiStatus =
    statusFilter === "ALL" ? undefined : statusFilter;

  const { data, isLoading, error } = useMyContributions(1, 100, apiStatus);

  const contributions: QuestionContributionDetailResponse[] = useMemo(
    () => data?.data?.data || [],
    [data?.data?.data]
  );

  const stats = useMemo(() => {
    const total = contributions.length;
    const approved = contributions.filter((c) => c.status === "APPROVED").length;
    const pending = contributions.filter((c) => c.status === "PENDING").length;
    const rejected = contributions.filter((c) => c.status === "REJECTED").length;
    return { total, approved, pending, rejected };
  }, [contributions]);

  const currentLocaleStr = LOCALE_MAP[locale] || "vi-VN";

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return t("myContributionsPage.statusPending");
      case "APPROVED":
        return t("myContributionsPage.statusApproved");
      case "REJECTED":
        return t("myContributionsPage.statusRejected");
      default:
        return status;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return t("exercisesPage.filterEasy");
      case "MEDIUM":
        return t("exercisesPage.filterMedium");
      case "HARD":
        return t("exercisesPage.filterHard");
      default:
        return difficulty;
    }
  };

  const filterLabels: Record<StatusFilterId, string> = {
    ALL: t("common.all"),
    PENDING: t("myContributionsPage.statusPending"),
    APPROVED: t("myContributionsPage.statusApproved"),
    REJECTED: t("myContributionsPage.statusRejected"),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <MyContributionsLoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-900/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t("coursesPage.errorTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("myContributionsPage.loadError")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const buildReviewedByText = (
    contribution: QuestionContributionDetailResponse,
    isModal: boolean
  ): string | undefined => {
    if (!contribution.reviewedBy || !contribution.reviewedAt) return undefined;
    const key = isModal
      ? "myContributionsPage.modalReviewedBy"
      : "myContributionsPage.reviewedBy";
    return t(key)
      .replace("{name}", contribution.reviewedBy)
      .replace(
        "{date}",
        formatLocaleString(contribution.reviewedAt, currentLocaleStr)
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        <MyContributionsHeader
          title={t("myContributionsPage.title")}
          subtitle={t("myContributionsPage.subtitle")}
          contributeLabel={t("myContributionsPage.btnContribute")}
        />

        <MyContributionsStats
          total={stats.total}
          approved={stats.approved}
          pending={stats.pending}
          totalLabel={t("myContributionsPage.statsTotal")}
          approvedLabel={t("myContributionsPage.statsApproved")}
          pendingLabel={t("myContributionsPage.statsPending")}
        />

        <MyContributionsFilter
          filter={statusFilter}
          onChange={setStatusFilter}
          filterLabel={t("myContributionsPage.filterByStatus")}
          labels={filterLabels}
        />

        <MyContributionsListCard
          title={t("myContributionsPage.listTitle")}
          count={contributions.length}
          countLabel={t("myContributionsPage.countLabel")}
        >
          {contributions.length === 0 ? (
            <MyContributionsEmptyState
              title={t("myContributionsPage.emptyTitle")}
              description={t("myContributionsPage.emptyDesc")}
              contributeLabel={t("myContributionsPage.btnContribute")}
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {contributions.map((contribution) => (
                <ContributionListItem
                  key={contribution.id}
                  contribution={contribution}
                  formattedDate={formatLocaleString(
                    contribution.createdAt,
                    currentLocaleStr
                  )}
                  statusLabel={getStatusLabel(contribution.status)}
                  difficultyLabel={getDifficultyLabel(contribution.difficulty)}
                  reviewedByText={buildReviewedByText(contribution, false)}
                  rejectReasonLabel={t(
                    "myContributionsPage.rejectReasonLabel"
                  )}
                  onView={() => setSelectedContribution(contribution)}
                />
              ))}
            </div>
          )}
        </MyContributionsListCard>
      </div>

      {selectedContribution && (
        <ContributionDetailModal
          contribution={selectedContribution}
          formattedDate={formatLocaleString(
            selectedContribution.createdAt,
            currentLocaleStr
          )}
          reviewedByText={buildReviewedByText(selectedContribution, true)}
          statusLabel={getStatusLabel(selectedContribution.status)}
          difficultyLabel={getDifficultyLabel(selectedContribution.difficulty)}
          labels={{
            title: t("myContributionsPage.modalTitle"),
            subtitle: t("myContributionsPage.subtitle"),
            questionSet: t("myContributionsPage.modalQuestionSet"),
            question: t("myContributionsPage.modalQuestion"),
            answer: t("myContributionsPage.modalAnswer"),
            tips: t("myContributionsPage.modalTips"),
            rejectReason: t("myContributionsPage.modalRejectReason"),
            markdown: t("myContributionsPage.tabMarkdown"),
            preview: t("myContributionsPage.tabPreview"),
            close: t("common.close"),
          }}
          onClose={() => setSelectedContribution(null)}
        />
      )}
    </div>
  );
}
