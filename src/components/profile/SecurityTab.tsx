"use client";

import { useState } from "react";
import { twoFactorApi } from "@/services/two-factor.service";
import { UserDetailResponse } from "@/types/user";
import TwoFactorModal from "./TwoFactorModal";
import ConfirmModal from "@/components/common/ConfirmModal";

interface SecurityTabProps {
  user: UserDetailResponse;
  onUserUpdate?: (user: Partial<UserDetailResponse>) => void;
}

export default function SecurityTab({ user, onUserUpdate }: SecurityTabProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.mftEnable);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleToggleTwoFactor = () => {
    if (twoFactorEnabled) {
      setShowDisableConfirm(true);
    } else {
      setShowTwoFactorModal(true);
    }
  };

  const handleDisableTwoFactor = async () => {
    try {
      setIsLoading(true);
      setError("");
      await twoFactorApi.disable();
      setTwoFactorEnabled(false);
      setShowDisableConfirm(false);
      if (onUserUpdate) {
        onUserUpdate({ mftEnable: false });
      }
    } catch (error: unknown) {
      let errorMessage = "Không thể tắt 2FA";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = () => {
    setTwoFactorEnabled(true);
    setShowTwoFactorModal(false);
    if (onUserUpdate) {
      onUserUpdate({ mftEnable: true });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Bảo mật</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý các cài đặt bảo mật cho tài khoản của bạn</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Two-Factor Authentication Card */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Xác thực hai yếu tố
                </h3>
                <p className="text-sm text-gray-600">
                  Thêm lớp bảo mật bổ sung cho tài khoản
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleTwoFactor}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 ${
                  twoFactorEnabled ? "bg-accent" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${twoFactorEnabled ? "text-accent" : "text-gray-500"}`}>
                {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
              </span>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Hướng dẫn sử dụng 2FA</h4>
              <ul className="space-y-1.5 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">1.</span>
                  <span>Tải ứng dụng <strong>Google Authenticator</strong> trên điện thoại</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">2.</span>
                  <span>Bật 2FA và quét mã QR bằng ứng dụng authenticator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">3.</span>
                  <span>Nhập mã 6 số từ ứng dụng để xác thực</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">4.</span>
                  <span>Khi đăng nhập, bạn sẽ cần nhập mã từ ứng dụng authenticator</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">Lỗi</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        onSuccess={handleTwoFactorSuccess}
      />

      <ConfirmModal
        isOpen={showDisableConfirm}
        onClose={() => setShowDisableConfirm(false)}
        onConfirm={handleDisableTwoFactor}
        title="Tắt xác thực 2 bước"
        message="Bạn có chắc chắn muốn tắt xác thực 2 bước? Tài khoản của bạn sẽ kém an toàn hơn."
        confirmText="Tắt 2FA"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
