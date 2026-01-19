"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const secretCode = searchParams.get("secret_code");
  
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
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!secretCode) {
      toast.error("Link không hợp lệ");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Calling reset password API...", { secretCode, newPassword: data.newPassword });
      await userApi.resetPassword(secretCode, data.newPassword);
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        router.push("/login?message=password-reset-success");
      }, 1500);
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage = error instanceof Error ? error.message : "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if code exists
  if (!secretCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Link không hợp lệ
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-6">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm text-center"
            >
              Yêu cầu link mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-500 hover:text-accent transition-colors text-xs sm:text-sm"
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
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
              <Link href="/" className="inline-flex items-center">
                <svg width="36" height="36" viewBox="0 0 64 58" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="resetCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0056d2' }} />
                      <stop offset="100%" style={{ stopColor: '#0044aa' }} />
                    </linearGradient>
                  </defs>
                  <g transform="translate(4, 0)">
                    <path d="M16 12C16 12 18 6 16 0" stroke="url(#resetCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M24 14C24 14 26 8 24 2" stroke="url(#resetCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M32 12C32 12 34 6 32 0" stroke="url(#resetCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M8 18H40V42C40 48.627 34.627 54 28 54H20C13.373 54 8 48.627 8 42V18Z" fill="url(#resetCupGrad)" />
                    <path d="M40 24H46C49.314 24 52 26.686 52 30V34C52 37.314 49.314 40 46 40H40" stroke="url(#resetCupGrad)" strokeWidth="4" fill="none" />
                    <text x="14" y="40" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="white">&lt;/&gt;</text>
                  </g>
                </svg>
              </Link>
              <div className="w-10 sm:w-16"></div>
            </div>

            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
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

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Đặt lại mật khẩu
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Reset Password Form */}
          <form
            className="space-y-3 sm:space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                  {...register("newPassword", {
                    required: "Mật khẩu mới là bắt buộc",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600"
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
              <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-1.5">Yêu cầu mật khẩu:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span className={newPassword.length >= 8 ? "text-green-600 font-medium" : "text-gray-900 font-medium"}>
                      Ít nhất 8 ký tự (bắt buộc)
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="text-gray-600">Nên bao gồm chữ hoa và chữ thường</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="text-gray-600">Nên bao gồm số hoặc ký tự đặc biệt</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                  {...register("confirmPassword", {
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: (value) =>
                      value === newPassword || "Mật khẩu xác nhận không khớp",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600"
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
              className="w-full py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
            Nhớ mật khẩu?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-blue-600"
            >
              Đăng nhập ngay
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
