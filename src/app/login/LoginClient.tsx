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

    // Auto reset Turnstile widget on soft navigation (e.g. after logout redirect)
    const timer = setTimeout(() => {
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [t]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");

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
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t("auth.loginFailed"));
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = async (data?: { authorities?: string[]; accessToken?: string; userId?: string }) => {
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    navigateAfterLogin(data?.authorities);
  };

  const handleGoogleLogin = () => {
    window.location.href = generateGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors duration-300">
      <div className="w-full max-w-[480px]">
        {/* Login Card */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 sm:p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-on-dark transition-colors text-xs sm:text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t("auth.home")}</span>
              </Link>
              <Link href="/" className="inline-flex flex-col items-center">
                <Image
                  src="/logos/java-logo.png"
                  alt="JavaBuilder"
                  width={36}
                  height={36}
                  className="object-contain mb-1.5"
                />
                <div className="flex flex-col items-center -space-y-0.5">
                  <span className="text-[0.6rem] font-bold text-gray-900 dark:text-white tracking-wider uppercase">
                    JavaBuilder
                  </span>
                  <span className="text-[0.6rem] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                    Learning Platform
                  </span>
                </div>
              </Link>
              <div className="w-10 sm:w-16"></div> {/* Spacer for balance */}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.welcomeBack")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Form */}
          <form
            className="space-y-3 sm:space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                placeholder={t("profilePage.profileTab.email")}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
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
                className="text-accent dark:text-accent-on-dark hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
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
              className="inline-flex items-center justify-center gap-2 w-full h-11 bg-accent text-white font-semibold rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow text-sm cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? t("auth.loggingIn") : t("auth.loginBtn")}
            </button>

            <button
              type="button"
              disabled={isLoading || isPasskeyLoading}
              onClick={handlePasskeyLogin}
              className="inline-flex items-center justify-center gap-2 w-full h-11 border border-input bg-background hover:bg-muted text-foreground font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all duration-200 text-sm shadow-xs cursor-pointer active:scale-[0.99]"
            >
              {isPasskeyLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  {t("auth.authenticating")}
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {t("auth.loginWithPasskey")}
                </>
              )}
            </button>

            {/* Social Login */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">{t("auth.or")}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="flex h-10 items-center justify-center gap-2 border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99] font-medium text-xs sm:text-sm shadow-xs"
              >
                <Image src="/social/google.webp" alt="Google" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                <span>Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateGithubAuthUrl())}
                className="flex h-10 items-center justify-center gap-2 border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99] font-medium text-xs sm:text-sm shadow-xs"
              >
                <Image src="/social/github.png" alt="GitHub" width={18} height={18} className="w-4.5 h-4.5 object-contain dark:invert" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateLinkedinAuthUrl())}
                className="flex h-10 items-center justify-center gap-2 border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99] font-medium text-xs sm:text-sm shadow-xs"
              >
                <Image src="/social/linkedin.webp" alt="LinkedIn" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                <span>LinkedIn</span>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-4 sm:mt-6">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href="/register"
                className="font-semibold text-accent dark:text-accent-on-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
