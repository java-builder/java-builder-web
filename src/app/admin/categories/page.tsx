"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category.service";
import CreateCategoryModal from "@/components/admin/categories/CreateCategoryModal";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { useConfirm } from "@/hooks/useConfirm";
import UpdateCategoryModal from "@/components/admin/categories/UpdateCategoryModal";
import { formatReadableDate } from "@/utils/dateUtils";

export default function CategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetailResponse | null>(null);
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.POST);
  const { confirm } = useConfirm();

  const fetchCategories = async (type: CategoryType) => {
    setIsLoading(true);
    try {
      const res = await categoryService.getAll(type);
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(activeTab);
  }, [activeTab]);

  const handleDelete = async (id: string, name: string) => {
    await confirm(async () => {
      setDeletingId(id);
      try {
        await categoryService.deleteCategory(id);
        await fetchCategories(activeTab);
      } catch (e) {
        console.error(e);
      } finally {
        setDeletingId(null);
      }
    }, {
      title: "Xác nhận xóa danh mục",
      message: `<div>Bạn có chắc muốn xóa danh mục <strong>${name}</strong>?</div>`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "error",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý danh mục</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Tạo, xem và xóa các danh mục</p>
        </div>
        <div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Tạo danh mục
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab(CategoryType.POST)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === CategoryType.POST
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Bài viết
            </button>
            <button
              onClick={() => setActiveTab(CategoryType.BLOG)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === CategoryType.BLOG
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Blog
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-300">Chưa có danh mục nào</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TÊN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">LOẠI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">MÔ TẢ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TẠO LÚC</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.categoryType === CategoryType.BLOG
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {c.categoryType === CategoryType.BLOG ? "Blog" : "Bài viết"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{c.description || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatReadableDate(c.createdAt)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => { setSelectedCategory(c); setIsEditOpen(true); }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
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
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          disabled={deletingId === c.id}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-800 text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {deletingId === c.id ? (
                            <>
                              <svg
                                className="animate-spin w-4 h-4 mr-1"
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
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
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
                              Xóa
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CreateCategoryModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => fetchCategories(activeTab)} />
      <UpdateCategoryModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedCategory(null); }} category={selectedCategory} onSuccess={() => { fetchCategories(activeTab); setSelectedCategory(null); }} />
    </div>
  );
}


