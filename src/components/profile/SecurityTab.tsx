"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { UserDetailResponse } from "@/types/user";
import { twoFactorApi } from "@/services/two-factor.service";
import TwoFactorModal from "./TwoFactorModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "react-hot-toast";

interface SecurityTabProps {
  user: UserDetailResponse;
  onUserUpdate?: (user: Partial<UserDetailResponse>) => void;
}

export default function SecurityTab({ user, onUserUpdate }: SecurityTabProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.mftEnable);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [error, setError] = useState("");
  const initialUserMftEnable = useRef(user.mftEnable);

  const handleUserUpdate = useCallback((updates: Partial<UserDetailResponse>) => {
    onUserUpdate?.(updates);
  }, [onUserUpdate]);

  useEffect(() => {
    const checkMfaStatus = async () => {
      try {
        const response = await twoFactorApi.getStatus();
        if (response.data !== undefined) {
          setTwoFactorEnabled(response.data);
          if (response.data !== initialUserMftEnable.current) {
            handleUserUpdate({ mftEnable: response.data });
          }
        }
      } catch (error) {
        console.error("Failed to check MFA status:", error);
        setTwoFactorEnabled(false);
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkMfaStatus();
  }, [handleUserUpdate]);

  const handleToggleTwoFactor = () => {
    setError("");
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
      toast.success("Đã tắt xác thực hai yếu tố!");
      
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
    toast.success("Đã bật xác thực hai yếu tố!");
    
    if (onUserUpdate) {
      onUserUpdate({ mftEnable: true });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bảo mật</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý các cài đặt bảo mật cho tài khoản của bạn</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Two-Factor Authentication Card */}
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-slate-500">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Xác thực hai yếu tố
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isInitialLoading 
                    ? "Đang kiểm tra trạng thái..." 
                    : twoFactorEnabled 
                      ? "Tài khoản được bảo vệ bằng xác thực hai yếu tố" 
                      : "Thêm lớp bảo mật bổ sung cho tài khoản"
                  }
                </p>
                {!isInitialLoading && twoFactorEnabled && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Đã kích hoạt
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isInitialLoading ? (
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse">
                    <div className="inline-block h-4 w-4 transform rounded-full bg-gray-300 dark:bg-gray-600 translate-x-1"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleToggleTwoFactor}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 ${
                      twoFactorEnabled ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium transition-colors duration-300 ${twoFactorEnabled ? "text-accent" : "text-gray-500 dark:text-gray-400"}`}>
                    {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Two-Factor Authentication Details - Only show when enabled */}
        {!isInitialLoading && twoFactorEnabled && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Bảo mật đã được kích hoạt</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Tài khoản của bạn được bảo vệ bằng mã xác thực 6 chữ số từ ứng dụng authenticator.
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Lưu ý:</strong> Hãy đảm bảo bạn luôn có quyền truy cập vào ứng dụng authenticator.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Tips - Only show when 2FA is not enabled */}
        {!isInitialLoading && !twoFactorEnabled && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Hướng dẫn sử dụng 2FA</h4>
                <ul className="space-y-1.5 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">1.</span>
                    <span>Tải ứng dụng <strong>Google Authenticator</strong> trên điện thoại</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">2.</span>
                    <span>Bật 2FA và quét mã QR bằng ứng dụng authenticator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">3.</span>
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
        )}
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