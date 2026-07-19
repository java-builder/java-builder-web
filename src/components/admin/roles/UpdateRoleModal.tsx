"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Shield, ShieldAlert, Clock, Loader2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { RoleDetailResponse } from "@/types/role";
import { roleService } from "@/services/role.service";
import RoleModalShell from "./RoleModalShell";
import { formatReadableDateTime } from "@/utils/dateUtils";

interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleDetailResponse | null;
  onSuccess: () => void;
}

export default function UpdateRoleModal({
  isOpen,
  onClose,
  role,
  onSuccess,
}: UpdateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || "");
    }
  }, [role]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsLoading(true);
    try {
      await roleService.updateRole(role.id, {
        description: description.trim(),
      });
      toast.success("Cập nhật role thành công");
      onSuccess();
      onClose();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError?.response?.data?.message || "Cập nhật role thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa role"
      subtitle="Chỉnh sửa mô tả vai trò bảo mật hệ thống"
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
            form="update-role-form"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
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
      <form id="update-role-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Info Alert */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 dark:bg-amber-950/20 dark:border-amber-900/50">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-400">
              <span className="font-semibold">Tên role không thể thay đổi</span>.
              Hệ thống không cho phép sửa đổi tên role sau khi tạo để tránh phá vỡ các quy tắc bảo mật và quyền hạn đang chạy.
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Tên role
            </label>
            <div className="relative">
              {name === "ADMIN" ? (
                <ShieldAlert className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-red-500" />
              ) : (
                <Shield className={`absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${name === "USER" ? "text-emerald-500" : "text-indigo-500"}`} />
              )}
              <input
                type="text"
                value={name}
                readOnly
                disabled
                className="block w-full rounded-lg border border-gray-205 bg-gray-50/85 py-2 pl-8 pr-3 text-sm text-gray-500 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Ngày tạo
              </label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={formatReadableDateTime(role?.createdAt || "")}
                  readOnly
                  disabled
                  className="block w-full rounded-lg border border-gray-205 bg-gray-50/85 py-2 pl-8 pr-3 text-xs text-gray-500 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Cập nhật lần cuối
              </label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={formatReadableDateTime(role?.updatedAt || role?.createdAt || "")}
                  readOnly
                  disabled
                  className="block w-full rounded-lg border border-gray-205 bg-gray-50/85 py-2 pl-8 pr-3 text-xs text-gray-500 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </RoleModalShell>
  );
}
