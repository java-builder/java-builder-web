'use client'
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<RegisterFormData>({
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false
        }
    });

    const password = watch("password");

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError("");

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Register data:", data);
            // Handle registration logic here

        } catch (err: unknown) {
            console.error("Register error:", err);
            const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại sau.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center px-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-100 rounded-full blur-xl opacity-40"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-100 rounded-full blur-lg opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Compact Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <Link
                                href="/"
                                className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Trang chủ</span>
                            </Link>

                            <Link href="/" className="inline-flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">FL</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">F Learning</span>
                            </Link>

                            <div className="w-16"></div> {/* Spacer for balance */}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Tạo tài khoản
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Bắt đầu hành trình học tập của bạn
                        </p>
                    </div>

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
                    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    id="firstName"
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Họ"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                                    {...register("firstName", {
                                        required: "Họ là bắt buộc",
                                        minLength: {
                                            value: 2,
                                            message: "Họ phải có ít nhất 2 ký tự"
                                        }
                                    })}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    id="lastName"
                                    type="text"
                                    disabled={isLoading}
                                    placeholder="Tên"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                                    {...register("lastName", {
                                        required: "Tên là bắt buộc",
                                        minLength: {
                                            value: 2,
                                            message: "Tên phải có ít nhất 2 ký tự"
                                        }
                                    })}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                disabled={isLoading}
                                placeholder="Email"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
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
                                autoComplete="new-password"
                                disabled={isLoading}
                                placeholder="Mật khẩu"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
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

                        <div>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                disabled={isLoading}
                                placeholder="Xác nhận mật khẩu"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 text-sm"
                                {...register("confirmPassword", {
                                    required: "Vui lòng xác nhận mật khẩu",
                                    validate: value => value === password || "Mật khẩu không khớp"
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div className="flex items-start pt-2">
                            <input
                                id="agreeToTerms"
                                type="checkbox"
                                disabled={isLoading}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-0.5"
                                {...register("agreeToTerms", {
                                    required: "Bạn phải đồng ý với điều khoản sử dụng"
                                })}
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 text-xs text-gray-600 leading-tight">
                                Tôi đồng ý với{" "}
                                <Link href="/terms" className="text-emerald-600 hover:text-emerald-500 font-medium">
                                    Điều khoản sử dụng
                                </Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-xs text-red-600">{errors.agreeToTerms.message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                        >
                            {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                        </button>

                        {/* Social Login */}
                        <div className="relative my-3">
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
                                className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Image src="/google.svg" alt="Google" width={14} height={14} />
                                <span className="ml-2 text-xs text-gray-700">Google</span>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Image src="/github.svg" alt="GitHub" width={14} height={14} />
                                <span className="ml-2 text-xs text-gray-700">GitHub</span>
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-600 mt-4">
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-500"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
