"use client";

import { useState, useEffect } from "react";
import {
  X,
  Crown,
  Zap,
  Check,
  Sparkles,
  ArrowRight,
  CreditCard,
  Lock,
  BookOpen,
  Infinity,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/contexts/I18nContext";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { SubscriptionPlan } from "@/types/subscription";
import { SubscribeResponse } from "@/types/user-subscription";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import toast from "react-hot-toast";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle?: string;
  challengePrice?: number;
  onBuyStandalone?: () => void;
  onSuccess?: () => void;
}

type ModalView = "PLANS" | "PAYMENT";

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  challengeTitle,
  challengePrice = 0,
  onBuyStandalone,
  onSuccess,
}: PremiumUpgradeModalProps) {
  const { locale } = useI18n();
  const { data: currentUser } = useCurrentUser();

  const [view, setView] = useState<ModalView>("PLANS");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Selected plan & payment state
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [paymentData, setPaymentData] = useState<SubscribeResponse | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setView("PLANS");
      setPaymentData(null);
      setSelectedPlan(null);
      fetchPlans();
    }
  }, [isOpen]);

  // Listen for payment success from WebSocket
  useEffect(() => {
    const handlePaymentSuccess = () => {
      toast.success("Nâng cấp gói Premium thành công! Toàn bộ nội dung đã được mở khóa.");
      if (onSuccess) onSuccess();
      onClose();
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => {
      window.removeEventListener("payment:success", handlePaymentSuccess);
    };
  }, [onClose, onSuccess]);

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const res = await subscriptionPlanService.getPlans();
      if (res?.data && res.data.length > 0) {
        // Sort plans: month first, then price asc
        const sorted = [...res.data].sort((a, b) => {
          const aIsMonth = a.durationDays <= 31;
          const bIsMonth = b.durationDays <= 31;
          if (aIsMonth && !bIsMonth) return -1;
          if (!aIsMonth && bIsMonth) return 1;
          return a.price - b.price;
        });
        setPlans(sorted);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Failed to fetch subscription plans:", err);
      setPlans([]);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : locale).format(price);
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để nâng cấp gói Premium.");
      return;
    }

    setSelectedPlan(plan);
    setIsSubscribing(true);
    setView("PAYMENT");

    try {
      const res = await userSubscriptionService.subscribe(plan.id);
      if (res?.data) {
        setPaymentData(res.data);
      } else {
        toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
        setView("PLANS");
      }
    } catch (err: unknown) {
      console.error("Subscription error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      const msg =
        errorResponse?.response?.data?.message ||
        "Có lỗi xảy ra khi tạo thanh toán.";
      toast.error(msg);
      setView("PLANS");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fallback Month Plan handler (100.000đ/tháng)
  const handleSelectFallbackMonthPlan = () => {
    handleSelectPlan({
      id: "monthly-plan",
      name: "Gói Premium 1 Tháng",
      price: 100000,
      durationDays: 30,
      description: "Hội viên VIP mở khóa toàn diện nền tảng.",
      features: "Mở khóa TẤT CẢ các khóa học|Toàn bộ ngân hàng câu hỏi phỏng vấn|Tự do học mọi lộ trình, tiết kiệm 80% chi phí",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className={`relative w-full ${
            view === "PAYMENT" ? "max-w-lg" : "max-w-2xl"
          } max-h-[94vh] flex flex-col transform overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar for PAYMENT View */}
          {view === "PAYMENT" ? (
            <div className="px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      Thanh toán {selectedPlan?.name || "gói Premium"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      Quét mã QR hoặc chuyển khoản PayOS
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Close Button for PLANS View */
            <div className="flex items-center justify-end px-4 pt-3.5 pb-1">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          )}

          {/* VIEW 1: CHOICES / PLANS */}
          {view === "PLANS" && (
            <div className="px-4 pb-5 sm:px-5 sm:pb-6 overflow-y-auto">
              {/* Header info */}
              <div className="text-center max-w-lg mx-auto mb-3.5 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 dark:bg-accent/20 text-accent font-semibold text-[11px] mb-1.5 border border-accent/20">
                  <Sparkles className="w-3 h-3" />
                  <span>Mở khóa nội dung bài học</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Lựa chọn gói truy cập phù hợp với bạn
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {challengeTitle ? (
                    <>
                      Để tiếp tục học{" "}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        &ldquo;{challengeTitle}&rdquo;
                      </span>
                    </>
                  ) : (
                    "Lựa chọn hình thức mở khóa để bắt đầu lộ trình học tập."
                  )}
                </p>
              </div>

              {/* Plans Loading Skeleton */}
              {isLoadingPlans ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-pulse py-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-100 dark:bg-slate-800 rounded-xl p-4 space-y-3"
                    />
                  ))}
                </div>
              ) : plans.length === 0 ? (
                /* FALLBACK: Exactly 2 cards like reference photo (Standalone vs Month Premium 100.000đ) */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
                  {/* Left Option: Mua lẻ khóa học / thử thách này */}
                  <div className="relative rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-3.5 sm:p-4 flex flex-col justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                          <Infinity className="w-2.5 h-2.5" />
                          Sở hữu trọn đời
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        Mua lẻ khóa học này
                      </h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                        Thanh toán 1 lần, học không giới hạn thời gian.
                      </p>

                      <div className="my-2.5 pt-2 border-t border-gray-200/70 dark:border-slate-700/60 flex items-baseline">
                        <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                          {challengePrice && challengePrice > 0
                            ? `${formatPrice(challengePrice)} đ`
                            : "Miễn phí"}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">
                          / vĩnh viễn
                        </span>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-1.5 text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Sở hữu trọn đời toàn bộ bài học</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Tài liệu lý thuyết, source code & bài tập</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Hỏi đáp trực tiếp dưới mỗi bài học</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onBuyStandalone) {
                            onBuyStandalone();
                          } else {
                            onClose();
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Mua lẻ khóa học</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Option: Nâng cấp gói Premium (100.000đ/tháng - Default Recommended) */}
                  <div className="relative rounded-lg border-2 border-accent/80 dark:border-accent/60 bg-gradient-to-b from-accent/[0.04] to-accent/[0.08] dark:from-accent/[0.12] dark:to-accent/[0.05] p-3.5 sm:p-4 flex flex-col justify-between shadow-md shadow-accent/5">
                    {/* Best Value Badge */}
                    <div className="absolute -top-2.5 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                        <Crown className="w-2.5 h-2.5" />
                        Khuyên Dùng • Tiết Kiệm
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold shadow-xs">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        Nâng cấp gói Premium
                      </h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                        Hội viên VIP mở khóa toàn diện nền tảng.
                      </p>

                      <div className="my-2.5 pt-2 border-t border-accent/20 dark:border-accent/20 flex items-baseline">
                        <span className="text-xl sm:text-2xl font-black text-accent">
                          100.000 đ
                        </span>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 font-medium">
                          / tháng (từ)
                        </span>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-1.5 text-[11px] sm:text-xs text-gray-700 dark:text-gray-200">
                        <li className="flex items-start gap-1.5">
                          <div className="p-0.5 rounded bg-accent/20 text-accent dark:text-accent-400 mt-0.5 shrink-0">
                            <Zap className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Mở khóa TẤT CẢ các khóa học
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <div className="p-0.5 rounded bg-accent/20 text-accent dark:text-accent-400 mt-0.5 shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>
                            Toàn bộ <span className="font-semibold">ngân hàng câu hỏi phỏng vấn</span>
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <div className="p-0.5 rounded bg-accent/20 text-accent dark:text-accent-400 mt-0.5 shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>Tự do học mọi lộ trình, tiết kiệm 80% chi phí</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3.5 pt-2">
                      <button
                        type="button"
                        onClick={handleSelectFallbackMonthPlan}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs bg-accent hover:bg-accent-600 text-white shadow-sm shadow-accent/20 hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>Nâng cấp Premium ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dynamic Plans Grid from API (Month plan is recommended by default) */
                <div
                  className={`grid grid-cols-1 ${
                    plans.length >= 2 ? "sm:grid-cols-2" : "max-w-md mx-auto"
                  } gap-3 sm:gap-4 items-stretch`}
                >
                  {plans.map((plan, index) => {
                    const isMonth = plan.durationDays <= 31;
                    // Default recommended to Month package instead of Year
                    const isRecommended = isMonth || (plans.length === 1) || (index === 0);

                    const baseFeatures = plan.features
                      ? plan.features
                          .split("|")
                          .map((f: string) => f.trim())
                          .filter(Boolean)
                      : [];

                    const defaultFeatures =
                      baseFeatures.length > 0
                        ? baseFeatures
                        : [
                            "Mở khóa TẤT CẢ các khóa học",
                            "Toàn bộ ngân hàng câu hỏi phỏng vấn",
                            "Tự do học mọi lộ trình, tiết kiệm 80% chi phí",
                            "Hội viên VIP mở khóa toàn diện nền tảng",
                          ];

                    const periodText = isMonth
                      ? "/ tháng"
                      : plan.durationDays >= 365
                      ? "/ năm"
                      : `/${plan.durationDays} ngày`;

                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-lg p-3.5 sm:p-4 flex flex-col justify-between transition-all ${
                          isRecommended
                            ? "border-2 border-accent/80 dark:border-accent/60 bg-gradient-to-b from-accent/[0.04] to-accent/[0.08] dark:from-accent/[0.12] dark:to-accent/[0.05] shadow-md shadow-accent/5"
                            : "border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {/* Recommended Badge only on Month Plan */}
                        {isRecommended && (
                          <div className="absolute -top-2.5 right-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                              <Crown className="w-2.5 h-2.5" />
                              Khuyên Dùng • Tiết Kiệm
                            </span>
                          </div>
                        )}

                        <div>
                          {/* Card Header with Icon */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold shadow-xs ${
                                isRecommended
                                  ? "bg-accent text-white"
                                  : "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {isRecommended ? (
                                <Crown className="w-3.5 h-3.5" />
                              ) : (
                                <Zap className="w-3.5 h-3.5" />
                              )}
                            </div>

                            {!isRecommended && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                Dài hạn
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                            {plan.name}
                          </h4>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                            {plan.description || "Hội viên VIP mở khóa toàn diện nền tảng."}
                          </p>

                          {/* Price Display */}
                          <div className="my-2.5 pt-2 border-t border-gray-200/70 dark:border-slate-700/60 flex items-baseline">
                            <span
                              className={`text-xl sm:text-2xl font-black ${
                                isRecommended ? "text-accent" : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {formatPrice(plan.price)} đ
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1 font-medium">
                              {periodText}
                            </span>
                          </div>

                          {/* Feature Highlights */}
                          <ul className="space-y-1.5 text-[11px] sm:text-xs text-gray-700 dark:text-gray-200">
                            {defaultFeatures.slice(0, 4).map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <div
                                  className={`p-0.5 rounded mt-0.5 shrink-0 ${
                                    isRecommended
                                      ? "bg-accent/20 text-accent dark:text-accent-400"
                                      : "text-emerald-500"
                                  }`}
                                >
                                  {isRecommended && idx === 0 ? (
                                    <Zap className="w-2.5 h-2.5" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  )}
                                </div>
                                <span
                                  className={
                                    idx === 0
                                      ? "font-semibold text-gray-900 dark:text-white"
                                      : "text-gray-600 dark:text-gray-300"
                                  }
                                >
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Card CTA Button */}
                        <div className="mt-3.5 pt-2">
                          <button
                            type="button"
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                              isRecommended
                                ? "bg-accent hover:bg-accent-600 text-white shadow-sm shadow-accent/20 hover:shadow-md"
                                : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-2xs"
                            }`}
                          >
                            <span>
                              {isRecommended ? "Nâng cấp Premium ngay" : "Đăng ký gói này"}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: PAYMENT WITH QR */}
          {view === "PAYMENT" && (
            <div className="p-6">
              {isSubscribing || !paymentData ? (
                <div className="text-center py-12">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent border-r-accent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg mb-2">
                    Đang tạo mã thanh toán
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Vui lòng chờ trong giây lát...
                  </p>
                </div>
              ) : (
                <div>
                  {/* Price info */}
                  <div className="text-center mb-5">
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                      {selectedPlan?.name || "Gói Premium"}
                    </h4>
                    <div className="flex items-center justify-center gap-2 mt-1.5">
                      <span className="text-2xl font-bold text-accent">
                        {formatPrice(paymentData.totalPrice)} đ
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-[10px] font-bold rounded-full border border-yellow-200 dark:border-yellow-900/40 uppercase tracking-wider">
                        Chờ thanh toán
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  {paymentData.qrCode && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-lg border border-gray-100 dark:border-slate-800 shadow-xs">
                        <QRCodeSVG value={paymentData.qrCode} size={200} level="M" />
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-slate-900/40 rounded-lg mb-4 border border-gray-100 dark:border-slate-800/80">
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      Mã đơn hàng
                    </span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {paymentData.orderCode}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  {paymentData.checkoutUrl && (
                    <a
                      href={paymentData.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg shadow-xs hover:shadow active:scale-98 transition-all cursor-pointer text-sm"
                    >
                      <span>Thanh toán qua PayOS</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}

                  {/* Back to select other plans & Footer Note */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-slate-500">
                    <button
                      type="button"
                      onClick={() => setView("PLANS")}
                      className="text-accent hover:underline cursor-pointer font-medium"
                    >
                      ← Đổi gói khác
                    </button>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bảo mật qua PayOS</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
