"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

    const handleSubmit = async (formData: {
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
    }) => {
        try {
            setIsSubmitting(true);
      setSubmitStatus("idle");

            // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Contact form submitted:", formData);
      setSubmitStatus("success");
        } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
    <section className="relative min-h-[60vh] bg-gradient-to-r from-white to-blue-100">
                {/* Background with code snippets */}
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full relative overflow-hidden bg-transparent">
                        {/* Code snippets overlay */}
                        <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 text-accent-400 font-mono text-xs">
                                <div>const contact = {`{`}</div>
                <div>
                  &nbsp;&nbsp;email: &quot;support@JavaBuilder.com&quot;,
                </div>
                                <div>&nbsp;&nbsp;phone: &quot;+84 123 456 789&quot;</div>
                                <div>{`}`};</div>
                            </div>
                            <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
                                <div>function help() {`{`}</div>
                                <div>&nbsp;&nbsp;return &quot;24/7 support&quot;;</div>
                                <div>{`}`}</div>
                            </div>
                            <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
                                <div>if (question) {`{`}</div>
                                <div>&nbsp;&nbsp;contactUs();</div>
                                <div>{`}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Content: two-column contact hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
                    <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-gray-900">
                            <div className="lg:col-span-7">
                                <div className="inline-block">
                  <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    Contact & Support
                  </span>
                                </div>

                                <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
                                    Liên hệ <span className="text-accent">hỗ trợ</span> chúng tôi
                                </h1>

                                <p className="mt-4 text-base md:text-lg text-gray-700 max-w-3xl">
                  Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại
                  tin nhắn hoặc liên hệ trực tiếp với đội ngũ chuyên nghiệp của
                  chúng tôi.
                                </p>

                                <div className="mt-6 flex gap-4">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold shadow"
                  >
                    Gửi tin nhắn ngay
                  </a>
                  <a
                    href="tel:0368103455"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Gọi ngay
                  </a>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Hỗ trợ 24/7",
                    "Phản hồi nhanh",
                    "Chuyên nghiệp",
                    "Tận tâm",
                    "Đáng tin cậy",
                  ].map((t) => (
                    <span
                      key={t}
                      className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700"
                    >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                  <Image
                    src="/hero-background.jpg"
                    alt="Contact hero"
                    width={1200}
                    height={420}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[420px] object-cover"
                    priority
                  />
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Contact Form */}
          <MotionWrapper
            animation="fadeInLeft"
            duration={0.6}
            delay={0.2}
            mode="mount"
          >
            <div
              id="contact-form"
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8"
            >
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    Gửi tin nhắn cho chúng tôi
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                  Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi
                  trong thời gian sớm nhất.
                                </p>
                            </div>

                            <ContactForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                submitStatus={submitStatus}
                            />
                        </div>
                    </MotionWrapper>

                    {/* Contact Info & Map */}
          <MotionWrapper
            animation="fadeInRight"
            duration={0.6}
            delay={0.4}
            mode="mount"
          >
                        <div className="space-y-6 sm:space-y-8">
                            {/* Contact Information */}
                            <ContactInfo />
                        </div>
                    </MotionWrapper>
                </div>

                {/* Additional Info */}
        <MotionWrapper
          animation="fadeInUp"
          duration={0.6}
          delay={0.6}
          mode="mount"
        >
                    <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Tại sao chọn chúng tôi?
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
                Chúng tôi cam kết mang đến dịch vụ tốt nhất và hỗ trợ khách hàng
                24/7
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-accent-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                                    </svg>
                                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Hỗ trợ 24/7
                </h4>
                                <p className="text-sm text-gray-600">
                                    Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi
                                </p>
                            </div>

                            <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-accent-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                                    </svg>
                                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Phản hồi nhanh
                </h4>
                                <p className="text-sm text-gray-600">
                                    Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc
                                </p>
                            </div>

                            <div className="text-center sm:col-span-2 md:col-span-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-accent-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                                    </svg>
                                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Chất lượng đảm bảo
                </h4>
                                <p className="text-sm text-gray-600">
                                    Dịch vụ chất lượng cao với đội ngũ chuyên nghiệp
                                </p>
                            </div>
                        </div>
                    </div>
                </MotionWrapper>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
