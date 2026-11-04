"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { categoryService } from "@/services/category.service";
import CategoryModalShell from "./CategoryModalShell";
import CategoryFormFields from "./CategoryFormFields";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  category: CategoryDetailResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateCategoryModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: UpdateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.POST);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setCategoryType(category.categoryType || CategoryType.POST);
    }
  }, [category]);

  if (!category) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setIsSubmitting(true);
    try {
      await categoryService.updateCategory(category.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        categoryType,
      });

      toast.success("Cập nhật danh mục thành công");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        apiError?.response?.data?.message || "Cập nhật danh mục thất bại";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Cập nhật danh mục"
      subtitle={`Chỉnh sửa thông tin của "${category.name}"`}
      isLocked={isSubmitting}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary-soft/50 hover:text-primary disabled:opacity-50 cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="submit"
            form="update-category-form"
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </>
      }
    >
      <form id="update-category-form" onSubmit={handleSubmit}>
        <CategoryFormFields
          name={name}
          description={description}
          categoryType={categoryType}
          isLocked={isSubmitting}
          onChange={(patch) => {
            if (patch.name !== undefined) setName(patch.name);
            if (patch.description !== undefined) setDescription(patch.description);
            if (patch.categoryType !== undefined) setCategoryType(patch.categoryType);
          }}
        />
      </form>
    </CategoryModalShell>
  );
}
