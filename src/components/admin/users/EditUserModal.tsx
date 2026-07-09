"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UpdateProfileRequest, UserDetailResponse, UserStatus } from "@/types/user";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Check } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserDetailResponse | null;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<UserDetailResponse>>({
    username: "",
    email: "",
    university: "",
    userStatus: UserStatus.ACTIVE,
    mftEnable: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  // Reset form when user changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username,
        email: user.email,
        university: user.university || "",
        userStatus: user.userStatus,
        mftEnable: user.mftEnable,
      });
      setImagePreview(user.avatar || "");
      setErrors({});
    }
  }, [user, isOpen]);

  const handleInputChange = (
    field: keyof Partial<UserDetailResponse>,
    value: string | UserStatus | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Tên người dùng không được để trống";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) return;

    setIsLoading(true);
    try {
      const updateData: UpdateProfileRequest = {
        username: formData.username?.trim() || undefined,
        university: formData.university?.trim() || undefined,
        userStatus: formData.userStatus,
      };

      // Cập nhật thông tin profile bởi admin
      await userApi.updateProfileByAdmin(user.id, updateData);
      toast.success("Cập nhật người dùng thành công!");
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      setErrors((prev) => ({
        ...prev,
        submit: (error as Error)?.message || "Có lỗi xảy ra khi cập nhật người dùng",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      university: "",
      userStatus: UserStatus.ACTIVE,
      mftEnable: false,
    });
    setErrors({});
    setImagePreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div className={`relative w-full max-w-2xl bg-card border border-border text-foreground rounded-2xl shadow-2xl transform transition-all duration-300 ease-out`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Chỉnh sửa người dùng
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Cập nhật thông tin người dùng
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Avatar Section - Read Only for Admin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Ảnh đại diện
                </label>

                {/* Avatar Preview - Read Only */}
                <div className="flex items-center space-x-4 p-3 rounded-lg border border-border bg-muted/40">
                  <div className="relative h-16 w-16">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Avatar"
                        fill
                        sizes="64px"
                        className="rounded-full object-cover border border-border"
                        unoptimized
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {formData.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Ảnh đại diện người dùng</p>
                    <p className="text-[11px] text-muted-foreground">
                      Quản trị viên không thể thay đổi avatar của người dùng
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Tên người dùng <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username || ""}
                    disabled
                    className="flex h-10 w-full rounded-md border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground shadow-sm cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    disabled
                    className="flex h-10 w-full rounded-md border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-not-allowed"
                  />
                </div>
              </div>

              {/* University */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Trường đại học
                </label>
                <input
                  type="text"
                  value={formData.university || ""}
                  disabled
                  placeholder="Chưa cập nhật thông tin trường đại học"
                  className="flex h-10 w-full rounded-md border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground shadow-sm cursor-not-allowed"
                />
              </div>

              {/* Account Status and Two-Factor Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Trạng thái tài khoản <span className="text-destructive">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.userStatus || UserStatus.ACTIVE}
                      onChange={(e) =>
                        handleInputChange("userStatus", e.target.value as UserStatus)
                      }
                      className="appearance-none flex h-10 w-full rounded-md border border-input bg-background text-foreground pl-3.5 pr-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring cursor-pointer hover:bg-muted/10 dark:hover:bg-slate-700/20"
                    >
                      <option value={UserStatus.ACTIVE}>🟢 Hoạt động</option>
                      <option value={UserStatus.INACTIVE}>🔴 Không hoạt động</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication - Display Only */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Xác thực 2 yếu tố (2FA)
                  </label>
                  <div className="flex items-center space-x-3 px-3 h-10 rounded-md border border-border bg-muted/30 cursor-not-allowed select-none">
                    <input
                      type="checkbox"
                      id="mftEnable"
                      disabled
                      checked={formData.mftEnable || false}
                      className="h-4 w-4 rounded border-input text-accent focus:ring-accent dark:bg-slate-800 disabled:opacity-50 cursor-not-allowed"
                    />
                    <label htmlFor="mftEnable" className="text-sm font-medium text-muted-foreground cursor-not-allowed">
                      {formData.mftEnable ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-destructive font-medium">{errors.submit}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isLoading}
                className="gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Cập nhật
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
