"use client";

import { useState } from "react";
import { userApi } from "@/services/user.service";
import { CreateUserRequest } from "@/types/user";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, X, ShieldAlert } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserRequest>({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreateUserRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = "Tên người dùng không được để trống";
    if (!form.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.password || form.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await userApi.create(form);
      toast.success("Tạo người dùng thành công!");
      onSuccess();
      handleClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: (err as Error)?.message || "Có lỗi xảy ra khi tạo người dùng"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ username: "", email: "", password: "" });
    setErrors({});
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
        <div className={`relative w-full max-w-lg bg-card border border-border text-foreground rounded-2xl shadow-2xl transform transition-all duration-300 ease-out`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Plus className="h-5 w-5 text-accent dark:text-accent-on-dark" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Thêm người dùng mới
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tạo tài khoản mới cho người dùng hệ thống
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Tên người dùng <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Nhập tên người dùng..."
                  className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.username
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-input"
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Nhập địa chỉ email..."
                  className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-input"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Mật khẩu <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-input"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Mật khẩu phải có ít nhất 6 ký tự
                </p>
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
                Hủy
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isLoading}
                className="gap-1.5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Tạo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
