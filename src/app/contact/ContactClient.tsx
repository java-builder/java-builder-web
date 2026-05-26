"use client";

import Image from "next/image";
import ContactInfo from "@/components/contact/ContactInfo";
import MotionWrapper from "@/components/MotionWrapper";
import { useI18n } from "@/contexts/I18nContext";

export default function ContactClient() {
  const { t } = useI18n();

  return (
    <>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v-1m0 0c-1.11 0-2.08-.402-2.599-1M12 16c1.11 0 2.08-.402 2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-accent">{t("contactPage.heroBadge")}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {t("contactPage.heroTitle")}
                <span className="block text-accent mt-2">{t("contactPage.heroTitleAccent")}</span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("contactPage.heroDesc")}
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 md:p-8 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("contactPage.qrTitle")}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        {t("contactPage.qrDesc")}
                      </p>
                      <div className="rounded-xl bg-accent/10 dark:bg-accent/20 p-4 text-accent">
                        <p className="font-semibold mb-1">{t("contactPage.thanksTitle")}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t("contactPage.thanksDesc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-700 shadow-inner">
                        <Image
                          src="/donate/qrcode.jpg"
                          alt={t("contactPage.qrAlt")}
                          width={320}
                          height={320}
                          className="w-full max-w-xs rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
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
    </>
  );
}
