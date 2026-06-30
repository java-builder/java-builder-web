"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/services/user.service";
import { CreateUserRequest } from "@/types/user";
import toast from "react-hot-toast";
import {
  generateGoogleAuthUrl,
  generateLinkedinAuthUrl,
} from "@/utils/oauthUtils";
import { useI18n } from "@/contexts/I18nContext";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

type RegisterFormData = CreateUserRequest;

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export default function RegisterClient() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await userApi.create({
        username: data.username,
        email: data.email,
        password: data.password,
        turnstileToken,
      });

      if (result.code === 201) {
        toast.success(t("auth.registrationSuccess"));
        router.push("/login?message=registration-success");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("auth.registerFailed");
      toast.error(errorMessage);
      setError(errorMessage);
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-3 sm:px-4 py-4 transition-colors duration-300">
      <div className="w-full max-w-[480px]">
        {/* Register Card */}
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-5 sm:p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
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
              {t("auth.createAccount")}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
              {t("auth.registerSubtitle")}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                id="username"
                type="text"
                disabled={isLoading}
                placeholder={t("auth.username")}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("username", {
                  required: t("auth.usernameRequired"),
                  minLength: {
                    value: 3,
                    message: t("auth.usernameMinLength"),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: t("auth.usernamePattern"),
                  },
                })}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

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
                autoComplete="new-password"
                disabled={isLoading}
                placeholder={t("userMenu.password")}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-on-dark text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("password", {
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}



            <div className="flex justify-center my-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading || !turnstileToken}
              className="inline-flex items-center justify-center gap-2 w-full h-11 bg-accent text-white font-semibold rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow text-sm cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>

            {/* Terms and Privacy Policy Notice */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {t("auth.registerAgreeText")}{" "}
              <Link
                href="/terms"
                className="text-accent dark:text-accent-on-dark hover:underline"
                target="_blank"
              >
                {t("auth.termsOfUse")}
              </Link>
              {" "}{t("auth.and")}{" "}
              <Link
                href="/privacy-policy"
                className="text-accent dark:text-accent-on-dark hover:underline"
                target="_blank"
              >
                {t("auth.privacyPolicy")}
              </Link>
            </p>

            {/* Social Login */}
            <div className="relative my-3">
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
                onClick={() => (window.location.href = generateGoogleAuthUrl())}
                className="flex h-10 items-center justify-center border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                <Image src="/google.svg" alt="Google" width={16} height={16} />
                <span className="ml-2 text-sm">Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateLinkedinAuthUrl())}
                className="flex h-10 items-center justify-center border border-input bg-background hover:bg-muted text-foreground rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
                <span className="ml-2 text-sm">LinkedIn</span>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-3 sm:mt-4">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-semibold text-accent dark:text-accent-on-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t("auth.loginNow")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
