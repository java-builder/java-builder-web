"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserDetailResponse } from "@/types/user";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";

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

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Cập nhật thông tin thất bại.");
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
        toast.success("Cập nhật ảnh đại diện thành công!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(error instanceof Error ? error.message : "Cập nhật ảnh đại diện thất bại.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center">
                {currentAvatar ? (
                  <Image
                    key={currentAvatar}
                    src={`${currentAvatar}?t=${Date.now()}`}
                    alt={user.username || "User"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-semibold text-white">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              {/* Camera Icon Button */}
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                  className="hidden"
                  id="avatar-upload-icon"
                />
                <label
                  htmlFor="avatar-upload-icon"
                  className={`w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-accent/90 hover:scale-110 transition-all ${isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isUploadingAvatar ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Ảnh đại diện</h3>
              <p className="text-xs text-gray-500 mb-1">JPG, PNG hoặc GIF. Tối đa 5MB.</p>
              <p className="text-xs text-gray-400">Nhấn vào icon camera để thay đổi</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trường đại học
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Nhập tên trường đại học"
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
