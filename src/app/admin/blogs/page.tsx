"use client";

import { useState, useEffect, useCallback } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import CreateBlogModal from "@/components/admin/blogs/CreateBlogModal";
import BlogGrid from "@/components/admin/blogs/BlogGrid";
import BlogSuccessToast from "@/components/admin/blogs/BlogSuccessToast";
import BlogPreviewModal from "@/components/admin/blogs/BlogPreviewModal";
import { Blog } from "@/types/blog";
import { blogService } from "@/services/blog.service";


export default function BlogsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Grid view removed - always show table
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
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

      setBlogs(response.result);
      setPagination({
        page: response.currentPages,
        size: response.pageSizes,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
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

  const handleDelete = async (id: string, title: string) => {
    await confirm(
      async () => {
        setIsDeleting(id);
        try {
          await blogService.deleteBlog(id);

          await fetchBlogs();
        } catch (error) {
          console.error("Error deleting blog:", error);
        } finally {
          setIsDeleting("");
        }
      },
      {
        title: "📝 Xác nhận xóa bài viết",
        message: `
                    <div style="text-align: center; line-height: 1.5;">
                        <p style="margin-bottom: 8px;">Bạn có chắc chắn muốn xóa bài viết</p>
                        <p style="font-weight: 700; color: #dc2626; font-size: 14px; margin: 8px 0; padding: 6px 12px; background: #fef2f2; border-radius: 6px; display: inline-block; max-width: 280px; word-wrap: break-word;">
                            "${title}"
                        </p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                            ⚠️ Hành động này không thể hoàn tác
                        </p>
                    </div>
                `,
        confirmText: "🗑️ Xóa bài viết",
        cancelText: "❌ Hủy bỏ",
        type: "error",
      },
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredStats = getFilteredStats();
  // years/filter removed

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Blog</h1>
            <p className="mt-2 text-sm text-gray-600">
              Thống kê và quản lý tất cả bài viết blog trong hệ thống
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200"
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
              Tạo bài viết mới
            </button>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-accent-100 rounded-lg">
              <svg
                className="w-6 h-6 text-accent-600"
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
              <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
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
              <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStats.published}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
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
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStats.draft}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg
                className="w-6 h-6 text-gray-600"
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
              <p className="text-sm font-medium text-gray-600">Lưu trữ</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStats.archived}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
        <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 text-accent-600 mr-2"
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
            <span className="text-sm text-accent-700">
              Đang cập nhật dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Blog Content - cards only */}
      <BlogGrid
        blogs={blogs}
        onEdit={(blog) => {
          console.log("Edit blog:", blog);
        }}
        onDelete={handleDelete}
        onPreview={(blog) => setPreviewBlog(blog)}
        isDeleting={isDeleting}
        isLoading={isLoading}
      />

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchBlogs(); // Refresh the blog list
          setShowSuccessToast(true);
        }}
      />

      {/* Success Toast */}
      <BlogSuccessToast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={!!previewBlog}
        onClose={() => setPreviewBlog(null)}
        blog={previewBlog}
      />
    </div>
  );
}
