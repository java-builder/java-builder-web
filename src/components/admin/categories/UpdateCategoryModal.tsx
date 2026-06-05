"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  CategoryDetailResponse,
  CategoryType,
  UpdateCategoryRequest,
} from "@/types/category";
import { categoryService } from "@/services/category.service";
import CategoryModalShell from "./CategoryModalShell";
import CategoryFormFields from "./CategoryFormFields";
import { DEFAULT_COLOR, DEFAULT_ICON } from "./helpers";

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryDetailResponse | null;
  onSuccess?: () => void;
}

export default function UpdateCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: UpdateCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [categoryType, setCategoryType] = useState<CategoryType>(
    CategoryType.BLOG
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIcon(category.icon || DEFAULT_ICON);
      setColor(category.color || DEFAULT_COLOR);
      setCategoryType(category.categoryType || CategoryType.BLOG);
    }
  }, [category]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateCategoryRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        color,
        categoryType,
      };
      await categoryService.updateCategory(category.id, payload);
      toast.success("Cập nhật danh mục thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        apiError?.response?.data?.message || "Cập nhật danh mục thất bại";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) return null;

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
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Huỷ
          </button>
          <button
            type="submit"
            form="update-category-form"
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
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
          icon={icon}
          color={color}
          categoryType={categoryType}
          isLocked={isSubmitting}
          onChange={(patch) => {
            if (patch.name !== undefined) setName(patch.name);
            if (patch.description !== undefined) setDescription(patch.description);
            if (patch.icon !== undefined) setIcon(patch.icon);
            if (patch.color !== undefined) setColor(patch.color);
            if (patch.categoryType !== undefined) setCategoryType(patch.categoryType);
          }}
        />
      </form>
    </CategoryModalShell>
  );
}
