'use client'

import { useState, useRef, useEffect } from 'react';
import { authApi } from '@/services/auth.service';

interface TwoFactorModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onSuccess: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, email, onSuccess }: TwoFactorModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = pastedData.split('').concat(new Array(6 - pastedData.length).fill(''));
        setOtp(newOtp);

        if (pastedData.length === 6) {
            inputRefs.current[5]?.focus();
        } else if (pastedData.length > 0) {
            inputRefs.current[pastedData.length]?.focus();
        }
    };

    const onSubmit = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError("Vui lòng nhập đủ 6 chữ số");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const result = await authApi.loginTwoFactor({
                email,
                code
            });

            if (result.code === 200 && result.result?.accessToken) {
                onSuccess();
                handleClose();
            } else {
                setError("Mã OTP không đúng. Vui lòng thử lại.");
            }
        } catch {
            setError("Mã OTP không đúng. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOtp(new Array(6).fill(''));
        setError("");
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0]?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Xác thực 2 bước
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Nhập mã OTP đã được gửi đến
                    </p>
                    <p className="text-gray-900 font-medium text-sm">
                        {email}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isLoading}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50"
                            />
                        ))}
                    </div>

                    <button
                        onClick={onSubmit}
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-32 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 shadow-md text-sm mx-auto block"
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </div>
            </div>
        </div>
    );
}
