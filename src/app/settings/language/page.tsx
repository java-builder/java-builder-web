"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeOptions, Locale } from "@/i18n/config";

export default function LanguagePage() {
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Get description for each language to make it premium
  const getLanguageDesc = (loc: Locale) => {
    switch (loc) {
      case "vi":
        return "Giao diện bằng Tiếng Việt - ngôn ngữ mặc định";
      case "en":
        return "Switch interface to English for global preference";
      case "ja":
        return "日本語に切り替えます - Japanese localized version";
      case "ko":
        return "한국어로 전환합니다 - Korean localized version";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t("common.language") || "Ngôn ngữ"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chọn ngôn ngữ hiển thị trên toàn bộ nền tảng JavaBuilder
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {locales.map((loc) => {
            const option = localeOptions[loc];
            const isSelected = locale === loc;

            return (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 text-left group bg-white dark:bg-slate-800 ${
                  isSelected
                    ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-md shadow-accent/10"
                    : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:shadow-md"
                }`}
              >
                {/* Decorative background gradient */}
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent opacity-5 transition-opacity duration-300 group-hover:opacity-10`}
                />

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-sm">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative flex items-center gap-4">
                  {/* Flag Container */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-700 text-3xl shadow-inner border border-gray-100 dark:border-slate-600 transition-transform duration-300 group-hover:scale-105">
                    {option.flag}
                  </div>

                  <div className="min-w-0 pr-6">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {option.nativeLabel}
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-slate-600">
                        {loc}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-light line-clamp-1">
                      {getLanguageDesc(loc)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                Gợi ý
              </p>
              <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-0.5 leading-relaxed">
                Ngôn ngữ bạn chọn sẽ được lưu vào thiết bị này và tự động áp dụng cho các phiên làm việc tiếp theo. Bạn có thể nhanh chóng đổi lại từ thanh menu bất kỳ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
