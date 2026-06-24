"use client";

import { QRCodeSVG } from "qrcode.react";
import { CreatePaymentResponse } from "@/types/payment";

interface PaymentModalProps {
  isOpen: boolean;
  isLoading: boolean;
  data: CreatePaymentResponse | null;
  courseTitle: string;
  onClose: () => void;
}

export default function PaymentModal({
  isOpen,
  isLoading,
  data,
  courseTitle,
  onClose,
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-150 dark:border-slate-700/50 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  Thanh toán khóa học
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  Quét mã QR hoặc chuyển khoản
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
              >
                <svg
                  className="w-5.5 h-5.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent border-r-accent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-700 font-semibold text-lg mb-2">
                Đang tạo mã thanh toán
              </p>
              <p className="text-gray-500 text-sm">
                Vui lòng chờ trong giây lát...
              </p>
              <div className="flex justify-center gap-1.5 mt-4">
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          ) : data ? (
            <div>
              {/* Course Info */}
              <div className="text-center mb-5">
                <h4 className="font-medium text-gray-900 line-clamp-2">
                  {courseTitle}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xl font-bold text-accent">
                    {new Intl.NumberFormat("vi-VN").format(data.totalPrice)}đ
                  </span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Chờ thanh toán
                  </span>
                </div>
              </div>

              {/* QR Code */}
              {data.qrCode && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <QRCodeSVG value={data.qrCode} size={200} level="M" />
                  </div>
                </div>
              )}

              {/* Order Info */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
                <span className="text-sm text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-semibold text-gray-900">
                  {data.orderCode}
                </span>
              </div>

              {/* Checkout Button */}
              {data.checkoutUrl && (
                <a
                  href={data.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                >
                  Thanh toán qua PayOS
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}

              {/* Footer Note */}
              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>
                  Thanh toán được bảo mật bởi PayOS. Khóa học sẽ được kích hoạt
                  tự động sau khi thanh toán thành công.
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
