"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { authApi } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";
import {
  generateGoogleAuthUrl,
  generateGithubAuthUrl,
} from "@/utils/oauthUtils";
import TwoFactorModal from "@/components/auth/TwoFactorModal";

interface LoginFormData extends LoginRequest {
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userAuthorities, setUserAuthorities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message === "registration-success") {
      setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const result = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (result.code === 200) {
        if (result.result?.mftEnable) {
          setUserEmail(data.email);
          setUserAuthorities(result.result.authorities || []);
          setShowTwoFactorModal(true);
        } else if (result.result?.accessToken) {
          const isAdmin = result.result.authorities?.includes("ADMIN");
          router.push(isAdmin ? "/admin" : "/");
        }
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSuccess = () => {
    const isAdmin = userAuthorities.includes("ADMIN");
    router.push(isAdmin ? "/admin" : "/");
  };

  const handleGoogleLogin = () => {
    window.location.href = generateGoogleAuthUrl();
  };

  const handleGithubLogin = () => {
    window.location.href = generateGithubAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <Link
                href="/"
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
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
              <Link href="/" className="inline-flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z" />
                    </svg>
                  </div>
                </div>
              </Link>
              <div className="w-10 sm:w-16"></div> {/* Spacer for balance */}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại!
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Đăng nhập để tiếp tục học tập
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
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

            <div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="Mật khẩu"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                  {...register("rememberMe")}
                />
                <span className="ml-2 text-gray-600">Ghi nhớ</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-accent hover:text-blue-600 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full py-2.5 sm:py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Social Login */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Image src="/google.svg" alt="Google" width={16} height={16} />
                <span className="ml-2 text-sm text-gray-700">Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGithubLogin}
                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                <span className="ml-2 text-sm text-gray-700">GitHub</span>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-semibold text-accent hover:text-blue-600"
              >
                Đăng ký ngay
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
        onSuccess={handleTwoFactorSuccess}
      />
    </div>
  );
}
