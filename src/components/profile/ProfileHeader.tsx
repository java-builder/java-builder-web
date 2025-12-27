"use client";

import { useState } from "react";
import Image from "next/image";
import { UserDetailResponse, UserStatus } from "@/types/user";

interface ProfileHeaderProps {
  user: UserDetailResponse;
  isEditable?: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({
  user,
  isEditable = false,
  onEdit,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case UserStatus.INACTIVE:
        return "bg-yellow-100 text-yellow-800";
      case UserStatus.BANNED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "Hoạt động";
      case UserStatus.INACTIVE:
        return "Không hoạt động";
      case UserStatus.BANNED:
        return "Bị cấm";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-teal-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl border-4 border-white">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username || "User avatar"}
                  width={160}
                  height={160}
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                <div className="text-white text-5xl font-bold">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
              <div
                className={`w-7 h-7 rounded-full ${getStatusColor(user.userStatus)} flex items-center justify-center`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {user.username || "Người dùng"}
                </h1>
                <p className="text-xl font-medium text-gray-800 mb-4">
                  {user.email || "Chưa có email"}
                </p>
                {user.university && (
                  <div className="flex items-center gap-3 text-gray-700 mb-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-lg font-semibold text-gray-800">
                      {user.university}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-base font-medium ${getStatusColor(user.userStatus)}`}
                  >
                    {getStatusText(user.userStatus)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditable && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(!isEditing);
                      onEdit?.();
                    }}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
