 "use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category.service";
import CreateCategoryModal from "@/components/admin/categories/CreateCategoryModal";
import { CategoryDetailResponse } from "@/types/category";
import { useConfirm } from "@/hooks/useConfirm";
import UpdateCategoryModal from "@/components/admin/categories/UpdateCategoryModal";

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
          <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
          <p className="text-sm text-gray-600">Tạo, xem và xóa các danh mục</p>
        </div>
        <div>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-accent text-white rounded-lg">Tạo danh mục</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          {isLoading ? (
            <div>Đang tải...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TÊN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÔ TẢ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TẠO LÚC</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-3 text-sm text-gray-900">{c.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{c.description || "-"}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                    <td className="px-6 py-3 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedCategory(c); setIsEditOpen(true); }} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Sửa</button>
                        <button onClick={() => handleDelete(c.id, c.name)} disabled={deletingId === c.id} className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50">
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


