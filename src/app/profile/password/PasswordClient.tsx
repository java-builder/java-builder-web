"use client";

import PasswordTab from "@/components/profile/PasswordTab";

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Đổi mật khẩu
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
        </div>
        
        <PasswordTab />
      </div>
    </div>
  );
}
