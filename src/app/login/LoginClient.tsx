"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { authApi } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import {
  generateGoogleAuthUrl,
  generateLinkedinAuthUrl,
} from "@/utils/oauthUtils";
import TwoFactorModal from "@/components/auth/TwoFactorModal";
import { useAuth } from "@/contexts/AuthContext";
import { passkeyApi } from "@/services/passkey.service";
import { authenticatePasskey } from "@/services/webauthn";
import { Key } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

type LoginFormData = LoginRequest;

export default function LoginClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthFromLogin, hasAdminAccess } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

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
        const isAdmin = loginResult.data?.authorities?.includes("ADMIN");
        router.push(isAdmin ? "/admin" : "/");
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

      const result = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (result.code === 200) {
        if (result.data?.mftEnable && result.data?.userId) {
          setUserEmail(data.email);
          setUserId(result.data.userId);
          setShowTwoFactorModal(true);
        } else if (result.data?.accessToken) {
          setAuthFromLogin(result.data);
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          const isAdmin = result.data?.authorities?.includes("ADMIN");
          router.push(isAdmin ? "/admin" : "/");
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t("auth.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    const isAdmin = hasAdminAccess;
    router.push(isAdmin ? "/admin" : "/");
  };

  const handleGoogleLogin = () => {
    window.location.href = generateGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 sm:p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-on-dark transition-colors text-xs sm:text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
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
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
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

            <button
              type="submit"
              disabled={!isValid || isLoading || isPasskeyLoading}
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

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="flex h-10 items-center justify-center border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                <Image src="/google.svg" alt="Google" width={16} height={16} className="social-icon" />
                <span className="ml-2 text-sm">Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateLinkedinAuthUrl())}
                className="flex h-10 items-center justify-center border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} className="social-icon" />
                <span className="ml-2 text-sm">LinkedIn</span>
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
