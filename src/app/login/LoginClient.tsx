"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { authApi } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import {
  generateGoogleAuthUrl,
  generateLinkedinAuthUrl,
  generateGithubAuthUrl,
} from "@/utils/oauthUtils";
import TwoFactorModal from "@/components/auth/TwoFactorModal";
import { useAuth } from "@/contexts/AuthContext";
import { passkeyApi } from "@/services/passkey.service";
import { authenticatePasskey } from "@/services/webauthn";
import { Key, ChevronLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

type LoginFormData = LoginRequest;

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function LoginClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthFromLogin } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigateAfterLogin = (authorities?: string[]) => {
    const isAdmin = authorities?.includes("ADMIN");
    if (isAdmin) {
      router.push("/admin");
      return;
    }

    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    let target = urlParams?.get("redirect") || urlParams?.get("callbackUrl");
    if (!target && typeof window !== "undefined") {
      try {
        target = sessionStorage.getItem("auth_redirect");
      } catch {}
    }

    if (target && target.startsWith("/")) {
      try {
        sessionStorage.removeItem("auth_redirect");
      } catch {}
      router.push(target);
      return;
    }

    router.push("/");
  };

  const handlePasskeyLogin = async () => {
    setError("");
    setIsPasskeyLoading(true);

    try {
      const email = getValues("email");
      const optionsResponse = await passkeyApi.getLoginOptions(email || null);
      if (optionsResponse.code !== 200 || !optionsResponse.data) {
        throw new Error(optionsResponse.message || t("auth.passkeyFetchFailed"));
      }

      const credential = await authenticatePasskey(optionsResponse.data);

      const loginResult = await passkeyApi.loginPasskey(credential);
      if (loginResult.code === 200 && loginResult.data?.accessToken) {
        setAuthFromLogin(loginResult.data);
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        navigateAfterLogin(loginResult.data?.authorities);
      } else {
        throw new Error(loginResult.message || t("auth.passkeyLoginFailed"));
      }
    } catch (err) {
      const errorObj = err as Error;
      console.error("Passkey login failed:", errorObj);
      if (errorObj.name !== "NotAllowedError" && errorObj.name !== "AbortError") {
        setError(errorObj.message || t("auth.passkeyLoginFailedTryAgain"));
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect") || urlParams.get("callbackUrl");
    if (redirectParam && redirectParam.startsWith("/")) {
      try {
        sessionStorage.setItem("auth_redirect", redirectParam);
      } catch {}
    }

    const message = urlParams.get("message");
    if (message === "registration-success") {
      setSuccessMessage(t("auth.registrationSuccess"));
    } else if (message === "password-reset-success") {
      setSuccessMessage(t("auth.resetPasswordSuccess"));
    }
  }, [t]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await authApi.login({
        email: data.email,
        password: data.password,
        turnstileToken,
      });

      if (result.code === 200) {
        if (result.data?.mftEnable && result.data?.userId) {
          setUserEmail(data.email);
          setUserId(result.data.userId);
          setShowTwoFactorModal(true);
        } else if (result.data?.accessToken) {
          setAuthFromLogin(result.data);
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          navigateAfterLogin(result.data?.authorities);
        }
      } else {
        setError(result.message || t("auth.loginFailed"));
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t("auth.loginFailed"));
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = async (data?: { authorities?: string[]; accessToken?: string; userId?: string }) => {
    setShowTwoFactorModal(false);
    if (data) {
      setAuthFromLogin(data);
    }
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    navigateAfterLogin(data?.authorities);
  };

  const handleGoogleLogin = () => {
    window.location.href = generateGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background flex items-center justify-center px-4 py-8 sm:py-12 transition-colors duration-300">
      <div className="w-full max-w-[500px]">
        {/* Login Card */}
        <div className="bg-white dark:bg-surface rounded-2xl border border-[#E8E8E8] dark:border-border shadow-sm p-6 sm:p-8 md:p-9 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/"
                className="flex items-center gap-1 text-[#64748B] hover:text-[#FF5A1F] transition-colors text-xs sm:text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t("auth.home")}</span>
              </Link>
              <Link href="/" className="inline-flex flex-col items-center">
                <Image
                  src="/logos/java-logo.png"
                  alt="JavaBuilder"
                  width={38}
                  height={38}
                  className="object-contain mb-1.5"
                />
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[0.7rem] font-black text-[#171717] dark:text-white tracking-wider uppercase">
                    JavaBuilder
                  </span>
                  <span className="text-[0.62rem] font-bold text-[#FF5A1F] tracking-wider uppercase">
                    Learning Platform
                  </span>
                </div>
              </Link>
              <div className="w-10 sm:w-16" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white mb-2">
              {t("auth.welcomeBack")}
            </h2>
            <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-center text-sm font-medium text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Form */}
          <form
            className="space-y-3.5 sm:space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                placeholder={t("profilePage.profileTab.email")}
                className="flex h-11 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-background px-4 py-2 text-sm text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                {...register("email", {
                  required: t("auth.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("auth.emailInvalid"),
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading}
                placeholder={t("userMenu.password")}
                className="flex h-11 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-background px-4 py-2 pr-10 text-sm text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                {...register("password", {
                  required: t("auth.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("auth.passwordMinLength"),
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#171717] dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}

            <div className="flex items-center justify-start text-sm">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#FF5A1F] hover:text-[#e04b16] transition-colors"
              >
                {t("auth.forgotPasswordLink")}
              </Link>
            </div>

            <div className="flex justify-center my-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => {
                  setTurnstileToken("");
                  turnstileRef.current?.reset();
                }}
                onError={() => {
                  setTurnstileToken("");
                  setTimeout(() => {
                    turnstileRef.current?.reset();
                  }, 500);
                }}
                options={{
                  refreshExpired: "auto",
                  retry: "auto",
                  retryInterval: 1000,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading || isPasskeyLoading || !turnstileToken}
              className="inline-flex items-center justify-center gap-2 w-full h-11 bg-[#FF5A1F] hover:bg-[#e04b16] text-white font-bold rounded-full shadow-md shadow-[#FF5A1F]/25 hover:shadow-lg hover:shadow-[#FF5A1F]/30 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm cursor-pointer"
            >
              {isLoading ? t("auth.loggingIn") : t("auth.loginBtn")}
            </button>

            <button
              type="button"
              disabled={isLoading || isPasskeyLoading}
              onClick={handlePasskeyLogin}
              className="inline-flex items-center justify-center gap-2 w-full h-11 border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:bg-[#FFF0E8] hover:text-[#FF5A1F] text-[#171717] dark:text-slate-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 disabled:opacity-50 transition-all duration-200 text-sm shadow-2xs cursor-pointer active:scale-95"
            >
              {isPasskeyLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5A1F] border-t-transparent" />
                  {t("auth.authenticating")}
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-[#FF5A1F]" />
                  {t("auth.loginWithPasskey")}
                </>
              )}
            </button>

            {/* Social Login */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E8E8] dark:border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-surface text-[#64748B] font-medium">{t("auth.or")}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="flex h-10 items-center justify-center gap-2 border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:bg-[#FFF0E8] hover:text-[#FF5A1F] text-[#171717] dark:text-slate-100 rounded-full transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-95 font-semibold text-xs shadow-2xs"
              >
                <Image src="/social/google.webp" alt="Google" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                <span>Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateGithubAuthUrl())}
                className="flex h-10 items-center justify-center gap-2 border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:bg-[#FFF0E8] hover:text-[#FF5A1F] text-[#171717] dark:text-slate-100 rounded-full transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-95 font-semibold text-xs shadow-2xs"
              >
                <Image src="/social/github.png" alt="GitHub" width={18} height={18} className="w-4.5 h-4.5 object-contain dark:invert" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateLinkedinAuthUrl())}
                className="flex h-10 items-center justify-center gap-2 border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface hover:bg-[#FFF0E8] hover:text-[#FF5A1F] text-[#171717] dark:text-slate-100 rounded-full transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-95 font-semibold text-xs shadow-2xs"
              >
                <Image src="/social/linkedin.webp" alt="LinkedIn" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                <span>LinkedIn</span>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-4 sm:mt-6">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href="/register"
                className="font-bold text-[#FF5A1F] hover:text-[#e04b16] transition-colors"
              >
                {t("auth.registerNow")}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        email={userEmail}
        userId={userId}
        identityProvider="USERNAME_PASSWORD"
        onSuccess={handleTwoFactorSuccess}
      />
    </div>
  );
}
