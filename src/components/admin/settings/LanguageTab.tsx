"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeOptions, Locale } from "@/i18n/config";

export default function LanguageTab() {
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("common.language")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          {t("admin.settings.languageSubtitle")}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locales.map((loc) => {
            const option = localeOptions[loc];
            const isSelected = locale === loc;

            return (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 text-left group bg-white dark:bg-slate-800/50 ${
                  isSelected
                    ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-sm"
                    : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:shadow-sm"
                }`}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent opacity-5 transition-opacity duration-300 group-hover:opacity-10" />

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
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-700 shadow-inner border border-gray-100 dark:border-slate-600 transition-transform duration-300 group-hover:scale-105 overflow-hidden flex-shrink-0">
                    <Image
                      src={option.flagUrl}
                      alt={option.flag}
                      width={40}
                      height={28}
                      className="object-cover rounded-sm"
                    />
                  </div>

                  <div className="min-w-0 pr-6">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {option.nativeLabel}
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-slate-600">
                        {loc}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-light line-clamp-1">
                      {getLanguageDesc(loc)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
