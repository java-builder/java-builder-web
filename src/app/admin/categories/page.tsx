"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { useConfirm } from "@/hooks/useConfirm";
import {
  CategoriesHeader,
  CategoryTable,
  CategoryTabs,
  CreateCategoryModal,
  UpdateCategoryModal,
} from "@/components/admin/categories";

export default function CategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetailResponse | null>(null);

  const [postCategories, setPostCategories] = useState<CategoryDetailResponse[]>(
    []
  );
  const [blogCategories, setBlogCategories] = useState<CategoryDetailResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.POST);
  const { confirm } = useConfirm();

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [postRes, blogRes] = await Promise.all([
        categoryService.getAll(CategoryType.POST),
        categoryService.getAll(CategoryType.BLOG),
      ]);
      setPostCategories(postRes.data || []);
      setBlogCategories(blogRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    await confirm(
      async () => {
        setDeletingId(id);
        try {
          await categoryService.deleteCategory(id);
          await fetchAll();
        } catch (e) {
          console.error(e);
        } finally {
          setDeletingId(null);
        }
      },
      {
        title: "Xác nhận xoá danh mục",
        message: `<div>Bạn có chắc muốn xoá danh mục <strong>${name}</strong>?</div>`,
        confirmText: "Xoá",
        cancelText: "Huỷ",
        type: "error",
      }
    );
  };

  const handleEdit = (category: CategoryDetailResponse) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const categories =
    activeTab === CategoryType.BLOG ? blogCategories : postCategories;
  const totalCount = postCategories.length + blogCategories.length;

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <CategoriesHeader
        totalCount={totalCount}
        onCreate={() => setIsCreateOpen(true)}
      />

      <CategoryTabs
        activeTab={activeTab}
        postCount={postCategories.length}
        blogCount={blogCategories.length}
        onChange={setActiveTab}
      />

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateCategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchAll}
      />
      <UpdateCategoryModal
        isOpen={isEditOpen}
        category={selectedCategory}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          fetchAll();
          setSelectedCategory(null);
        }}
      />
    </div>
  );
}
