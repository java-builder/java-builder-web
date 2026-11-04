"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/services/user.service";
import { CreateUserRequest } from "@/types/user";
import toast from "react-hot-toast";
import {
  generateGoogleAuthUrl,
  generateLinkedinAuthUrl,
  generateGithubAuthUrl,
} from "@/utils/oauthUtils";
import { useI18n } from "@/contexts/I18nContext";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

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
  const [redirectParam, setRedirectParam] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect") || urlParams.get("callbackUrl");
    if (redirect && redirect.startsWith("/")) {
      setRedirectParam(redirect);
      try {
        sessionStorage.setItem("auth_redirect", redirect);
      } catch {}
    }
  }, []);

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
        const targetLogin = redirectParam
          ? `/login?message=registration-success&redirect=${encodeURIComponent(redirectParam)}`
          : "/login?message=registration-success";
        router.push(targetLogin);
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
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background flex items-center justify-center px-4 py-8 sm:py-12 transition-colors duration-300">
      <div className="w-full max-w-[500px]">
        {/* Register Card */}
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
              {t("auth.createAccount")}
            </h2>
            <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm">
              {t("auth.registerSubtitle")}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-center text-sm font-medium text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Social Sign up */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => (window.location.href = generateGoogleAuthUrl())}
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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E8E8] dark:border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-surface text-[#64748B] font-medium">{t("auth.orRegisterWithEmail")}</span>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-3.5 sm:space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                id="username"
                type="text"
                autoComplete="username"
                disabled={isLoading}
                placeholder={t("auth.usernamePlaceholder")}
                className="flex h-11 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-background px-4 py-2 text-sm text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                {...register("username", {
                  required: t("auth.usernameRequired"),
                  minLength: {
                    value: 3,
                    message: t("auth.usernameMinLength"),
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
                autoComplete="new-password"
                disabled={isLoading}
                placeholder={t("userMenu.password")}
                className="flex h-11 w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-background px-4 py-2 pr-10 text-sm text-[#171717] dark:text-slate-100 placeholder:text-[#64748B] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#FF5A1F] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
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
              className="inline-flex items-center justify-center gap-2 w-full h-11 bg-[#FF5A1F] hover:bg-[#e04b16] text-white font-bold rounded-full shadow-md shadow-[#FF5A1F]/25 hover:shadow-lg hover:shadow-[#FF5A1F]/30 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm cursor-pointer"
            >
              {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>

            {/* Terms and Privacy Policy Notice */}
            <p className="text-center text-xs text-[#64748B] dark:text-slate-400">
              {t("auth.registerAgreeText")}{" "}
              <Link
                href="/terms"
                className="text-[#FF5A1F] font-semibold hover:underline"
                target="_blank"
              >
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link
                href="/privacy-policy"
                className="text-[#FF5A1F] font-semibold hover:underline"
                target="_blank"
              >
                {t("auth.privacyPolicy")}
              </Link>
            </p>

            <p className="text-center text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-4 sm:mt-6">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-bold text-[#FF5A1F] hover:text-[#e04b16] transition-colors"
              >
                {t("auth.loginBtn")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
