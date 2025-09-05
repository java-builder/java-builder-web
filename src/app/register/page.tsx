'use client'
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import ErrorMessage from "@/components/auth/ErrorMessage";

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
        <AuthLayout
            title="Tạo tài khoản"
            subtitle="Bắt đầu hành trình học tập của bạn ngay hôm nay"
        >
            {/* Social Login */}
            <div className="space-y-3 mb-6">
                <button
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Image src="/google.svg" alt="Google" width={20} height={20} />
                    <span className="text-sm font-medium text-gray-700">Tiếp tục với Google</span>
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Image src="/github.svg" alt="GitHub" width={20} height={20} />
                    <span className="text-sm font-medium text-gray-700">Tiếp tục với GitHub</span>
                </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 uppercase tracking-wide">Hoặc</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4">
                    <ErrorMessage message={error} />
                </div>
            )}

            {/* Register Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputField
                            id="firstName"
                            type="text"
                            label="Họ"
                            placeholder="Nhập họ"
                            disabled={isLoading}
                            {...register("firstName", {
                                required: "Họ là bắt buộc",
                                minLength: {
                                    value: 2,
                                    message: "Họ phải có ít nhất 2 ký tự"
                                }
                            })}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <InputField
                            id="lastName"
                            type="text"
                            label="Tên"
                            placeholder="Nhập tên"
                            disabled={isLoading}
                            {...register("lastName", {
                                required: "Tên là bắt buộc",
                                minLength: {
                                    value: 2,
                                    message: "Tên phải có ít nhất 2 ký tự"
                                }
                            })}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <InputField
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        disabled={isLoading}
                        {...register("email", {
                            required: "Email là bắt buộc",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email không hợp lệ"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <InputField
                        id="password"
                        type="password"
                        label="Mật khẩu"
                        placeholder="Tạo mật khẩu"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...register("password", {
                            required: "Mật khẩu là bắt buộc",
                            minLength: {
                                value: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự"
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
                            }
                        })}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <InputField
                        id="confirmPassword"
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: value => value === password || "Mật khẩu không khớp"
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        id="agreeToTerms"
                        type="checkbox"
                        disabled={isLoading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        {...register("agreeToTerms", {
                            required: "Bạn phải đồng ý với điều khoản sử dụng"
                        })}
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                            Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                            Chính sách bảo mật
                        </Link>
                    </label>
                </div>
                {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}

                <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo tài khoản...
                        </>
                    ) : (
                        'Tạo tài khoản'
                    )}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
