"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { enrollmentApi } from "@/services/enrollment.service";
import { courseApi } from "@/services/course.service";
import { CourseEnrollmentResponse } from "@/types/enrollment";
import { Pagination } from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
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
  const [enrollments, setEnrollments] = useState<CourseEnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
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
  useEffect(() => {
    if (!courseId) return;
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const response = await enrollmentApi.getCourseEnrollments(
          courseId,
          currentPage,
          PAGE_SIZE
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
    };
    fetchEnrollments();
  }, [courseId, currentPage]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await enrollmentApi.unenrollStudent(deleteModal.enrollmentId);
      toast.success("Đã xoá học viên khỏi khoá học");
      setEnrollments((prev) =>
        prev.filter((e) => e.enrollmentId !== deleteModal.enrollmentId)
      );
      setTotalElements((prev) => Math.max(0, prev - 1));
      setDeleteModal({ isOpen: false, enrollmentId: "", username: "" });
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Không thể xoá học viên");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.username.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <EnrollmentsHeader courseTitle={courseTitle} />

      <EnrollmentsStats totalElements={totalElements} enrollments={enrollments} />

      <EnrollmentsSearchBar
        search={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />

      <EnrollmentsTable
        enrollments={filteredEnrollments}
        isLoading={isLoading}
        totalElements={totalElements}
        hasFilter={search.length > 0}
        onRemove={(enrollmentId, username) =>
          setDeleteModal({ isOpen: true, enrollmentId, username })
        }
      />

      {totalPages > 0 && filteredEnrollments.length > 0 && (
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
