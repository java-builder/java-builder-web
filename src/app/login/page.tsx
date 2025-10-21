'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { authApi } from "@/services/auth.service";
import { LoginRequest } from "@/types/auth";

interface LoginFormData extends LoginRequest {
    rememberMe: boolean;
}

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<LoginFormData>({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    // Check for success message from registration
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        if (message === 'registration-success') {
            setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        }
    }, []);

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError("");

            const result = await authApi.login({
                email: data.email,
                password: data.password
            });

            if (result.code === 200) {
                router.push("/");
            }
        } catch (err: unknown) {
            console.error("Login error:", err);
            // Error handling đã được xử lý trong auth service với toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <Link
                                href="/"
                                className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Trang chủ</span>
                            </Link>

                            <Link href="/" className="inline-flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">FL</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">F Learning</span>
                            </Link>

                            <div className="w-16"></div> {/* Spacer for balance */}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Chào mừng trở lại!
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Đăng nhập để tiếp tục học tập
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-green-600">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                disabled={isLoading}
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                {...register("email", {
                                    required: "Email là bắt buộc",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                placeholder="Mật khẩu"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                {...register("password", {
                                    required: "Mật khẩu là bắt buộc",
                                    minLength: {
                                        value: 6,
                                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    disabled={isLoading}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                    {...register("rememberMe")}
                                />
                                <span className="ml-2 text-gray-600">Ghi nhớ</span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-orange-500 hover:text-orange-400 font-medium"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
                                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Image src="/google.svg" alt="Google" width={16} height={16} />
                                <span className="ml-2 text-sm text-gray-700">Google</span>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                                <span className="ml-2 text-sm text-gray-700">GitHub</span>
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Chưa có tài khoản?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-orange-500 hover:text-orange-400"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}