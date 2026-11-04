"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryType } from "@/types/category";
import { categoryService } from "@/services/category.service";
import CategoryModalShell from "./CategoryModalShell";
import CategoryFormFields from "./CategoryFormFields";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCategoryType?: CategoryType;
  defaultType?: CategoryType;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCategoryType,
  defaultType,
}: CreateCategoryModalProps) {
  const initialType = defaultCategoryType || defaultType || CategoryType.POST;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryType(initialType);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
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
      await categoryService.create({
        name: name.trim(),
        description: description.trim() || undefined,
        categoryType,
      });

      toast.success("Tạo danh mục thành công");
      resetForm();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        apiError?.response?.data?.message || "Tạo danh mục thất bại";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo danh mục mới"
      subtitle="Thêm danh mục để phân loại bài viết và blog"
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
            form="create-category-form"
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Tạo danh mục
              </>
            )}
          </button>
        </>
      }
    >
      <form id="create-category-form" onSubmit={handleSubmit}>
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
