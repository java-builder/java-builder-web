"use client";

import { useState } from "react";
import { enrollmentApi } from "@/services/enrollment.service";
import toast from "react-hot-toast";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnrollUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courseId: string;
  courseTitle: string;
}

export default function EnrollUserModal({
  isOpen,
  onClose,
  onSuccess,
  courseId,
  courseTitle,
}: EnrollUserModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email không được để trống");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await enrollmentApi.adminEnrollUser(email, courseId);
      toast.success("Thêm học viên vào khóa học thành công!");
      onSuccess?.();
      handleClose();
    } catch {
      toast.error("Thêm học viên thất bại. Vui lòng thử lại.");
      setError("Không thể thêm học viên. Email không tồn tại hoặc đã được đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal content */}
        <div className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <UserPlus className="h-5 w-5 text-accent dark:text-accent-on-dark" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground">Thêm học viên</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={courseTitle}>
                  {courseTitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-1.5 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email học viên
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="example@email.com"
                  className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-4 border-t border-border bg-muted/40 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <span>Thêm học viên</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
