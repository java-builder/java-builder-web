"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { challengeService } from "@/services/challenge.service";
import { EnrolledStudentResponse } from "@/types/enrollment";
import { Pagination } from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { EnrollChallengeUserModal } from "@/components/admin/challenges";
import {
  EnrollmentsHeader,
  EnrollmentsSearchBar,
  EnrollmentsStats,
  EnrollmentsTable,
} from "@/components/admin/courses/enrollments";

const PAGE_SIZE = 20;

export default function ChallengeEnrollmentsPage() {
  const params = useParams();
  const challengeId = params.id as string;

  const [challengeTitle, setChallengeTitle] = useState<string>("");
  const [enrollments, setEnrollments] = useState<EnrolledStudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    enrollmentId: string;
    username: string;
  }>({
    isOpen: false,
    enrollmentId: "",
    username: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Fetch challenge info
  useEffect(() => {
    if (!challengeId) return;
    const fetchChallengeInfo = async () => {
      try {
        const response = await challengeService.getChallengeById(challengeId);
        if (response.data) setChallengeTitle(response.data.title);
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast.error("Không thể tải thông tin thử thách");
      }
    };
    fetchChallengeInfo();
  }, [challengeId]);

  // Fetch enrollments
  const fetchEnrollments = useCallback(async () => {
    if (!challengeId) return;
    try {
      setIsLoading(true);
      const trimmedSearch = debouncedSearch.trim();
      const response = await challengeService.getChallengeEnrollments(
        challengeId,
        currentPage,
        PAGE_SIZE,
        trimmedSearch || undefined
      );
      if (response.data) {
        setEnrollments(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Không thể tải danh sách học viên thử thách");
    } finally {
      setIsLoading(false);
    }
  }, [challengeId, currentPage, debouncedSearch]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await challengeService.unenrollStudent(deleteModal.enrollmentId);
      toast.success("Đã xoá học viên khỏi thử thách");
      setDeleteModal({ isOpen: false, enrollmentId: "", username: "" });
      fetchEnrollments();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Không thể xoá học viên");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasFilter = debouncedSearch.trim().length > 0;

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <EnrollmentsHeader
        title="Học viên thử thách"
        subtitle={challengeTitle ? `Thử thách: ${challengeTitle}` : "Đang tải thông tin thử thách..."}
        backHref="/admin/challenges"
        action={
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsEnrollModalOpen(true)}
            className="gap-2 cursor-pointer shadow-sm hover:shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            <span>Thêm học viên</span>
          </Button>
        }
      />

      <EnrollmentsStats totalElements={totalElements} enrollments={enrollments} />

      <EnrollmentsSearchBar
        search={search}
        debouncedSearch={debouncedSearch}
        isLoading={isLoading}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      <EnrollmentsTable
        enrollments={enrollments}
        isLoading={isLoading}
        totalElements={totalElements}
        hasFilter={hasFilter}
        title="Danh sách học viên tham gia thử thách"
        subtitle="Theo dõi tiến độ hoàn thành các ngày và quản lý học viên"
        emptyMessage="Chưa có học viên nào tham gia thử thách này"
        onRemove={(enrollmentId, username) =>
          setDeleteModal({ isOpen: true, enrollmentId, username })
        }
      />

      {totalPages > 0 && enrollments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemName="học viên"
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, enrollmentId: "", username: "" })
        }
        onConfirm={handleDelete}
        title="Xoá học viên khỏi thử thách"
        message={`Bạn có chắc chắn muốn xoá học viên <strong>${deleteModal.username}</strong> khỏi thử thách này? Hành động này không thể hoàn tác.`}
        confirmText="Xoá"
        isLoading={isDeleting}
      />

      {/* Enroll User to Challenge Modal */}
      <EnrollChallengeUserModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSuccess={fetchEnrollments}
        challengeId={challengeId}
        challengeTitle={challengeTitle}
      />
    </div>
  );
}
