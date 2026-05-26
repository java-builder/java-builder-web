"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { UserDetailResponse } from "@/types/user";
import { twoFactorApi } from "@/services/two-factor.service";
import TwoFactorModal from "./TwoFactorModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

interface SecurityTabProps {
  user: UserDetailResponse;
  onUserUpdate?: (user: Partial<UserDetailResponse>) => void;
}

export default function SecurityTab({ user, onUserUpdate }: SecurityTabProps) {
  const { t } = useI18n();
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
      toast.success(t("profilePage.securityTab.disableSuccess"));
      
      if (onUserUpdate) {
        onUserUpdate({ mftEnable: false });
      }
    } catch (error: unknown) {
      let errorMessage = t("profilePage.securityTab.disableFailed");
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
    toast.success(t("profilePage.securityTab.enableSuccess"));
    
    if (onUserUpdate) {
      onUserUpdate({ mftEnable: true });
    }
  };

  const formattedSecurityNote = () => {
    const noteText = t("profilePage.securityTab.securityActivatedNote");
    const colonIndex = noteText.indexOf(":");
    if (colonIndex !== -1) {
      return (
        <>
          <strong>{noteText.slice(0, colonIndex + 1)}</strong>
          {noteText.slice(colonIndex + 1)}
        </>
      );
    }
    return noteText;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("profilePage.securityTab.security")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("profilePage.securityTab.securityDesc")}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Two-Factor Authentication Card */}
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-200 dark:border-green-800/50">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {t("profilePage.securityTab.twoFactor")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isInitialLoading 
                    ? t("profilePage.securityTab.checkingStatus") 
                    : twoFactorEnabled 
                      ? t("profilePage.securityTab.twoFactorProtected") 
                      : t("profilePage.securityTab.twoFactorAddLyr")
                  }
                </p>
                {!isInitialLoading && twoFactorEnabled && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t("profilePage.securityTab.activated")}
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
                    {twoFactorEnabled ? t("profilePage.securityTab.enabled") : t("profilePage.securityTab.disabled")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Two-Factor Authentication Details - Only show when enabled */}
        {!isInitialLoading && twoFactorEnabled && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">{t("profilePage.securityTab.securityActivated")}</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  {t("profilePage.securityTab.securityActivatedDesc")}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {formattedSecurityNote()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Tips - Only show when 2FA is not enabled */}
        {!isInitialLoading && !twoFactorEnabled && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">{t("profilePage.securityTab.twoFactorGuide")}</h4>
                <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-200">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">1.</span>
                    <span>{t("profilePage.securityTab.guideStep1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">2.</span>
                    <span>{t("profilePage.securityTab.guideStep2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">3.</span>
                    <span>{t("profilePage.securityTab.guideStep3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">4.</span>
                    <span>{t("profilePage.securityTab.guideStep4")}</span>
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
                <h4 className="text-sm font-semibold text-red-900 mb-1">{t("profilePage.securityTab.error")}</h4>
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
        title={t("profilePage.securityTab.disableConfirmTitle")}
        message={t("profilePage.securityTab.disableConfirmMsg")}
        confirmText={t("profilePage.securityTab.disableBtn")}
        cancelText={t("profilePage.securityTab.cancelBtn")}
        type="danger"
      />
    </div>
  );
}