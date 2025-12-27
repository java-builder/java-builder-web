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
      // Show confirm modal for disable
      setShowDisableConfirm(true);
    } else {
      // Enable 2FA - show modal
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
      // Update user profile
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
    // Update user profile
    if (onUserUpdate) {
      onUserUpdate({ mftEnable: true });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Bảo mật</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Quản lý các cài đặt bảo mật cho tài khoản của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-2xl space-y-6">
          {/* Two-Factor Authentication */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-accent-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Xác thực hai yếu tố
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Thêm lớp bảo mật bổ sung cho tài khoản
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleTwoFactor}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    twoFactorEnabled
                      ? "bg-accent shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                      twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                {/* Status text outside toggle */}
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    twoFactorEnabled ? "text-accent-600" : "text-gray-500"
                  }`}
                >
                  {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
                </span>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
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
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-900">
                    Mật khẩu mạnh
                  </h4>
                  <p className="text-xs text-green-700">
                    Mật khẩu của bạn đã được bảo mật
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-lg p-4 border ${twoFactorEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${twoFactorEnabled ? "bg-green-100" : "bg-yellow-100"}`}
                >
                  {twoFactorEnabled ? (
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  ) : (
                    <svg
                      className="w-4 h-4 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${twoFactorEnabled ? "text-green-900" : "text-yellow-900"}`}
                  >
                    {twoFactorEnabled ? "2FA đã bật" : "2FA chưa bật"}
                  </h4>
                  <p
                    className={`text-xs ${twoFactorEnabled ? "text-green-700" : "text-yellow-700"}`}
                  >
                    {twoFactorEnabled
                      ? "Tài khoản được bảo vệ bởi 2FA"
                      : "Bật 2FA để tăng cường bảo mật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-4 h-4 text-accent-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-accent-900 mb-1">
                  Mẹo bảo mật
                </h4>
                <ul className="text-xs text-accent-800 space-y-1">
                  <li>• Bật xác thực hai yếu tố để tăng cường bảo mật</li>
                  <li>• Thường xuyên kiểm tra các hoạt động đăng nhập</li>
                  <li>• Sử dụng mật khẩu mạnh và duy nhất</li>
                  <li>• Không chia sẻ thông tin đăng nhập với người khác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-red-600 mt-0.5"
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
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-900">Lỗi</h4>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Factor Modal */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        onSuccess={handleTwoFactorSuccess}
      />

      {/* Disable 2FA Confirm Modal */}
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
