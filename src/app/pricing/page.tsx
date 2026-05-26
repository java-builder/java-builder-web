"use client";

import { useState, useEffect, useMemo } from "react";
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
        { text: t("pricingPage.freeFeature4"), included: true },
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

      const features = plan.features
        ? plan.features.split("|").map((f: string) => ({ text: f.trim(), included: true }))
        : [];

      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: isMonthly 
          ? t("pricingPage.periodMonthly") 
          : isYearly 
            ? t("pricingPage.periodYearly") 
            : t("pricingPage.periodDays").replace("{days}", plan.durationDays.toString()),
        description: plan.description || "",
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-4">
        {/* Hero Section */}
        <section className="pt-8 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-3">
              {t("pricingPage.heroBadge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              {t("pricingPage.heroTitle")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("pricingPage.heroDesc")}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-10 w-10 text-accent" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 transition-all duration-300 ${plan.popular
                      ? "ring-2 ring-accent shadow-xl scale-[1.02]"
                      : "border border-gray-200 dark:border-gray-700 hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-lg"
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                          {t("pricingPage.popularBadge")}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>

                      <div className="flex items-baseline justify-center gap-1">
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-400 dark:text-gray-500 line-through mr-2">
                            {formatPrice(plan.originalPrice)}đ
                          </span>
                        )}
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {plan.price === 0 ? "0" : formatPrice(plan.price)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">đ{plan.period}</span>
                      </div>

                      {plan.monthlyEquivalent && (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                          {plan.monthlyEquivalent}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={plan.disabled || loadingPlan === plan.id}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${plan.disabled
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : plan.popular
                          ? "bg-accent hover:bg-accent-600 text-white shadow-lg shadow-accent/25"
                          : "bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white"
                        }`}
                    >
                      {loadingPlan === plan.id ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t("pricingPage.processing")}
                        </>
                      ) : (
                        plan.buttonText
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <div className="bg-gradient-to-r from-accent to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t("pricingPage.paymentModalTitle")}</h3>
                    <p className="text-white/80 text-sm">{paymentModal.planName}</p>
                  </div>
                </div>
                {!paymentModal.isLoading && (
                  <button
                    data-modal-close
                    onClick={() => setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" })}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
