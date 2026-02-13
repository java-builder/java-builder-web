"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateCourseModal from "@/components/admin/courses/CreateCourseModal";
import EnrollUserModal from "@/components/admin/courses/EnrollUserModal";
import { CourseFilters } from "@/components/admin/courses/CourseFilters";
import { CourseStatsCards } from "@/components/admin/courses/CourseStatsCards";
import { CourseCard } from "@/components/admin/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { courseApi } from "@/services/course.service";
import { DeleteModalState } from "@/types/admin";
import { formatCurrency } from "@/utils/formatters";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    id: "",
    title: "",
  });
  const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean; courseId: string; courseTitle: string }>({
    isOpen: false,
    courseId: "",
    courseTitle: "",
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useCourses(1, 20);
  const courses = data?.data || [];
  const stats = {
    total: data?.totalElements || 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalStudents: 0,
    totalRevenue: 0,
  };

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "Design",
    "DevOps",
    "Data Science",
  ];

  const handleDelete = async (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    setIsDeleting(id);
    try {
      await courseApi.delete(id);
      setDeleteModal({ isOpen: false, id: "", title: "" });
      refetch();
    } catch {
    } finally {
      setIsDeleting("");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    try {
      if (typeof window !== "undefined" && searchParams.get("create") === "1") {
        router.replace(window.location.pathname);
      }
    } catch {}
  };

  const handleCreateSuccess = () => {
    closeCreateModal();
    refetch();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quản lý Khóa học
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi tất cả khóa học trong hệ thống JavaBuilder
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo khóa học mới
            </button>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <CourseStatsCards stats={stats} formatRevenue={formatCurrency} />

      <CourseFilters
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        levelFilter={levelFilter}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onLevelChange={setLevelFilter}
      />

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-700 font-medium">{(error as Error).message}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-indigo-600 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm text-indigo-700 font-medium">
              Đang tải khóa học...
            </span>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="space-y-4">
        {!isLoading && courses.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Chưa có khóa học nào</h3>
            <p className="text-sm text-gray-500 mb-4">Bắt đầu tạo khóa học đầu tiên</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors"
            >
              Tạo khóa học mới
            </button>
          </div>
        )}

        {!isLoading && courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            openMenuId={openMenuId}
            isDeleting={isDeleting}
            onMenuToggle={(id) => setOpenMenuId(openMenuId === id ? null : id)}
            onDelete={handleDelete}
            onEnroll={(courseId, courseTitle) => setEnrollModal({ isOpen: true, courseId, courseTitle })}
          />
        ))}
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
        onConfirm={confirmDelete}
        title="Xóa khóa học"
        message={`Bạn có chắc chắn muốn xóa khóa học <strong>${deleteModal.title}</strong>? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={isDeleting === deleteModal.id}
        type="danger"
      />

      {/* Enroll User Modal */}
      <EnrollUserModal
        isOpen={enrollModal.isOpen}
        onClose={() => setEnrollModal({ isOpen: false, courseId: "", courseTitle: "" })}
        onSuccess={() => refetch()}
        courseId={enrollModal.courseId}
        courseTitle={enrollModal.courseTitle}
      />
    </div>
  );
}
