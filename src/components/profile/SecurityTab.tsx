"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  XCircle,
  Key,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserDetailResponse } from "@/types/user";
import { twoFactorApi } from "@/services/two-factor.service";
import { useI18n } from "@/contexts/I18nContext";
import TwoFactorModal from "./TwoFactorModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import SectionCard from "./SectionCard";
import { passkeyApi } from "@/services/passkey.service";
import { registerPasskeyCredential } from "@/services/webauthn";

interface SecurityTabProps {
  user: UserDetailResponse;
  onUserUpdate?: (user: Partial<UserDetailResponse>) => void;
}

export default function SecurityTab({
  user,
  onUserUpdate,
}: SecurityTabProps) {
  const { t } = useI18n();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.mftEnable);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const initialUserMftEnable = useRef(user.mftEnable);

  const handleRegisterPasskey = async () => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error(t("profilePage.securityTab.passkeyNotSupported"));
      return;
    }

    try {
      setIsPasskeyLoading(true);
      const optionsResponse = await passkeyApi.getRegistrationOptions();
      if (optionsResponse.code !== 200 || !optionsResponse.data) {
        throw new Error(optionsResponse.message || t("profilePage.securityTab.registerPasskeyFailed"));
      }

      const credential = await registerPasskeyCredential(optionsResponse.data);

      const registerResponse = await passkeyApi.registerPasskey(credential);
      if (registerResponse.code !== 200) {
        throw new Error(registerResponse.message || t("profilePage.securityTab.registerPasskeyFailed"));
      }

      toast.success(t("profilePage.securityTab.registerPasskeySuccess"));
    } catch (err) {
      const errorObj = err as Error;
      console.error("Passkey registration failed:", errorObj);
      if (errorObj.name !== "NotAllowedError" && errorObj.name !== "AbortError") {
        toast.error(errorObj.message || t("profilePage.securityTab.registerPasskeyFailed"));
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleUserUpdate = useCallback(
    (updates: Partial<UserDetailResponse>) => {
      onUserUpdate?.(updates);
    },
    [onUserUpdate]
  );

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
      } catch (err) {
        console.error("Failed to check MFA status:", err);
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
      onUserUpdate?.({ mftEnable: false });
    } catch (err: unknown) {
      let errorMessage = t("profilePage.securityTab.disableFailed");
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
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
    onUserUpdate?.({ mftEnable: true });
  };

  return (
    <>
      <SectionCard
        icon={ShieldCheck}
        title={t("profilePage.securityTab.security")}
        subtitle={t("profilePage.securityTab.securityDesc")}
      >
        <div className="space-y-5">
          {/* Security Settings Box */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900/40 divide-y divide-gray-200 dark:divide-slate-800 overflow-hidden">
            {/* 2FA Toggle Row */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t("profilePage.securityTab.twoFactor")}
                    </h4>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                      {isInitialLoading
                        ? t("profilePage.securityTab.checkingStatus")
                        : twoFactorEnabled
                          ? t("profilePage.securityTab.twoFactorProtected")
                          : t("profilePage.securityTab.twoFactorAddLyr")}
                    </p>
                    {!isInitialLoading && twoFactorEnabled && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("profilePage.securityTab.activated")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-3">
                  {isInitialLoading ? (
                    <div className="h-6 w-11 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700" />
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleTwoFactor}
                        disabled={isLoading}
                        role="switch"
                        aria-checked={twoFactorEnabled}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 ${twoFactorEnabled
                            ? "bg-accent"
                            : "bg-gray-300 dark:bg-slate-600"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                      <span
                        className={`text-xs font-semibold ${twoFactorEnabled
                            ? "text-accent"
                            : "text-gray-500 dark:text-gray-400"
                          }`}
                      >
                        {twoFactorEnabled
                          ? t("profilePage.securityTab.enabled")
                          : t("profilePage.securityTab.disabled")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Passkeys Row */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Key className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t("profilePage.securityTab.passkeys")}
                    </h4>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                      {t("profilePage.securityTab.passkeysDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center">
                  <button
                    type="button"
                    onClick={handleRegisterPasskey}
                    disabled={isPasskeyLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPasskeyLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>{t("profilePage.profileTab.savingBtn")}</span>
                      </>
                    ) : (
                      <>
                        <Key className="h-3.5 w-3.5" />
                        <span>{t("profilePage.securityTab.addPasskeyBtn")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status alerts */}
          {!isInitialLoading && twoFactorEnabled && (
            <SecurityAlert
              tone="success"
              icon={CheckCircle2}
              title={t("profilePage.securityTab.securityActivated")}
              description={t("profilePage.securityTab.securityActivatedDesc")}
              footer={
                <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                  {t("profilePage.securityTab.securityActivatedNote")}
                </p>
              }
            />
          )}

          {!isInitialLoading && !twoFactorEnabled && (
            <div className="rounded-xl border border-border bg-muted/20 p-5 mt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                    <Info className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <h5 className="text-sm font-semibold text-foreground">
                      {t("profilePage.securityTab.twoFactorGuide")}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      {t("profilePage.securityTab.downloadAuthenticatorDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-2 bg-background hover:bg-muted text-foreground rounded-lg border border-border text-sm font-semibold shadow-xs transition-colors duration-150 group"
                  >
                    <Image
                      src="/logos/google-play-store-logo.png"
                      alt="Google Play"
                      width={32}
                      height={32}
                      className="shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
                      unoptimized
                    />
                    <span>Google Play</span>
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-2 bg-background hover:bg-muted text-foreground rounded-lg border border-border text-sm font-semibold shadow-xs transition-colors duration-150 group"
                  >
                    <svg width="24" height="24" viewBox="0 0 384 512" fill="currentColor" aria-hidden className="transition-transform duration-200 group-hover:scale-105 text-foreground/90 shrink-0">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    <span>App Store</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <SecurityAlert
              tone="error"
              icon={XCircle}
              title={t("profilePage.securityTab.error")}
              description={error}
            />
          )}
        </div>
      </SectionCard>

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
    </>
  );
}

interface SecurityAlertProps {
  tone: "success" | "warning" | "error" | "info";
  icon: typeof AlertTriangle;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

function SecurityAlert({
  tone,
  icon: Icon,
  title,
  description,
  footer,
  children,
}: SecurityAlertProps) {
  const palette = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      ring: "border-emerald-200 dark:border-emerald-800/40",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      title: "text-emerald-900 dark:text-emerald-200",
      desc: "text-emerald-800 dark:text-emerald-200",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      ring: "border-amber-200 dark:border-amber-800/40",
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      title: "text-amber-900 dark:text-amber-200",
      desc: "text-amber-800 dark:text-amber-200",
    },
    error: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      ring: "border-rose-200 dark:border-rose-900/40",
      iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
      title: "text-rose-900 dark:text-rose-200",
      desc: "text-rose-800 dark:text-rose-300",
    },
    info: {
      bg: "bg-gray-50 dark:bg-slate-900/40",
      ring: "border-gray-200 dark:border-slate-700",
      iconBg: "bg-accent/10 text-accent",
      title: "text-gray-900 dark:text-white",
      desc: "text-gray-600 dark:text-gray-300",
    },
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${palette.bg} ${palette.ring}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${palette.iconBg}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h5 className={`text-sm font-semibold ${palette.title}`}>{title}</h5>
          {description && (
            <p className={`mt-1 text-xs sm:text-sm ${palette.desc}`}>
              {description}
            </p>
          )}
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}
