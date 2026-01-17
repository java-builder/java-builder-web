"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { subscriptionApi } from "@/services/subscription.service";
import { SubscriptionPlan, SubscribeResponse } from "@/types/subscription";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

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

const freePlan: PlanDisplay = {
  id: "free",
  name: "Miễn phí",
  price: 0,
  period: "",
  description: "Bắt đầu hành trình học Java",
  features: [
    { text: "Truy cập khóa học miễn phí", included: true },
    { text: "Đọc blog & bài viết", included: true },
    { text: "Tài liệu công khai", included: true },
    { text: "Tài liệu Premium (Ebooks)", included: true },
  ],
  buttonText: "Đang sử dụng",
  popular: false,
  disabled: true,
  apiPlanId: null,
};

const faqs = [
  {
    q: "Premium có gì khác so với miễn phí?",
    a: "Premium cho phép bạn truy cập toàn bộ khóa học, tài liệu Ebooks chất lượng cao, badge đặc biệt và hỗ trợ ưu tiên.",
  },
  {
    q: "Tôi có thể hủy subscription bất cứ lúc nào không?",
    a: "Có, bạn có thể hủy bất cứ lúc nào. Bạn vẫn được sử dụng Premium đến hết thời hạn đã thanh toán.",
  },
  {
    q: "Thanh toán bằng phương thức nào?",
    a: "Chúng tôi hỗ trợ thanh toán qua QR Code ngân hàng, ví điện tử thông qua PayOS.",
  },
  {
    q: "Có được hoàn tiền không?",
    a: "Chúng tôi hỗ trợ hoàn tiền trong vòng 7 ngày đầu nếu bạn không hài lòng với dịch vụ.",
  },
];

export default function PricingPage() {
  const { data: currentUser } = useCurrentUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanDisplay[]>([freePlan]);
  const [isLoading, setIsLoading] = useState(true);

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
        period: isMonthly ? "/tháng" : isYearly ? "/năm" : `/${plan.durationDays} ngày`,
        description: plan.description || "",
        features,
        buttonText: "Đăng ký ngay",
        popular: isMonthly,
        disabled: false,
        apiPlanId: plan.id,
        originalPrice: isYearly ? 499000 * 12 : undefined,
        monthlyEquivalent: isYearly ? `≈ ${new Intl.NumberFormat("vi-VN").format(Math.round(plan.price / 12))}đ/tháng` : undefined,
      };
    };

    const fetchPlans = async () => {
      try {
        const response = await subscriptionApi.getPlans();
        if (response.result) {
          const apiPlans = response.result.map((plan: SubscriptionPlan) => convertToPlanDisplay(plan));
          apiPlans.sort((a, b) => a.price - b.price);
          setPlans([freePlan, ...apiPlans]);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

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
      const response = await subscriptionApi.subscribe(plan.apiPlanId);

      if (response.result) {
        setPaymentModal({
          isOpen: true,
          isLoading: false,
          data: response.result,
          planName: plan.name,
        });
      } else {
        toast.error("Không thể tạo link thanh toán");
        setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" });
      }
      setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đăng ký thất bại");
      setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const monthlyPlan = plans.find((p) => p.popular && p.apiPlanId);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-4">
        {/* Hero Section */}
        <section className="pt-2 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-3">
              ✨ Premium Membership
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Nâng cấp trải nghiệm học tập
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Truy cập toàn bộ tài liệu Premium, nhận hỗ trợ ưu tiên và nhiều quyền lợi đặc biệt khác
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
                    className={`relative bg-white rounded-2xl p-6 lg:p-8 transition-all duration-300 ${plan.popular
                      ? "ring-2 ring-accent shadow-xl scale-[1.02]"
                      : "border border-gray-200 hover:border-accent/50 hover:shadow-lg"
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                          Phổ biến nhất
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                      <div className="flex items-baseline justify-center gap-1">
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-400 line-through mr-2">
                            {formatPrice(plan.originalPrice)}đ
                          </span>
                        )}
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price === 0 ? "0" : formatPrice(plan.price)}
                        </span>
                        <span className="text-gray-500">đ{plan.period}</span>
                      </div>

                      {plan.monthlyEquivalent && (
                        <p className="text-sm text-green-600 font-medium mt-2">
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
                          <span className="text-gray-700">{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={plan.disabled || loadingPlan === plan.id}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${plan.disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : plan.popular
                          ? "bg-accent hover:bg-accent-600 text-white shadow-lg shadow-accent/25"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                    >
                      {loadingPlan === plan.id ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Đang xử lý...
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

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Quyền lợi Premium Member
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📚", title: "Tài liệu Premium", desc: "Truy cập 50+ Ebooks, cheatsheets chất lượng cao" },
                { icon: "🏆", title: "Badge đặc biệt", desc: "Hiển thị badge Premium trên profile của bạn" },
                { icon: "💬", title: "Hỗ trợ ưu tiên", desc: "Được hỗ trợ nhanh chóng qua chat riêng" },
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 text-center">
                  <span className="text-4xl mb-4 block">{benefit.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-accent to-blue-600 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Sẵn sàng nâng cấp?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Tham gia cùng hàng nghìn học viên Premium đang phát triển sự nghiệp Backend Developer
            </p>
            <button
              onClick={() => monthlyPlan && handleSubscribe(monthlyPlan)}
              disabled={!monthlyPlan || loadingPlan === monthlyPlan?.id}
              className="bg-white text-accent font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              {loadingPlan === monthlyPlan?.id ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Bắt đầu với Premium Tháng"
              )}
            </button>
          </div>
        </section>
      </main>
      <Footer />

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Đăng nhập để đăng ký Premium"
        message="Bạn cần đăng nhập để đăng ký gói Premium."
      />

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => !paymentModal.isLoading && setPaymentModal({ isOpen: false, isLoading: false, data: null, planName: "" })}
            />

            <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full">
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
                      <h3 className="text-lg font-bold text-white">Thanh toán</h3>
                      <p className="text-white/80 text-sm">{paymentModal.planName}</p>
                    </div>
                  </div>
                  {!paymentModal.isLoading && (
                    <button
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
                        <span className="text-sm text-gray-600">Xác nhận thông tin gói</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">Đang tạo mã thanh toán...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left opacity-40">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        </div>
                        <span className="text-sm text-gray-500">Hiển thị QR Code</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs mt-6">Vui lòng không đóng cửa sổ này</p>
                  </div>
                ) : paymentModal.data ? (
                  <div>
                    {/* Price Info */}
                    <div className="text-center mb-5">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-accent">
                          {formatPrice(paymentModal.data.totalPrice)}đ
                        </span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          Chờ thanh toán
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
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
                      <span className="text-sm text-gray-500">Mã đơn hàng</span>
                      <span className="font-mono font-semibold text-gray-900">{paymentModal.data.orderCode}</span>
                    </div>

                    {/* Checkout Button */}
                    {paymentModal.data.checkoutUrl && (
                      <a
                        href={paymentModal.data.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-xl transition-colors"
                      >
                        Thanh toán qua PayOS
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {/* Footer Note */}
                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Thanh toán được bảo mật bởi PayOS. Premium sẽ được kích hoạt tự động sau khi thanh toán thành công.</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
