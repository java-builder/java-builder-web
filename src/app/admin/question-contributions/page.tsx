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

export default function QuestionContributionsPage() {
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
      const response = await questionContributionService.getContributions(page, 10, filterStatus);
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

  const handleApprove = async (id: string) => {
    const contribution = contributions.find(c => c.id === id);
    if (contribution) {
      setSelectedContribution(contribution);
      setShowApproveModal(true);
    }
  };

  const handleApproveSubmit = async (translations: InterviewQuestionTranslation[]) => {
    if (!selectedContribution) return;

    try {
      await questionContributionService.approveContribution(selectedContribution.id, translations);
      toast.success("Đã duyệt câu hỏi thành công");
      setShowApproveModal(false);
      setSelectedContribution(null);
      fetchContributions();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleReject = async () => {
    if (!selectedContribution || !rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await questionContributionService.rejectContribution(selectedContribution.id, rejectReason);
      toast.success("Đã từ chối câu hỏi");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedContribution(null);
      fetchContributions();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const filteredContributions = contributions;

  const stats = {
    total: contributions.length,
    pending: contributions.filter(c => c.status === "PENDING").length,
    approved: contributions.filter(c => c.status === "APPROVED").length,
    rejected: contributions.filter(c => c.status === "REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-7 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-72" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 space-y-3 h-24" />
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-muted rounded w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-transparent">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-3 bg-muted rounded w-24" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Quản lý đóng góp câu hỏi
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Duyệt và quản lý câu hỏi do người dùng đóng góp
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tổng số</p>
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
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Chờ duyệt</p>
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
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Đã duyệt</p>
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
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Đã từ chối</p>
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

      <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "ALL" ? "accent" : "ghost"}
            size="sm"
            onClick={() => {
              setFilterStatus("ALL");
              setPage(1);
            }}
            className="text-xs sm:text-sm font-medium"
          >
            Tất cả
          </Button>
          <Button
            variant={filterStatus === "PENDING" ? "outline" : "ghost"}
            size="sm"
            onClick={() => {
              setFilterStatus("PENDING");
              setPage(1);
            }}
            className={`text-xs sm:text-sm font-medium ${
              filterStatus === "PENDING"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                : "text-muted-foreground"
            }`}
          >
            Chờ duyệt
          </Button>
          <Button
            variant={filterStatus === "APPROVED" ? "outline" : "ghost"}
            size="sm"
            onClick={() => {
              setFilterStatus("APPROVED");
              setPage(1);
            }}
            className={`text-xs sm:text-sm font-medium ${
              filterStatus === "APPROVED"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                : "text-muted-foreground"
            }`}
          >
            Đã duyệt
          </Button>
          <Button
            variant={filterStatus === "REJECTED" ? "outline" : "ghost"}
            size="sm"
            onClick={() => {
              setFilterStatus("REJECTED");
              setPage(1);
            }}
            className={`text-xs sm:text-sm font-medium ${
              filterStatus === "REJECTED"
                ? "bg-destructive/10 text-destructive border-destructive/25 hover:bg-destructive/20"
                : "text-muted-foreground"
            }`}
          >
            Đã từ chối
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredContributions.map((contribution) => (
          <ContributionCard
            key={contribution.id}
            contribution={contribution}
            onViewDetail={() => {
              setSelectedContribution(contribution);
              setShowDetailModal(true);
            }}
            onApprove={() => handleApprove(contribution.id)}
            onReject={() => {
              setSelectedContribution(contribution);
              setShowRejectModal(true);
            }}
          />
        ))}
      </div>

      {filteredContributions.length === 0 && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-muted-foreground/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <div className="text-foreground font-medium">Không có đóng góp nào</div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
            {filterStatus !== "ALL" ? "Thử thay đổi bộ lọc" : "Chưa có người dùng nào đóng góp câu hỏi"}
          </div>
        </div>
      )}

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
            handleApprove(selectedContribution.id);
            setShowDetailModal(false);
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
          onApprove={handleApproveSubmit}
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
