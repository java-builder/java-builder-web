"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { enrollmentApi } from "@/services/enrollment.service";
import { courseApi } from "@/services/course.service";
import { CourseEnrollmentResponse } from "@/types/enrollment";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";

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

  // Fetch course info by ID
  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await courseApi.getById(courseId);
        if (response.data) {
          setCourseTitle(response.data.title);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Không thể tải thông tin khóa học");
      }
    };

    if (courseId) {
      fetchCourseInfo();
    }
  }, [courseId]);

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        const response = await enrollmentApi.getCourseEnrollments(courseId, currentPage, 20);
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
      toast.success("Đã xóa học viên khỏi khóa học");
      setEnrollments(enrollments.filter((e) => e.enrollmentId !== deleteModal.enrollmentId));
      setTotalElements((prev) => prev - 1);
      setDeleteModal({ isOpen: false, enrollmentId: "", username: "" });
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Không thể xóa học viên");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse format: "13-02-2026 10:08:49" (dd-MM-yyyy HH:mm:ss)
      const parts = dateString.split(" ");
      if (parts.length === 2) {
        const [datePart, timePart] = parts;
        const [day, month, year] = datePart.split("-");
        const [hour, minute] = timePart.split(":");
        
        // Create date object (month is 0-indexed in JS)
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.username.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/courses"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách học viên</h1>
            <p className="text-gray-600">{courseTitle || "Đang tải..."}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Enrollments Grid */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Đang tải...</span>
            </div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Chưa có học viên nào
            </h3>
            <p className="text-sm text-gray-500">
              {search ? "Không tìm thấy học viên phù hợp" : "Khóa học chưa có học viên đăng ký"}
            </p>
          </div>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.enrollmentId}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {enrollment.avatar ? (
                      <Image
                        src={enrollment.avatar}
                        alt={enrollment.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-400 to-accent-600 text-white font-bold text-xl">
                        {enrollment.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-0.5">
                          {enrollment.username}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{enrollment.email}</p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className="bg-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 min-w-[45px]">
                            {enrollment.progress}%
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {enrollment.completed ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Hoàn thành
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Đang học
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(enrollment.enrolledAt)}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            enrollmentId: enrollment.enrollmentId,
                            username: enrollment.username,
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Xóa học viên"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * 20 + 1} -{" "}
              {Math.min(currentPage * 20, totalElements)} trong tổng số {totalElements} học viên
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-accent text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, enrollmentId: "", username: "" })}
        onConfirm={handleDelete}
        title="Xóa học viên"
        message={`Bạn có chắc chắn muốn xóa học viên <strong>${deleteModal.username}</strong> khỏi khóa học? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        isLoading={isDeleting}
      />
    </div>
  );
}
