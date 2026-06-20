"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordClient() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await userApi.sendResetPasswordLink(data.email);
      setEmailSent(true);
      toast.success(t("auth.emailSentSuccess"));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t("auth.emailNotFound");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="w-10 sm:w-16"></div>
            </div>

            {!emailSent ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("auth.forgotPasswordTitle")}
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                  {t("auth.forgotPasswordSubtitle")}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("auth.checkEmailTitle")}
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                  {t("auth.checkEmailSubtitle")}
                </p>
              </>
            )}
          </div>

          {/* Email Form */}
          {!emailSent ? (
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 disabled:opacity-50 text-sm"
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

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm cursor-pointer"
              >
                {isLoading ? t("auth.sending") : t("auth.sendResetLinkBtn")}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-400 text-center">
                  {t("auth.linkExpiryNotice5Min")}
                </p>
              </div>

              <button
                onClick={() => {
                  setEmailSent(false);
                  reset();
                }}
                className="w-full py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 text-gray-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 text-sm cursor-pointer"
              >
                {t("auth.resendEmailBtn")}
              </button>
            </div>
          )}

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
