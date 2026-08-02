"use client";

import { useState, useEffect, useCallback } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import CreateBlogModal from "@/components/admin/blogs/CreateBlogModal";
import UpdateBlogModal from "@/components/admin/blogs/UpdateBlogModal";
import BlogGrid from "@/components/admin/blogs/BlogGrid";
import BlogSuccessToast from "@/components/admin/blogs/BlogSuccessToast";
import BlogPreviewModal from "@/components/admin/blogs/BlogPreviewModal";
import { Blog } from "@/types/blog";
import { blogService } from "@/services/blog.service";
import { Pagination } from "@/components/ui/Pagination";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

export default function BlogsPage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: "Tạo bài viết thành công!",
    description: "Bài viết đã được lưu vào hệ thống",
  });
  const [previewBlogSlug, setPreviewBlogSlug] = useState<string | null>(null);
  const { confirm } = useConfirm();

  // State cho blogs và pagination
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await blogService.getBlogs({
        page: pagination.page,
        titleOrSummary: search || undefined,
      });

      setBlogs(response.data?.data || []);
      setPagination({
        page: response.data?.currentPage || 0,
        size: response.data?.pageSize || 10,
        totalElements: response.data?.totalElements || 0,
        totalPages: response.data?.totalPages || 0,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, search]);

  const getFilteredStats = () => {
    const total = blogs.length;
    const published = blogs.length;
    return {
      total,
      published,
      draft: 0,
      archived: 0,
    };
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id: string, title: string) => {
    await confirm(
      async () => {
        setIsDeleting(id);
        try {
          await blogService.deleteBlog(id);
          fetchBlogs();
        } catch (error) {
          console.error("Error deleting blog:", error);
        } finally {
          setIsDeleting("");
        }
      },
      {
        title: "Xác nhận xoá bài viết",
        message: `Bạn có chắc muốn xoá bài viết <strong>"${title}"</strong>?`,
        confirmText: "Xoá bài viết",
        cancelText: "Hủy",
        type: "warning",
      }
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredStats = getFilteredStats();

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("admin.blogs.pageTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("admin.blogs.pageSubtitle")}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="accent"
              className="gap-2 h-9 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {t("admin.blogs.createBtn")}
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tổng bài viết</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {filteredStats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Đã xuất bản</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {filteredStats.published}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-950/20 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Bản nháp</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {filteredStats.draft}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-muted rounded-lg">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Lưu trữ</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {filteredStats.archived}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-muted/30 rounded-xl p-6 mb-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder-muted-foreground text-sm transition-colors duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-muted-foreground"
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
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="mb-4 p-3 bg-accent/5 border border-accent/15 rounded-lg animate-pulse">
          <div className="flex items-center">
            <span className="text-sm font-medium text-accent">
              Đang cập nhật dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Blog Content - cards only */}
      <BlogGrid
        blogs={blogs}
        onEdit={(blog) => {
          setSelectedBlogSlug(blog.slug);
          setIsUpdateModalOpen(true);
        }}
        onDelete={handleDelete}
        onPreview={(blog) => setPreviewBlogSlug(blog.slug)}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.size}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          itemName="bài viết"
        />
      )}

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchBlogs(); // Refresh the blog list
          setToastConfig({
            message: "Tạo bài viết thành công!",
            description: "Bài viết mới đã được lưu vào hệ thống.",
          });
          setShowSuccessToast(true);
        }}
      />

      {/* Update Blog Modal */}
      <UpdateBlogModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedBlogSlug(null);
        }}
        onSuccess={() => {
          fetchBlogs(); // Refresh the blog list
          setToastConfig({
            message: "Cập nhật bài viết thành công!",
            description: "Các thay đổi đã được lưu vào hệ thống.",
          });
          setShowSuccessToast(true);
        }}
        blogSlug={selectedBlogSlug}
      />

      {/* Success Toast */}
      <BlogSuccessToast
        show={showSuccessToast}
        message={toastConfig.message}
        description={toastConfig.description}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={!!previewBlogSlug}
        onClose={() => setPreviewBlogSlug(null)}
        blogSlug={previewBlogSlug}
      />
    </div>
  );
}
