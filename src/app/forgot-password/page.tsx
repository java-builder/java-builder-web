"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { userApi } from "@/services/user.service";
import toast from "react-hot-toast";

type ForgotPasswordFormData = {
  email: string;
};

function ForgotPasswordContent() {
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
      toast.success("Đã gửi link đặt lại mật khẩu đến email của bạn!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Không tìm thấy email này trong hệ thống";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
                    <linearGradient id="forgotCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#0056d2' }} />
                      <stop offset="100%" style={{ stopColor: '#0044aa' }} />
                    </linearGradient>
                  </defs>
                  <g transform="translate(4, 0)">
                    <path d="M16 12C16 12 18 6 16 0" stroke="url(#forgotCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M24 14C24 14 26 8 24 2" stroke="url(#forgotCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M32 12C32 12 34 6 32 0" stroke="url(#forgotCupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
                    <path d="M8 18H40V42C40 48.627 34.627 54 28 54H20C13.373 54 8 48.627 8 42V18Z" fill="url(#forgotCupGrad)" />
                    <path d="M40 24H46C49.314 24 52 26.686 52 30V34C52 37.314 49.314 40 46 40H40" stroke="url(#forgotCupGrad)" strokeWidth="4" fill="none" />
                    <text x="14" y="40" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="white">&lt;/&gt;</text>
                  </g>
                </svg>
              </Link>
              <div className="w-10 sm:w-16"></div>
            </div>

            {!emailSent ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Quên mật khẩu?
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Nhập email của bạn để nhận link đặt lại mật khẩu
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Kiểm tra email của bạn
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.
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
                  placeholder="Email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
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
                className="w-full py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 text-center">
                  Link có hiệu lực trong <strong>5 phút</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setEmailSent(false);
                  reset();
                }}
                className="w-full py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 text-sm"
              >
                Gửi lại email
              </button>
            </div>
          )}

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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
