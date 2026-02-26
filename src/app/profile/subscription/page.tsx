"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { UserSubscription } from "@/types/user-subscription";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function MySubscriptionPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await userSubscriptionService.getMySubscription();
      setSubscription(response.data || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleRenew = async () => {
    if (!subscription) return;
    
    try {
      setIsRenewing(true);
      const response = await userSubscriptionService.renew(subscription.planId);
      
      if (response.code === 200) {
        toast.success("Gia hạn gói Premium thành công!");
        setShowRenewModal(false);
        // Refresh subscription data
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Error renewing subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi gia hạn gói";
      toast.error(errorMessage);
    } finally {
      setIsRenewing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Chưa có gói Premium
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn chưa đăng ký gói Premium nào. Nâng cấp ngay để truy cập toàn bộ nội dung!
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Xem các gói Premium
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isActive = subscription.status === "ACTIVE";
  const daysLeft = subscription.daysRemaining || 0;
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Gói Premium của tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin gói Premium và quyền lợi của bạn
          </p>
        </div>

        {/* Subscription Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subscription.planName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gói hiện tại
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {isActive ? "Đang hoạt động" : "Đã hết hạn"}
                </div>
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Gia hạn gói
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Status Alert */}
            {isExpiringSoon && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-amber-900 dark:text-amber-200 text-sm sm:text-base">
                      Gói Premium sắp hết hạn
                    </p>
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Gói của bạn sẽ hết hạn trong {daysLeft} ngày. Gia hạn ngay để tiếp tục sử dụng!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Ngày bắt đầu
                  </label>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all">{formatDate(subscription.startDate)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Ngày hết hạn
                  </label>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all">{formatDate(subscription.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Thời gian còn lại
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl sm:text-3xl font-bold ${
                      daysLeft > 7 
                        ? "text-green-600 dark:text-green-400" 
                        : daysLeft > 0 
                        ? "text-amber-600 dark:text-amber-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {daysLeft}
                    </div>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">ngày</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Trạng thái
                  </label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                    isActive 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                    {subscription.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Confirmation Modal */}
      {showRenewModal && subscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Xác nhận gia hạn gói
              </h3>
            </div>

            {/* Modal Content */}
            <div className="px-4 sm:px-6 py-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                Bạn có chắc chắn muốn gia hạn gói Premium không?
              </p>
              
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 sm:p-4 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Gói:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right break-words">
                    {subscription.planName}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Ngày hết hạn hiện tại:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right break-all">
                    {formatDate(subscription.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={() => setShowRenewModal(false)}
                disabled={isRenewing}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleRenew}
                disabled={isRenewing}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRenewing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận gia hạn"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
