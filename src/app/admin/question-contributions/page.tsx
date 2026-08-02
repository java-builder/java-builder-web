"use client";

import { useState, useEffect, useCallback } from "react";
import { questionContributionService } from "@/services/question-contribution.service";
import { QuestionContributionDetailResponse, InterviewQuestionTranslation } from "@/types/interview";
import toast from "react-hot-toast";
import ContributionCard from "@/components/admin/question-contributions/ContributionCard";
import ContributionDetailModal from "@/components/admin/question-contributions/ContributionDetailModal";
import RejectModal from "@/components/admin/question-contributions/RejectModal";
import ApproveModal from "@/components/admin/question-contributions/ApproveModal";
import { Button } from "@/components/ui/button";
import { HelpCircle, SlidersHorizontal, Layers, Clock, CheckCircle2, XCircle, RotateCw } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function QuestionContributionsPage() {
  const { t } = useI18n();
  const [contributions, setContributions] = useState<QuestionContributionDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContribution, setSelectedContribution] = useState<QuestionContributionDetailResponse | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      const response = await questionContributionService.getContributions(page, 10, filterStatus);
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 300) {
        await new Promise((res) => setTimeout(res, 300 - elapsedTime));
      }
      setContributions(response.data.data.data || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch {
      toast.error("Không thể tải danh sách đóng góp");
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleApprove = async (translations?: InterviewQuestionTranslation[]) => {
    if (!selectedContribution || !translations) return;
    try {
      await questionContributionService.approveContribution(selectedContribution.id, translations);
      toast.success("Đã duyệt câu hỏi đóng góp!");
      setShowApproveModal(false);
      setSelectedContribution(null);
      fetchContributions();
    } catch {
      toast.error("Không thể duyệt câu hỏi");
    }
  };

  const handleReject = async () => {
    if (!selectedContribution) return;
    try {
      await questionContributionService.rejectContribution(selectedContribution.id, rejectReason);
      toast.success("Đã từ chối câu hỏi!");
      setShowRejectModal(false);
      setSelectedContribution(null);
      setRejectReason("");
      fetchContributions();
    } catch {
      toast.error("Không thể từ chối câu hỏi");
    }
  };

  const stats = {
    total: contributions.length,
    pending: contributions.filter(c => c.status === "PENDING").length,
    approved: contributions.filter(c => c.status === "APPROVED").length,
    rejected: contributions.filter(c => c.status === "REJECTED").length,
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-accent" />
            <span>{t("admin.questionContributions.pageTitle")}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.questionContributions.pageSubtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchContributions()}
          disabled={isLoading}
          className="gap-2 font-medium shrink-0 self-start sm:self-auto"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {t("admin.questionContributions.refreshBtn")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.questionContributions.tabAll")}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.questionContributions.tabPending")}</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</p>
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.questionContributions.tabApproved")}</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.approved}</p>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.questionContributions.tabRejected")}</p>
              <p className="text-xl sm:text-2xl font-bold text-destructive mt-1">{stats.rejected}</p>
            </div>
            <div className="p-2 bg-destructive/10 border border-destructive/25 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-2 border-r border-border/80">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
                <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {t("admin.common.status")}
              </span>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex h-9 items-center gap-1 rounded-md border border-input bg-muted/40 p-1 shadow-xs">
              {[
                { value: "ALL", label: t("admin.questionContributions.tabAll"), icon: Layers, badge: stats.total },
                { value: "PENDING", label: t("admin.questionContributions.tabPending"), icon: Clock, badge: stats.pending, activeColor: "text-amber-500" },
                { value: "APPROVED", label: t("admin.questionContributions.tabApproved"), icon: CheckCircle2, badge: stats.approved, activeColor: "text-emerald-500" },
                { value: "REJECTED", label: t("admin.questionContributions.tabRejected"), icon: XCircle, badge: stats.rejected, activeColor: "text-rose-500" },
              ].map((tab) => {
                const isActive = filterStatus === tab.value;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setFilterStatus(tab.value);
                      setPage(1);
                    }}
                    className={`flex h-7 items-center gap-1.5 px-3 text-sm font-medium rounded transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-background text-foreground shadow-xs ring-1 ring-border/80 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? (tab.activeColor || "text-accent") : "text-muted-foreground/70"
                      }`}
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 space-y-3 h-32 animate-pulse shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))
        ) : contributions.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <div className="text-foreground font-medium">Không có đóng góp nào</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              {filterStatus !== "ALL" ? "Thử thay đổi bộ lọc" : "Chưa có người dùng nào đóng góp câu hỏi"}
            </div>
          </div>
        ) : (
          contributions.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              onViewDetail={() => {
                setSelectedContribution(contribution);
                setShowDetailModal(true);
              }}
              onApprove={() => {
                setSelectedContribution(contribution);
                setShowApproveModal(true);
              }}
              onReject={() => {
                setSelectedContribution(contribution);
                setShowRejectModal(true);
              }}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {showDetailModal && selectedContribution && (
        <ContributionDetailModal
          contribution={selectedContribution}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedContribution(null);
          }}
          onApprove={() => {
            setShowDetailModal(false);
            setShowApproveModal(true);
          }}
          onReject={() => {
            setShowDetailModal(false);
            setShowRejectModal(true);
          }}
        />
      )}

      {showApproveModal && selectedContribution && (
        <ApproveModal
          contribution={selectedContribution}
          onClose={() => {
            setShowApproveModal(false);
            setSelectedContribution(null);
          }}
          onApprove={(translations) => handleApprove(translations)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          onClose={() => {
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedContribution(null);
          }}
          onConfirm={handleReject}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
        />
      )}
    </div>
  );
}
