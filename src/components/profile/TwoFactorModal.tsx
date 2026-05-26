"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { twoFactorApi } from "@/services/two-factor.service";
import { TwoFactorSetupResponse } from "@/types/two-factor";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TwoFactorModal({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorModalProps) {
  const { t } = useI18n();
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeError, setQrCodeError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSetup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await twoFactorApi.activate();
      if (response.data) {
        setSetupData(response.data);
      }
    } catch (error: unknown) {
      let errorMessage = t("profilePage.twoFactorModal.setupFailed");
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
  }, [t]);

  useEffect(() => {
    if (isOpen) {
      handleSetup();
    }
  }, [isOpen, handleSetup]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast.error(t("profilePage.twoFactorModal.enterCodeToast"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await twoFactorApi.verifyCodeSetup({ code: verificationCode });
      onSuccess();
      onClose();
    } catch (error: unknown) {
      let errorMessage = t("profilePage.twoFactorModal.invalidCode");
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

  const handleClose = () => {
    if (setupData) {
      setShowConfirm(true);
    } else {
      doClose();
    }
  };

  const doClose = () => {
    setSetupData(null);
    setVerificationCode("");
    setError("");
    setQrCodeError(false);
    setShowConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 dark:border-slate-700 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("profilePage.twoFactorModal.modalTitle")}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t("profilePage.twoFactorModal.settingUp")}
                </p>
              </div>
            ) : setupData ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t("profilePage.twoFactorModal.scanQr")}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    {t("profilePage.twoFactorModal.scanQrDesc")}
                  </p>

                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                    {!qrCodeError ? (
                      <Image
                        src={setupData.qrCodeData}
                        alt="QR Code for 2FA setup"
                        width={192}
                        height={192}
                        className="w-48 h-48 object-contain"
                        onError={() => {
                          console.error("QR Code load error");
                          setQrCodeError(true);
                        }}
                        unoptimized
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2"
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("profilePage.twoFactorModal.qrLoadFailed")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Input */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t("profilePage.twoFactorModal.enterCode")}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    {t("profilePage.twoFactorModal.enterCodeDesc")}
                  </p>

                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && verificationCode.length === 6 && !isLoading) {
                        handleVerify();
                      }
                    }}
                    placeholder="000000"
                    className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {t("profilePage.securityTab.cancelBtn")}
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t("profilePage.twoFactorModal.verifying") : t("profilePage.twoFactorModal.verifyBtn")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("profilePage.twoFactorModal.emptySetupData")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={doClose}
        title={t("profilePage.twoFactorModal.closeConfirmTitle")}
        message={t("profilePage.twoFactorModal.closeConfirmMsg")}
        confirmText={t("profilePage.twoFactorModal.closeConfirmBtn")}
        cancelText={t("profilePage.twoFactorModal.closeCancelBtn")}
        type="warning"
      />
    </div>
  );
}
