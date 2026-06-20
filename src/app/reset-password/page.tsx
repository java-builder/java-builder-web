"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const secretCode = searchParams.get("secret_code");
  const { t } = useI18n();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  
  const passwordVal = newPassword || "";
  const isLengthValid = passwordVal.length >= 8;
  const isCaseValid = /[a-z]/.test(passwordVal) && /[A-Z]/.test(passwordVal);
  const isSpecialValid = /[0-9]/.test(passwordVal) || /[^a-zA-Z0-9]/.test(passwordVal);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!secretCode) {
      toast.error(t("auth.invalidResetLinkTitle"));
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        message: t("auth.passwordsMustMatch"),
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Calling reset password API...", { secretCode, newPassword: data.newPassword });
      await userApi.resetPassword(secretCode, data.newPassword);
      toast.success(t("auth.resetPasswordSuccess"));
      setTimeout(() => {
        router.push("/login?message=password-reset-success");
      }, 1500);
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage = error instanceof Error ? error.message : t("auth.resetPasswordFailed");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if code exists
  if (!secretCode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 text-center transition-colors duration-300">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.invalidResetLinkTitle")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-6">
              {t("auth.invalidResetLinkSubtitle")}
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm text-center cursor-pointer"
            >
              {t("auth.requestNewLinkBtn")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/login"
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
                <span className="hidden sm:inline">{t("auth.login")}</span>
              </Link>
              <Link href="/" className="inline-flex items-center space-x-2">
                <Image
                  src="/logos/java-logo.png"
                  alt="Learning Platform"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="text-[0.65rem] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                  Learning Platform
                </span>
              </Link>
              <div className="w-10 sm:w-16"></div>
            </div>

            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("auth.resetPasswordTitle")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
              {t("auth.resetPasswordSubtitle")}
            </p>
          </div>

          {/* Reset Password Form */}
          <form
            className="space-y-3 sm:space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("auth.newPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder={t("auth.newPasswordPlaceholder")}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 disabled:opacity-50 text-sm"
                  {...register("newPassword", {
                    required: t("auth.passwordRequired"),
                    minLength: {
                      value: 8,
                      message: t("auth.passwordRegisterMinLength"),
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
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
              <div className="mt-2 bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-700 transition-colors duration-300">
                <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">{t("auth.passwordRequirementsTitle")}</p>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isLengthValid ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={`transition-colors duration-200 ${isLengthValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500 dark:text-slate-400 font-medium"}`}>
                      {t("auth.passwordReqLength")}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isCaseValid ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
                    <span className={`transition-colors duration-200 ${isCaseValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500 dark:text-slate-400"}`}>
                      {t("auth.passwordReqCase")}
                    </span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isSpecialValid ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
                    <span className={`transition-colors duration-200 ${isSpecialValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500 dark:text-slate-400"}`}>
                      {t("auth.passwordReqSpecial")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 disabled:opacity-50 text-sm"
                  {...register("confirmPassword", {
                    required: t("auth.confirmPasswordRequired"),
                    validate: (value) =>
                      value === newPassword || t("auth.passwordsMustMatch"),
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center justify-center"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm cursor-pointer"
            >
              {isLoading ? t("auth.resetting") : t("auth.resetPasswordBtn")}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-4 sm:mt-6">
            {t("auth.rememberPassword")}{" "}
            <Link
              href="/login"
              className="font-semibold text-accent dark:text-accent-on-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t("auth.loginNow")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent dark:border-accent-on-dark border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
