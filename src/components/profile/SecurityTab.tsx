'use client';

import { useState } from 'react';

export default function SecurityTab() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Bảo mật</h1>
                    <p className="text-gray-600 mt-1">Quản lý các cài đặt bảo mật cho tài khoản của bạn</p>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
                <div className="max-w-2xl">
                    {/* Two-Factor Authentication */}
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Xác thực hai yếu tố</h3>
                                <p className="text-gray-600 mt-1">Thêm lớp bảo mật bổ sung cho tài khoản</p>
                            </div>
                            <button
                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-gray-900' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Mẹo bảo mật</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Để tài khoản của bạn an toàn hơn, hãy bật xác thực hai yếu tố và thường xuyên kiểm tra các hoạt động đăng nhập.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}