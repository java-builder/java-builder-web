"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, X, Crown, BookOpen, MessageSquare, Zap, HelpCircle, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import RateLimitModal from "@/components/ui/RateLimitModal";
import { subscriptionPlanService } from "@/services/subscription-plan.service";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { SubscriptionPlan } from "@/types/subscription";
import { SubscribeResponse } from "@/types/user-subscription";
import { getErrorMessage, isRateLimitError } from "@/utils/apiError";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { useI18n } from "@/contexts/I18nContext";

interface PlanDisplay {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  popular: boolean;
  disabled: boolean;
  apiPlanId: string | null;
  originalPrice?: number;
  monthlyEquivalent?: string;
}

export default function PricingPage() {
  const { t, locale } = useI18n();
  const { data: currentUser } = useCurrentUser();
  usePaymentWebSocket();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [apiPlans, setApiPlans] = useState<PlanDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false);

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    data: SubscribeResponse | null;
    planName: string;
  }>({
    isOpen: false,
    isLoading: false,
    data: null,
    planName: "",
  });

  const plans = useMemo<PlanDisplay[]>(() => {
    const freePlan: PlanDisplay = {
      id: "free",
      name: t("pricingPage.freePlanName"),
      price: 0,
      period: "",
      description: t("pricingPage.freePlanDesc"),
      features: [
        { text: t("pricingPage.freeFeature1"), included: true },
        { text: t("pricingPage.freeFeature2"), included: true },
        { text: t("pricingPage.freeFeature3"), included: true },
        { text: t("pricingPage.freeFeature4"), included: false },
        { text: t("pricingPage.freeFeature5"), included: false },
        { text: t("pricingPage.freeFeature6"), included: false },
      ],
      buttonText: t("pricingPage.statusUsing"),
      popular: false,
      disabled: true,
      apiPlanId: null,
    };
    return [freePlan, ...apiPlans];
  }, [t, apiPlans]);

  useEffect(() => {
    const convertToPlanDisplay = (plan: SubscriptionPlan): PlanDisplay => {
      const isMonthly = plan.durationDays <= 31;
      const isYearly = plan.durationDays >= 365;

      const baseFeatures = plan.features
        ? plan.features.split("|").map((f: string) => ({ text: f.trim(), included: true }))
        : [];

      const isPremium = plan.name.toLowerCase().includes("premium") || plan.id.toLowerCase().includes("premium");

      const premiumFeatures = [
        { 
          text: locale === "vi" ? "Mở khóa 100% tất cả khóa học & tài liệu trên hệ thống" : "Unlock 100% of all courses and docs on platform", 
          included: true 
        },
        { 
          text: locale === "vi" ? "Tự động truy cập mọi khóa học & bài học mới cập nhật" : "Access all newly released courses and updates", 
          included: true 
        },
        { 
          text: locale === "vi" ? "Ôn luyện toàn bộ ngân hàng câu hỏi phỏng vấn chuyên sâu" : "Practice full bank of advanced interview questions", 
          included: true 
        },
        { 
          text: locale === "vi" ? "Hỗ trợ ưu tiên 1-1 và giải đáp thắc mắc từ mentor" : "1-on-1 priority mentor support & Q&A", 
          included: true 
        },
        { 
          text: locale === "vi" ? "Tải mã nguồn dự án mẫu & tài nguyên độc quyền" : "Download sample project source code & assets", 
          included: true 
        },
      ];

      const features = isPremium ? premiumFeatures : baseFeatures;

      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: isMonthly
          ? t("pricingPage.periodMonthly")
          : isYearly
            ? t("pricingPage.periodYearly")
            : t("pricingPage.periodDays").replace("{days}", plan.durationDays.toString()),
        description: plan.description || (locale === "vi" ? "Truy cập toàn bộ tài liệu Premium & quyền lợi đặc biệt" : "Full access to Premium docs and perks"),
        features,
        buttonText: t("pricingPage.subscribeBtn"),
        popular: isMonthly,
        disabled: false,
        apiPlanId: plan.id,
        originalPrice: isYearly ? 499000 * 12 : undefined,
        monthlyEquivalent: isYearly
          ? t("pricingPage.monthlyEquivalent").replace("{price}", new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(Math.round(plan.price / 12)))
          : undefined,
      };
    };

    const fetchPlans = async () => {
      try {
        const response = await subscriptionPlanService.getPlans();
        if (response.data) {
          const apiPlansData = response.data.map((plan: SubscriptionPlan) => convertToPlanDisplay(plan));
          apiPlansData.sort((a, b) => a.price - b.price);
          setApiPlans(apiPlansData);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [t, locale]);

  const handleSubscribe = async (plan: PlanDisplay) => {
    if (!plan.apiPlanId) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // Open modal with loading state
    setPaymentModal({
      isOpen: true,
      isLoading: true,
      data: null,
      planName: plan.name,
    });

    try {
      setLoadingPlan(plan.id);
      const response = await userSubscriptionService.subscribe(plan.apiPlanId);

      if (response.data) {
        setPaymentModal({
          isOpen: true,
          isLoading: false,
          data: response.data,
          planName: plan.name,
        });
      } else {
        toast.error(t("pricingPage.paymentLinkError"));
        setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" });
      }
    } catch (error) {
      setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" });
      if (isRateLimitError(error)) {
        setRateLimitModalOpen(true);
        return;
      }
      toast.error(getErrorMessage(error, t("pricingPage.subscribeFailed")));
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(price);
  };

  return (
    <>
      <main className="min-h-screen bg-background text-foreground pt-2">
        {/* Hero Section */}
        <section className="pt-5 pb-5 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
              {t("pricingPage.heroBadge")}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {t("pricingPage.heroTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t("pricingPage.heroDesc")}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-4 sm:gap-5 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="space-y-1.5">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-3.5 bg-muted rounded w-2/3" />
                    </div>
                    <div className="h-8 bg-muted rounded w-1/2" />
                    <div className="space-y-2 pt-3 border-t border-border">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-muted" />
                          <div className="h-3.5 bg-muted rounded flex-1" />
                        </div>
                      ))}
                    </div>
                    <div className="h-9 bg-muted rounded-xl w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-card text-card-foreground border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${plan.popular
                        ? "border-accent ring-1 ring-accent/20 shadow-lg scale-[1.01] md:scale-[1.02] z-10"
                        : "border-border hover:border-accent/40 hover:shadow-sm"
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                          {t("pricingPage.popularBadge")}
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-0.5">{plan.name}</h3>
                        <p className="text-[11px] sm:text-xs text-muted-foreground min-h-[30px] flex items-center justify-center">{plan.description}</p>

                        <div className="flex items-baseline justify-center gap-1 mt-2.5">
                          {plan.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through mr-1.5">
                              {formatPrice(plan.originalPrice)}đ
                            </span>
                          )}
                          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                            {plan.price === 0 ? "0" : formatPrice(plan.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">đ{plan.period}</span>
                        </div>

                        {plan.monthlyEquivalent && (
                          <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                            {plan.monthlyEquivalent}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-border my-1" />

                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                            )}
                            <span className={`text-xs sm:text-[13px] leading-snug ${feature.included
                                ? "text-foreground/90 font-medium"
                                : "text-muted-foreground/50 line-through"
                              }`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={plan.disabled || loadingPlan === plan.id}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${plan.disabled
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : plan.popular
                              ? "bg-accent hover:bg-accent-600 text-white shadow-md shadow-accent/20 hover:shadow-lg"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                          }`}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>{t("pricingPage.processing")}</span>
                          </>
                        ) : (
                          plan.buttonText
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-10 px-4 border-t border-border/50 bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
                <Crown className="w-3.5 h-3.5" />
                {locale === "vi" ? "Quyền Lợi Đặc Quyền" : "Exclusive Perks"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {locale === "vi" ? "Tại sao bạn nên nâng cấp gói Premium?" : "Why Upgrade to Premium Membership?"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {locale === "vi"
                  ? "Tiết kiệm tối đa chi phí học tập và sở hữu trọn bộ kiến thức công nghệ thực chiến."
                  : "Maximize your learning value and access complete real-world tech stacks."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "vi" ? "Mở khóa toàn bộ khóa học" : "Unlock All Courses"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "vi"
                    ? "Truy cập không giới hạn mọi bài học, video và tài liệu chuyên sâu mà không cần mua lẻ từng khóa."
                    : "Unlimited access to all lessons, videos, and deep-dive documentation without paying per course."}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "vi" ? "Ngân hàng câu hỏi phỏng vấn" : "Interview Question Bank"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "vi"
                    ? "Ôn tập bộ câu hỏi phỏng vấn thực tế từ Fresher đến Senior có lời giải chi tiết và chuyên sâu."
                    : "Practice real interview questions from Fresher to Senior with comprehensive explanations."}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "vi" ? "Hỗ trợ ưu tiên 1-1" : "1-on-1 Priority Support"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "vi"
                    ? "Được mentor trực tiếp hỗ trợ giải đáp thắc mắc và sửa lỗi code nhanh chóng khi làm dự án."
                    : "Direct mentor assistance for troubleshooting code and answering learning questions."}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "vi" ? "Cập nhật liên tục miễn phí" : "Continuous Free Updates"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "vi"
                    ? "Tự động truy cập mọi khóa học, tài liệu và mã nguồn mới được phát hành trong thời hạn gói."
                    : "Auto access to all newly released courses and source codes throughout your active plan."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                <HelpCircle className="w-3.5 h-3.5" />
                {locale === "vi" ? "Giải Đáp Thắc Mắc" : "FAQ"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {locale === "vi" ? "Câu hỏi thường gặp về gói Premium" : "Frequently Asked Questions"}
              </h2>
            </div>

            <div className="grid gap-3.5">
              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {locale === "vi"
                    ? "Gói Premium khác gì so với việc mua lẻ từng khóa học?"
                    : "How does Premium differ from buying single courses?"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground pl-4 leading-relaxed">
                  {locale === "vi"
                    ? "Khi mua lẻ, bạn chỉ sở hữu một khóa học duy nhất đó. Khi đăng ký gói Premium, bạn được mở khóa TOÀN BỘ tất cả các khóa học & tài liệu chuyên sâu hiện có và mới phát hành trên hệ thống, kèm theo quyền truy cập ngân hàng câu hỏi phỏng vấn và kênh hỗ trợ ưu tiên 1-1 từ mentor."
                    : "Buying a single course grants lifetime access to only that course. A Premium subscription unlocks ALL courses, all advanced documents, interview question banks, and priority 1-on-1 mentor support."}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {locale === "vi"
                    ? "Trong thời gian Premium, tôi có được học các khóa học mới không?"
                    : "Can I access newly released courses during my Premium period?"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground pl-4 leading-relaxed">
                  {locale === "vi"
                    ? "Có! Bạn có toàn quyền truy cập tất cả các khóa học mới, bài giảng cập nhật và tài liệu mới được phát hành trong thời hạn gói Premium của bạn mà không phải trả thêm bất kỳ chi phí nào."
                    : "Yes! You have full access to all newly published courses, updated lectures, and new docs without paying anything extra while your subscription is active."}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {locale === "vi"
                    ? "Hệ thống thanh toán và kích hoạt gói như thế nào?"
                    : "How does payment and plan activation work?"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground pl-4 leading-relaxed">
                  {locale === "vi"
                    ? "Bạn có thể thanh toán tức thì bằng cách quét mã VietQR qua PayOS từ bất kỳ ứng dụng ngân hàng hoặc ví điện tử nào. Gói Premium sẽ được hệ thống tự động kích hoạt ngay lập tức sau khi giao dịch thành công."
                    : "You can pay instantly using VietQR via PayOS from any banking app or e-wallet. Your Premium subscription activates automatically as soon as payment is confirmed."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={t("pricingPage.authModalTitle")}
        message={t("pricingPage.authModalMsg")}
      />

      <RateLimitModal
        isOpen={rateLimitModalOpen}
        onClose={() => setRateLimitModalOpen(false)}
      />

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full border border-gray-100 dark:border-slate-700">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-150 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      {t("pricingPage.paymentModalTitle")}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      {paymentModal.planName}
                    </p>
                  </div>
                </div>
                {!paymentModal.isLoading && (
                  <button
                    data-modal-close
                    onClick={() => setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" })}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                  >
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {paymentModal.isLoading ? (
                <div className="text-center py-8">
                  {/* Animated Payment Icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
                      <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Loading Steps */}
                  <div className="space-y-3 max-w-xs mx-auto">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{t("pricingPage.confirmInfoStep")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{t("pricingPage.creatingPaymentStep")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-left opacity-40">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-slate-500 rounded-full" />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("pricingPage.showQrStep")}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-6">{t("pricingPage.doNotCloseNote")}</p>
                </div>
              ) : paymentModal.data ? (
                <div>
                  {/* Price Info */}
                  <div className="text-center mb-5">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-accent">
                        {formatPrice(paymentModal.data.totalPrice)}đ
                      </span>
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                        {t("pricingPage.pendingPayment")}
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  {paymentModal.data.qrCode && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <QRCodeSVG
                          value={paymentModal.data.qrCode}
                          size={200}
                          level="M"
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t("pricingPage.orderCode")}</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">{paymentModal.data.orderCode}</span>
                  </div>

                  {/* Checkout Button */}
                  {paymentModal.data.checkoutUrl && (
                    <a
                      href={paymentModal.data.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
                    >
                      {t("pricingPage.payWithPayOS")}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Footer Note */}
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{t("pricingPage.securePaymentNote")}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
