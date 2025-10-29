'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { twoFactorApi } from '@/services/two-factor.service';
import { TwoFactorSetupResponse } from '@/types/two-factor';
import ConfirmModal from '@/components/common/ConfirmModal';

interface TwoFactorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
    const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrCodeError, setQrCodeError] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            handleSetup();
        }
    }, [isOpen]);

    const handleSetup = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await twoFactorApi.activate();
            if (response.result) {
                setSetupData(response.result);
            }
        } catch (error: unknown) {
            let errorMessage = 'Có lỗi xảy ra khi thiết lập 2FA';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode.trim()) {
            setError('Vui lòng nhập mã xác thực');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            await twoFactorApi.verifyCodeSetup({ code: verificationCode });
            onSuccess();
            onClose();
        } catch (error: unknown) {
            let errorMessage = 'Mã xác thực không đúng';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (setupData) {
            setShowConfirm(true);
        } else {
            doClose();
        }
    };

    const doClose = () => {
        setSetupData(null);
        setVerificationCode('');
        setError('');
        setQrCodeError(false);
        setShowConfirm(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Thiết lập 2FA
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Đang thiết lập 2FA...</p>
                            </div>
                        ) : setupData ? (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        Quét mã QR bằng ứng dụng xác thực
                                    </h4>
                                    <p className="text-xs text-gray-600 mb-4">
                                        Sử dụng Google Authenticator, Authy hoặc ứng dụng tương tự
                                    </p>

                                    {/* QR Code */}
                                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                                        {!qrCodeError ? (
                                            <Image
                                                src={setupData.qrCodeData}
                                                alt="QR Code for 2FA setup"
                                                width={192}
                                                height={192}
                                                className="w-48 h-48 object-contain"
                                                onError={() => {
                                                    console.error('QR Code load error');
                                                    setQrCodeError(true);
                                                }}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-xs text-gray-500">Không thể tải QR code</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Verification Input */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        Nhập mã xác thực
                                    </h4>
                                    <p className="text-xs text-gray-600 mb-4">
                                        Nhập mã 6 chữ số từ ứng dụng xác thực của bạn
                                    </p>

                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        maxLength={6}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleVerify}
                                        disabled={isLoading || verificationCode.length !== 6}
                                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-600">Không thể tải dữ liệu thiết lập</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={doClose}
                title="Xác nhận đóng"
                message="Bạn có chắc chắn muốn đóng modal? Dữ liệu đã nhập sẽ bị mất."
                confirmText="Đóng"
                cancelText="Tiếp tục"
                type="warning"
            />
        </div>
    );
}
