"use client";

import { useState, useEffect, useCallback } from "react";
import { questionContributionService } from "@/services/question-contribution.service";
import { QuestionContributionDetailResponse, InterviewQuestionTranslation } from "@/types/interview";
import toast from "react-hot-toast";
import ContributionCard from "@/components/admin/question-contributions/ContributionCard";
import { ContributionTable } from "@/components/admin/question-contributions/ContributionTable";
import { ContributionStatsCards } from "@/components/admin/question-contributions/ContributionStatsCards";
import { ContributionSearchBar } from "@/components/admin/question-contributions/ContributionSearchBar";
import ContributionDetailModal from "@/components/admin/question-contributions/ContributionDetailModal";
import RejectModal from "@/components/admin/question-contributions/RejectModal";
import ApproveModal from "@/components/admin/question-contributions/ApproveModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import { RotateCw, HelpCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function QuestionContributionsPage() {
  const { t } = useI18n();
  const [contributions, setContributions] = useState<QuestionContributionDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Accurate overall stats from DB
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Modals
  const [selectedContribution, setSelectedContribution] = useState<QuestionContributionDetailResponse | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    question: string;
  }>({
    isOpen: false,
    id: "",
    question: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch true stats count across DB
  const fetchOverallStats = useCallback(async () => {
    try {
      const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        questionContributionService.getContributions(1, 1),
        questionContributionService.getContributions(1, 1, "PENDING"),
        questionContributionService.getContributions(1, 1, "APPROVED"),
        questionContributionService.getContributions(1, 1, "REJECTED"),
      ]);

      setStats({
        total: allRes.data?.data?.totalElements ?? 0,
        pending: pendingRes.data?.data?.totalElements ?? 0,
        approved: approvedRes.data?.data?.totalElements ?? 0,
        rejected: rejectedRes.data?.data?.totalElements ?? 0,
      });
    } catch {
      // Fallback
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      const response = await questionContributionService.getContributions(page, pageSize, filterStatus);
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 250) {
        await new Promise((res) => setTimeout(res, 250 - elapsedTime));
      }

      const pageData = response.data?.data;
      setContributions(pageData?.data || []);
      setTotalPages(pageData?.totalPages || 1);
      setTotalElements(pageData?.totalElements || 0);
    } catch {
      toast.error("Không thể tải danh sách đóng góp");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, filterStatus]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  useEffect(() => {
    fetchOverallStats();
  }, [fetchOverallStats]);

  const handleApprove = async (translations?: InterviewQuestionTranslation[]) => {
    if (!selectedContribution || !translations) return;
    try {
      await questionContributionService.approveContribution(selectedContribution.id, translations);
      toast.success("Đã duyệt câu hỏi đóng góp!");
      setShowApproveModal(false);
      setSelectedContribution(null);
      fetchContributions();
      fetchOverallStats();
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
      fetchOverallStats();
    } catch {
      toast.error("Không thể từ chối câu hỏi");
    }
  };

  const handleDelete = (contribution: QuestionContributionDetailResponse) => {
    setDeleteModal({
      isOpen: true,
      id: contribution.id,
      question: contribution.question,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setIsDeleting(true);
      await questionContributionService.deleteContribution(deleteModal.id);
      toast.success("Đã xóa câu hỏi đóng góp!");
      setDeleteModal({ isOpen: false, id: "", question: "" });
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedContribution(null);
      }
      fetchContributions();
      fetchOverallStats();
    } catch {
      toast.error("Không thể xóa câu hỏi đóng góp");
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Standard Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("admin.questionContributions.pageTitle")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("admin.questionContributions.pageSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {stats.total > 0 && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {t("admin.questionContributions.totalContributions")}:{" "}
              <span className="font-bold tabular-nums">
                {stats.total.toLocaleString()}
              </span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchContributions();
              fetchOverallStats();
            }}
            disabled={isLoading}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t("admin.questionContributions.refreshBtn")}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <ContributionStatsCards
        stats={stats}
        isLoading={isLoading && contributions.length === 0}
        activeStatus={filterStatus}
        onSelectStatus={(status) => {
          setFilterStatus(status);
          setPage(1);
        }}
      />

      {/* Status Filter & View Mode Toolbar */}
      <ContributionSearchBar
        filterStatus={filterStatus}
        onStatusChange={(status) => {
          setFilterStatus(status);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isLoading={isLoading}
        onRefresh={() => {
          fetchContributions();
          fetchOverallStats();
        }}
        stats={stats}
      />

      {/* Main Content: Table View vs Grid View */}
      {viewMode === "table" ? (
        <ContributionTable
          contributions={contributions}
          isLoading={isLoading}
          totalElements={totalElements}
          deletingId={deleteModal.id}
          onViewDetail={(c) => {
            setSelectedContribution(c);
            setShowDetailModal(true);
          }}
          onApprove={(c) => {
            setSelectedContribution(c);
            setShowApproveModal(true);
          }}
          onReject={(c) => {
            setSelectedContribution(c);
            setShowRejectModal(true);
          }}
          onDelete={(c) => handleDelete(c)}
        />
      ) : (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border p-5 space-y-4 animate-pulse shadow-xs h-64"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                    </div>
                    <div className="h-5 bg-muted rounded-full w-20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-10 bg-muted/40 rounded-xl" />
                </div>
              ))}
            </div>
          ) : contributions.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-xs">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <HelpCircle className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {t("admin.questionContributions.noContributionsFound")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {t("admin.questionContributions.noContributionsSubtitle")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {contributions.map((contribution) => (
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
                  onDelete={() => handleDelete(contribution)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          itemName={t("admin.questionContributions.totalQuestionsBadge")}
        />
      )}

      {/* Detail Modal */}
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
          onDelete={() => handleDelete(selectedContribution)}
        />
      )}

      {/* Approve Modal */}
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

      {/* Reject Modal */}
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

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "", question: "" })}
        onConfirm={confirmDelete}
        title={t("admin.questionContributions.deleteConfirmTitle")}
        message={t("admin.questionContributions.deleteConfirmMsg").replace("{question}", deleteModal.question)}
        confirmText={t("admin.questionContributions.deleteBtn")}
        cancelText={t("admin.users.cancelBtn")}
        isLoading={isDeleting}
        type="danger"
      />
    </div>
  );
}
