"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category.service";
import CreateCategoryModal from "@/components/admin/categories/CreateCategoryModal";
import { CategoryDetailResponse } from "@/types/category";
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
  const { confirm } = useConfirm();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    await confirm(async () => {
      setDeletingId(id);
      try {
        await categoryService.deleteCategory(id);
        await fetchCategories();
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Tạo, xem và xóa các danh mục</p>
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Chưa có danh mục nào</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TÊN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MÔ TẢ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TẠO LÚC</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{c.description || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatReadableDate(c.createdAt)}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedCategory(c); setIsEditOpen(true); }}
                          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          disabled={deletingId === c.id}
                          className="px-3 py-1.5 text-sm rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingId === c.id ? "Đang xóa..." : "Xóa"}
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

      <CreateCategoryModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => fetchCategories()} />
      <UpdateCategoryModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedCategory(null); }} category={selectedCategory} onSuccess={() => { fetchCategories(); setSelectedCategory(null); }} />
    </div>
  );
}


