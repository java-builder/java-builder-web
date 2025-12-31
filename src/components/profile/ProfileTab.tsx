"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserDetailResponse } from "@/types/user";
import { userApi } from "@/services/user.service";

interface ProfileTabProps {
  user: UserDetailResponse;
  onSave?: (data: Partial<UserDetailResponse>) => Promise<void>;
  isSaving?: boolean;
}

export default function ProfileTab({
  user,
  isSaving,
  onSave,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || "");
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    university: user.university || "",
  });

  useEffect(() => {
    setCurrentAvatar(user.avatar || "");
  }, [user.avatar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasChanges =
      formData.username !== user.username ||
      formData.university !== (user.university || "");

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      await userApi.updateProfile({
        username: formData.username,
        university: formData.university,
      });
      if (onSave) {
        await onSave({
          username: formData.username,
          university: formData.university,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      university: user.university || "",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const response = await userApi.updateAvatar(file);

      if (response.result) {
        setCurrentAvatar(response.result);
        // Cập nhật user state để Sidebar cũng nhận được avatar mới
        if (onSave) {
          await onSave({ avatar: response.result });
        }
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Thông tin cá nhân
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Quản lý thông tin cá nhân của bạn
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-600 transition-colors"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-600 rounded-full flex items-center justify-center relative">
                  {currentAvatar ? (
                    <Image
                      key={currentAvatar}
                      src={`${currentAvatar}?t=${Date.now()}`}
                      alt={user.username || "User avatar"}
                      width={64}
                      height={64}
                      className="w-full h-full rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xl font-semibold text-white">
                      {user.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Ảnh đại diện
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    JPG, PNG hoặc GIF. Tối đa 5MB.
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer inline-block ${isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isUploadingAvatar ? "Đang tải lên..." : "Thay đổi ảnh"}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Trường đại học
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) =>
                    setFormData({ ...formData, university: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
                  placeholder="Nhập tên trường đại học"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
