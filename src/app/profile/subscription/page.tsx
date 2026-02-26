"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { UserSubscription } from "@/types/user-subscription";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";

export default function MySubscriptionPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchSubscription();
  }, []);

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
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
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
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {isActive ? "Đang hoạt động" : "Đã hết hạn"}
                </div>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Gia hạn gói
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Alert */}
            {isExpiringSoon && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-200">
                      Gói Premium sắp hết hạn
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Gói của bạn sẽ hết hạn trong {daysLeft} ngày. Gia hạn ngay để tiếp tục sử dụng!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Ngày bắt đầu
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(subscription.startDate)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Ngày hết hạn
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(subscription.endDate)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Thời gian còn lại
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`text-3xl font-bold ${
                      daysLeft > 7 
                        ? "text-green-600 dark:text-green-400" 
                        : daysLeft > 0 
                        ? "text-amber-600 dark:text-amber-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {daysLeft}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">ngày</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                    Trạng thái
                  </label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
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

      <Footer />
    </div>
  );
}
