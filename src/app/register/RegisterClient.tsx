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
import { ChevronLeft, AlertCircle, Eye, EyeOff } from "lucide-react";

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
                <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
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

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => (window.location.href = generateGoogleAuthUrl())}
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

            <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-3 sm:mt-4">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login"}
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
