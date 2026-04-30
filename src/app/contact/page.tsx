"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import MotionWrapper from "@/components/MotionWrapper";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (_data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus("success");
        
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Error submitting contact form:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full mb-4">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-accent">Liên hệ với chúng tôi</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Chúng tôi luôn sẵn sàng
                <span className="block text-accent mt-2">hỗ trợ bạn</span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Có câu hỏi hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi qua form bên dưới hoặc các kênh liên lạc khác. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <MotionWrapper animation="fadeInUp" delay={0.2}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Gửi tin nhắn cho chúng tôi
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Điền thông tin vào form bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
                    </p>
                  </div>
                  <ContactForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitStatus={submitStatus}
                  />
                </div>
              </MotionWrapper>
            </div>

            {/* Contact Info - 1 column */}
            <div className="lg:col-span-1">
              <MotionWrapper animation="fadeInUp" delay={0.4}>
                <ContactInfo />
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
