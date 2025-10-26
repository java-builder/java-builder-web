'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedModal() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const { } = useAuth();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Redirect về trang chủ sau khi đóng modal
        setTimeout(() => {
            router.push('/');
        }, 300);
    };

    const handleLogin = () => {
        router.push('/login');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Body */}
                    <div className="px-8 py-12">
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 animate-pulse"></div>
                                <svg className="h-10 w-10 text-orange-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Không đủ quyền truy cập
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản có quyền ADMIN hoặc liên hệ quản trị viên.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Về trang chủ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 border border-transparent rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
                    <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-orange-100 to-orange-200 rounded-full opacity-20"></div>
                </div>
            </div>
        </div>
    );
}
