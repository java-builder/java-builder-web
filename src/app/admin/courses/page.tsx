"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateCourseModal from "@/components/admin/courses/CreateCourseModal";
import EnrollUserModal from "@/components/admin/courses/EnrollUserModal";
import { CourseFilters } from "@/components/admin/courses/CourseFilters";
import { CourseStatsCards } from "@/components/admin/courses/CourseStatsCards";
import { CourseCard } from "@/components/admin/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { courseApi } from "@/services/course.service";
import { reportApi } from "@/services/report.service";
import { DeleteModalState } from "@/types/admin";
import { formatCurrency } from "@/utils/formatters";
import { CourseFormat, CourseLevel } from "@/types/course";
import { CourseOverviewResponse } from "@/types/report";
import { Button } from "@/components/ui/button";
import { Plus, RotateCw, AlertCircle, BookOpen } from "lucide-react";

type CourseFormatTab = CourseFormat | "ALL";

import { useI18n } from "@/contexts/I18nContext";

export default function CoursesPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<CourseFormatTab>("ALL");
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
  const [courseOverview, setCourseOverview] = useState<CourseOverviewResponse | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);

  const { data, isLoading, error, refetch } = useCourses(
    1,
    20,
    undefined,
    levelFilter === "all" ? undefined : (levelFilter as CourseLevel),
    activeTab === "ALL" ? undefined : activeTab
  );
  const courses = data?.data || [];
  const stats = {
    total: courseOverview?.totalCourses || 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalStudents: courseOverview?.totalStudents || 0,
    totalRevenue: courseOverview?.totalRevenue || 0,
  };

  const fetchCourseOverview = useCallback(async () => {
    try {
      setIsLoadingOverview(true);
      const response = await reportApi.getCourseOverview();
      if (response.data) {
        setCourseOverview(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch course overview:", error);
    } finally {
      setIsLoadingOverview(false);
    }
  }, []);

  useEffect(() => {
    fetchCourseOverview();
  }, [fetchCourseOverview]);

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
    } catch { }
  };

  const handleCreateSuccess = () => {
    closeCreateModal();
    refetch();
  };

  const filteredCourses = courses.filter((course) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      course.title.toLowerCase().includes(term) ||
      (course.description && course.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("admin.courses.pageTitle")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("admin.courses.pageSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="accent"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 font-medium cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            {t("admin.courses.createCourseBtn")}
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {t("admin.questionContributions.refreshBtn")}
          </Button>
        </div>
      </div>

      <CourseStatsCards stats={stats} formatRevenue={formatCurrency} isLoading={isLoadingOverview} />

      <CourseFilters
        search={search}
        levelFilter={levelFilter}
        formatFilter={activeTab}
        onSearchChange={setSearch}
        onLevelChange={setLevelFilter}
        onFormatChange={setActiveTab}
        onClearFilters={() => {
          setSearch("");
          setLevelFilter("all");
          setActiveTab("ALL");
        }}
      />

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/25 text-destructive rounded-xl p-4 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{(error as Error).message}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="aspect-video bg-muted rounded-lg w-full" />
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
              <div className="flex justify-between pt-4 border-t border-border">
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      <div className="space-y-4">
        {!isLoading && filteredCourses.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Chưa có khóa học nào</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search.trim() ? "Không tìm thấy khóa học phù hợp với từ khóa tìm kiếm" : "Bắt đầu tạo khóa học đầu tiên bằng cách nhấn nút bên dưới"}
            </p>
            {!search.trim() && (
              <Button
                variant="accent"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Tạo khóa học mới
              </Button>
            )}
          </div>
        )}

        {!isLoading && filteredCourses.map((course) => (
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
