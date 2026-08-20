"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Crown, 
  BookOpen, 
  Check, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Infinity,
  ChevronLeft,
  CreditCard,
  Lock
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/contexts/I18nContext";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { SubscriptionPlan } from "@/types/subscription";
import { SubscribeResponse } from "@/types/user-subscription";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import toast from "react-hot-toast";

interface CourseUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice?: number;
  onBuySingleCourse: () => void;
  isCreatingPayment?: boolean;
}

type ModalView = "CHOICES" | "PLANS" | "PAYMENT";

export default function CourseUnlockModal({
  isOpen,
  onClose,
  courseTitle,
  coursePrice = 0,
  onBuySingleCourse,
  isCreatingPayment = false,
}: CourseUnlockModalProps) {
  const { locale } = useI18n();
  const { data: currentUser } = useCurrentUser();

  const [view, setView] = useState<ModalView>("CHOICES");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Subscription payment state
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [paymentData, setPaymentData] = useState<SubscribeResponse | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView("CHOICES");
      setPaymentData(null);
      setSelectedPlan(null);
      fetchPlans();
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      onClose();
    };

    window.addEventListener("payment:success", handlePaymentSuccess);
    return () => {
      window.removeEventListener("payment:success", handlePaymentSuccess);
    };
  }, [onClose]);

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const res = await subscriptionPlanService.getPlans();
      if (res.data) {
        const sorted = [...res.data].sort((a, b) => a.price - b.price);
        setPlans(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch subscription plans:", err);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  if (!isOpen) return null;

  const minPremiumPrice = plans.length > 0
    ? Math.min(...plans.map((p) => p.price).filter((pr) => pr > 0))
    : null;

  const formattedCoursePrice = coursePrice > 0
    ? new Intl.NumberFormat(locale === "vi" ? "vi-VN" : locale, {
        style: "currency",
        currency: "VND",
      }).format(coursePrice)
    : "Miễn phí";

  const formattedMinPremiumPrice = minPremiumPrice != null
    ? new Intl.NumberFormat(locale === "vi" ? "vi-VN" : locale, {
        style: "currency",
        currency: "VND",
      }).format(minPremiumPrice)
    : null;

  const formatPlanPrice = (price: number) => {
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
      if (res.data) {
        setPaymentData(res.data);
      } else {
        toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
        setView("PLANS");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Có lỗi xảy ra khi tạo thanh toán.");
      setView("PLANS");
    } finally {
      setIsSubscribing(false);
    }
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
          className={`relative w-full ${view === "PAYMENT" ? "max-w-lg" : "max-w-2xl"} max-h-[94vh] flex flex-col transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-850 text-left shadow-2xl transition-all border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header for PAYMENT View (Identical to original PaymentModal style) */}
          {view === "PAYMENT" ? (
            <div className="px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
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
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Top Bar for CHOICES and PLANS Views */
            <div className="flex items-center justify-between px-4 pt-3.5 pb-1">
              {view === "PLANS" ? (
                <button
                  type="button"
                  onClick={() => setView("CHOICES")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer py-1 px-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          )}

          {/* VIEW 1: CHOICES (Main view) */}
          {view === "CHOICES" && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 overflow-y-auto">
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
                  Để tiếp tục học <span className="font-semibold text-gray-800 dark:text-gray-200">&ldquo;{courseTitle}&rdquo;</span>
                </p>
              </div>

              {/* 2 Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
                
                {/* Option 1: Standalone Course (Lifetime) */}
                <div className="relative rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-3.5 sm:p-4 flex flex-col justify-between hover:border-gray-300 dark:hover:border-slate-700 transition-all">
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
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                      Thanh toán 1 lần, học không giới hạn thời gian.
                    </p>

                    <div className="my-2.5 pt-2 border-t border-gray-200/70 dark:border-slate-700/60 flex items-baseline">
                      <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                        {formattedCoursePrice}
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
                      onClick={onBuySingleCourse}
                      disabled={isCreatingPayment}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      <span>Mua lẻ khóa học</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Option 2: Premium Subscription (Best Value) */}
                <div className="relative rounded-xl border-2 border-accent/80 dark:border-accent/60 bg-gradient-to-b from-accent/[0.04] to-accent/[0.08] dark:from-accent/[0.12] dark:to-accent/[0.05] p-3.5 sm:p-4 flex flex-col justify-between shadow-md shadow-accent/5">
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

                    <div className="my-2.5 pt-2 border-t border-accent/20 dark:border-accent/20 flex items-baseline min-h-[36px]">
                      {isLoadingPlans && !formattedMinPremiumPrice ? (
                        <div className="h-6 w-28 bg-accent/20 animate-pulse rounded-md" />
                      ) : formattedMinPremiumPrice ? (
                        <>
                          <span className="text-xl sm:text-2xl font-black text-accent">
                            {formattedMinPremiumPrice}
                          </span>
                          <span className="text-[10px] text-gray-600 dark:text-gray-400 ml-1 font-medium">
                            / tháng (từ)
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-accent">
                          Gói Hội Viên VIP
                        </span>
                      )}
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
                        <span>Toàn bộ <span className="font-semibold">ngân hàng câu hỏi phỏng vấn</span></span>
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
                      onClick={() => setView("PLANS")}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs bg-accent hover:bg-accent-600 text-white shadow-sm shadow-accent/20 hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Nâng cấp Premium ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Guarantee footer */}
              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Thanh toán bảo mật PayOS</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Kích hoạt tự động ngay tức thì</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PREMIUM PLANS SELECTION (Styled exactly like /pricing cards) */}
          {view === "PLANS" && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 overflow-y-auto">
              <div className="text-center max-w-md mx-auto mb-4">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold text-[11px] mb-1">
                  <Crown className="w-3 h-3" />
                  <span>Gói Hội Viên VIP</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Chọn gói Premium phù hợp với bạn
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Mở khóa toàn bộ các khóa học và câu hỏi phỏng vấn trên JavaBuilder.
                </p>
              </div>

              {isLoadingPlans ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 animate-pulse py-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 space-y-3" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
                  {plans.map((plan) => {
                    const isYearly = plan.durationDays >= 365;
                    const isMonth = plan.durationDays <= 31;
                    const isPopular = isMonth;

                    const baseFeatures = plan.features
                      ? plan.features.split("|").map((f: string) => f.trim()).filter(Boolean)
                      : [];

                    const defaultFeatures = [
                      "Mở khóa toàn bộ các khóa học trên hệ thống",
                      "Ôn tập toàn bộ câu hỏi phỏng vấn chuyên sâu",
                      ...baseFeatures,
                    ];

                    const periodText = isMonth
                      ? "/ tháng"
                      : isYearly
                        ? "/ năm"
                        : `/${plan.durationDays} ngày`;

                    const monthlyEquivalent = isYearly
                      ? `~ ${formatPlanPrice(Math.round(plan.price / 12))} đ / tháng`
                      : null;

                    return (
                      <div
                        key={plan.id}
                        className={`relative bg-card text-card-foreground border rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-300 ${
                          isPopular
                            ? "border-accent ring-1 ring-accent/20 bg-accent/[0.03] dark:bg-accent/[0.06] shadow-md scale-[1.01]"
                            : "border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850 hover:border-accent/40"
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                            <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                              Phổ biến nhất
                            </span>
                          </div>
                        )}

                        {isYearly && !isPopular && (
                          <div className="absolute -top-2.5 right-3">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                              Tiết kiệm 58%
                            </span>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="text-center">
                            <h4 className="text-sm sm:text-base font-bold text-foreground mb-0.5">
                              {plan.name}
                            </h4>
                            <p className="text-[11px] text-muted-foreground min-h-[22px] flex items-center justify-center line-clamp-1">
                              {plan.description || "Phù hợp để nâng cao kỹ năng toàn diện"}
                            </p>

                            <div className="flex items-baseline justify-center gap-1 mt-2">
                              <span className="text-xl sm:text-2xl font-extrabold text-foreground">
                                {formatPlanPrice(plan.price)}
                              </span>
                              <span className="text-xs text-muted-foreground">đ {periodText}</span>
                            </div>

                            {monthlyEquivalent && (
                              <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                                {monthlyEquivalent}
                              </p>
                            )}
                          </div>

                          <div className="border-t border-border my-1" />

                          <ul className="space-y-1.5">
                            {defaultFeatures.slice(0, 4).map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-left">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-[11px] sm:text-xs text-foreground/90 font-medium leading-snug">
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-2">
                          <button
                            type="button"
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                              isPopular
                                ? "bg-accent hover:bg-accent-600 text-white shadow-xs"
                                : "bg-accent/90 hover:bg-accent text-white"
                            }`}
                          >
                            <span>Đăng ký ngay</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-3.5 pt-2 border-t border-gray-100 dark:border-slate-800 text-center">
                <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                  Thanh toán tự động qua PayOS • Kích hoạt tài khoản ngay tức thì
                </span>
              </div>
            </div>
          )}

          {/* VIEW 3: PREMIUM PAYMENT WITH QR (Original PaymentModal standard layout) */}
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
                        {formatPlanPrice(paymentData.totalPrice)}đ
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-750 dark:text-yellow-400 text-[10px] font-bold rounded-full border border-yellow-200 dark:border-yellow-900/40 uppercase tracking-wider">
                        Chờ thanh toán
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  {paymentData.qrCode && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-xl border border-gray-100 dark:border-slate-800 shadow-xs">
                        <QRCodeSVG value={paymentData.qrCode} size={200} level="M" />
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-slate-900/40 rounded-xl mb-4 border border-gray-100 dark:border-slate-800/80">
                    <span className="text-sm text-gray-500 dark:text-slate-400">Mã đơn hàng</span>
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
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-xs hover:shadow active:scale-98 transition-all cursor-pointer text-sm"
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
