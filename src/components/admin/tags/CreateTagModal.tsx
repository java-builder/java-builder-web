"use client";

import { useState } from "react";
import { AlertCircle, Hash, Loader2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { tagService } from "@/services/tag.service";
import TagModalShell from "./TagModalShell";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTagModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTagModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (isLoading) return;
    setName("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên tag");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await tagService.createTag({ name: name.trim() });
      toast.success("Tạo tag thành công");
      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        apiError?.response?.data?.message || "Tạo tag thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TagModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo tag mới"
      subtitle="Thêm tag để phân loại bài viết và bộ câu hỏi"
      isLocked={isLoading}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
          >
            Huỷ
          </button>
          <button
            type="submit"
            form="create-tag-form"
            disabled={isLoading || !name.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Tạo tag
              </>
            )}
          </button>
        </>
      }
    >
      <form id="create-tag-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tên tag <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Hash className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Ví dụ: JavaScript, React, Spring Boot..."
              autoFocus
              disabled={isLoading}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            Slug sẽ được tự động tạo từ tên tag
          </p>
          {error && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>

        {/* Preview */}
        {name.trim() && (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Xem trước
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-3 dark:border-slate-600 dark:bg-slate-900/30">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-sm font-semibold text-accent">
                <Hash className="h-3 w-3" />
                {name.trim()}
              </span>
            </div>
          </div>
        )}
      </form>
    </TagModalShell>
  );
}
