"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { twoFactorApi } from "@/services/two-factor.service";
import { TwoFactorSetupResponse } from "@/types/two-factor";
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
  const [showManualKey, setShowManualKey] = useState(false);

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
    doClose();
  };

  const doClose = () => {
    setSetupData(null);
    setVerificationCode("");
    setError("");
    setQrCodeError(false);
    setShowManualKey(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-slate-800 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-850">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t("profilePage.twoFactorModal.modalTitle")}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-5">
            {isLoading && !setupData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {t("profilePage.twoFactorModal.settingUp")}
                </p>
              </div>
            ) : setupData ? (
              <div className="space-y-5">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                    {t("profilePage.twoFactorModal.scanQr")}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-455 mb-4 max-w-sm mx-auto">
                    {t("profilePage.twoFactorModal.scanQrDesc")}
                  </p>

                  {/* QR Code Container */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800/80 p-4 rounded-xl inline-block shadow-inner">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      {!qrCodeError ? (
                        <Image
                          src={setupData.qrCodeData}
                          alt="QR Code for 2FA setup"
                          width={160}
                          height={160}
                          className="w-40 h-40 object-contain"
                          onError={() => {
                            console.error("QR Code load error");
                            setQrCodeError(true);
                          }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded">
                          <div className="text-center">
                            <svg
                              className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2"
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

                  {/* Manual Setup Key Toggle/Display */}
                  {setupData.secret && (
                    <div className="mt-4">
                      {!showManualKey ? (
                        <button
                          type="button"
                          onClick={() => setShowManualKey(true)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-all cursor-pointer"
                        >
                          {t("profilePage.twoFactorModal.cantScanQr")}
                        </button>
                      ) : (
                        <div className="max-w-[280px] mx-auto text-left space-y-1 animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
                          <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-center">
                            {t("profilePage.twoFactorModal.manualKey")}
                          </p>
                          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950/40 border border-gray-150 dark:border-slate-800 p-2 rounded-lg">
                            <code className="flex-1 font-mono text-[11px] text-gray-700 dark:text-slate-200 select-all break-all font-semibold tracking-wider text-center">
                              {setupData.secret}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(setupData.secret!);
                                toast.success(t("profilePage.twoFactorModal.copied"));
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Copy Key"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Verification Input */}
                <div className="space-y-2.5">
                  <div className="text-center sm:text-left">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t("profilePage.twoFactorModal.enterCode")}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {t("profilePage.twoFactorModal.enterCodeDesc")}
                    </p>
                  </div>

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
                    className="w-full px-4 py-3 text-center text-xl font-mono tracking-[0.2em] border border-gray-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-slate-950/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-slate-850">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-350 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-755 border border-gray-200 dark:border-slate-750 rounded-lg transition-colors cursor-pointer"
                  >
                    {t("profilePage.securityTab.cancelBtn")}
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    {isLoading ? t("profilePage.twoFactorModal.verifying") : t("profilePage.twoFactorModal.verifyBtn")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("profilePage.twoFactorModal.emptySetupData")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
