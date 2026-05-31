"use client";

import { useState, useEffect, useCallback } from "react";
import { questionContributionService } from "@/services/question-contribution.service";
import { QuestionContributionDetailResponse } from "@/types/interview";
import toast from "react-hot-toast";
import ContributionCard from "@/components/admin/question-contributions/ContributionCard";
import ContributionDetailModal from "@/components/admin/question-contributions/ContributionDetailModal";
import RejectModal from "@/components/admin/question-contributions/RejectModal";
import ApproveModal from "@/components/admin/question-contributions/ApproveModal";

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

  const handleApproveSubmit = async (answer?: string, tips?: string) => {
    if (!selectedContribution) return;

    try {
      await questionContributionService.approveContribution(selectedContribution.id, answer, tips);
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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý đóng góp câu hỏi
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Duyệt và quản lý câu hỏi do người dùng đóng góp
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Tổng số</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Chờ duyệt</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Đã duyệt</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.approved}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Đã từ chối</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.rejected}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFilterStatus("ALL");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterStatus === "ALL"
                ? "bg-accent text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => {
              setFilterStatus("PENDING");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterStatus === "PENDING"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => {
              setFilterStatus("APPROVED");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterStatus === "APPROVED"
                ? "bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => {
              setFilterStatus("REJECTED");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filterStatus === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Đã từ chối
          </button>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <div className="text-gray-500 dark:text-gray-300 font-medium">Không có đóng góp nào</div>
          <div className="text-sm text-gray-400 dark:text-gray-300 mt-1">
            {filterStatus !== "ALL" ? "Thử thay đổi bộ lọc" : "Chưa có người dùng nào đóng góp câu hỏi"}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Trước
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300 px-4">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Sau
          </button>
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
