"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UpdateProfileRequest, UserDetailResponse, UserStatus } from "@/types/user";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";

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
          className={`fixed inset-0 transition-all duration-300 ${isOpen ? 'backdrop-blur-sm' : ''
            }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chỉnh sửa người dùng
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cập nhật thông tin người dùng
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Avatar Section - Read Only for Admin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>

                {/* Avatar Preview - Read Only */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative h-20 w-20">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Avatar"
                        fill
                        sizes="80px"
                        className="rounded-full object-cover border border-gray-200"
                        unoptimized
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {formData.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Admin không thể thay đổi avatar của người dùng
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người dùng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username || ""}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 ${errors.username
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                      }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 ${errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trường đại học
                </label>
                <input
                  type="text"
                  value={formData.university || ""}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  placeholder="Nhập tên trường đại học..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200"
                />
              </div>

              {/* User Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái tài khoản <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.userStatus || UserStatus.ACTIVE}
                  onChange={(e) =>
                    handleInputChange("userStatus", e.target.value as UserStatus)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200"
                >
                  <option value={UserStatus.ACTIVE}>Hoạt động</option>
                  <option value={UserStatus.INACTIVE}>Không hoạt động</option>
                  <option value={UserStatus.BANNED}>Bị cấm</option>
                </select>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.mftEnable || false}
                    onChange={(e) => handleInputChange("mftEnable", e.target.checked)}
                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Bật xác thực hai yếu tố (2FA)
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Khi bật, người dùng sẽ cần xác thực bổ sung khi đăng nhập
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-red-700">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent-600 text-white rounded-lg hover:from-accent-600 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
