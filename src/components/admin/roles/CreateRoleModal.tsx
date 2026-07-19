"use client";

import { useState } from "react";
import { AlertCircle, Shield, Loader2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { roleService } from "@/services/role.service";
import RoleModalShell from "./RoleModalShell";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (isLoading) return;
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên role");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await roleService.createRole({
        name: name.trim().toUpperCase(),
        description: description.trim(),
      });
      toast.success("Tạo role thành công");
      setName("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        apiError?.response?.data?.message || "Tạo role thất bại";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo role mới"
      subtitle="Thêm role bảo mật mới cho hệ thống (ví dụ: MODERATOR, EDITOR...)"
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
            form="create-role-form"
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
                Tạo role
              </>
            )}
          </button>
        </>
      }
    >
      <form id="create-role-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tên role <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Shield className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Ví dụ: EDITOR, MODERATOR..."
              autoFocus
              disabled={isLoading}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 uppercase transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            Tên role sẽ tự động được viết hoa
          </p>
          {error && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mô tả role
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chức năng, quyền hạn của role này..."
            disabled={isLoading}
            rows={5}
            maxLength={500}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <div className="flex justify-end mt-1 text-[11px] text-gray-400 dark:text-slate-500">
            Còn lại {500 - description.length} ký tự
          </div>
        </div>

        {/* Preview */}
        {name.trim() && (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Xem trước tag role
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-3 dark:border-slate-600 dark:bg-slate-900/30">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-pink-100 dark:bg-pink-900/30 px-2 py-0.5 text-sm font-semibold text-pink-700 dark:text-pink-400">
                <Shield className="h-3 w-3" />
                {name.trim().toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </form>
    </RoleModalShell>
  );
}
