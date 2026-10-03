"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { enrollmentApi } from "@/services/enrollment.service";
import { courseApi } from "@/services/course.service";
import { EnrolledStudentResponse } from "@/types/enrollment";
import { Pagination } from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  EnrollmentsHeader,
  EnrollmentsSearchBar,
  EnrollmentsStats,
  EnrollmentsTable,
} from "@/components/admin/courses/enrollments";

const PAGE_SIZE = 20;

export default function CourseEnrollmentsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [courseTitle, setCourseTitle] = useState<string>("");
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

  // Fetch course info
  useEffect(() => {
    if (!courseId) return;
    const fetchCourseInfo = async () => {
      try {
        const response = await courseApi.getById(courseId);
        if (response.data) setCourseTitle(response.data.title);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Không thể tải thông tin khoá học");
      }
    };
    fetchCourseInfo();
  }, [courseId]);

  // Fetch enrollments
  const fetchEnrollments = useCallback(async () => {
    if (!courseId) return;
    try {
      setIsLoading(true);
      const trimmedSearch = debouncedSearch.trim();
      const response = await enrollmentApi.getCourseEnrollments(
        courseId,
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
      toast.error("Không thể tải danh sách học viên");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, currentPage, debouncedSearch]);

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
      await enrollmentApi.unenrollStudent(deleteModal.enrollmentId);
      toast.success("Đã xoá học viên khỏi khoá học");
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
      <EnrollmentsHeader courseTitle={courseTitle} />

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
        title="Xoá học viên"
        message={`Bạn có chắc chắn muốn xoá học viên <strong>${deleteModal.username}</strong> khỏi khoá học? Hành động này không thể hoàn tác.`}
        confirmText="Xoá"
        isLoading={isDeleting}
      />
    </div>
  );
}
