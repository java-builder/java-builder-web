"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeOptions } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "default" | "ghost" | "minimal";
  showLabel?: boolean;
}

export default function LanguageSwitcher({
  variant = "default",
  showLabel = true,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = localeOptions[locale];

  const triggerClass =
    variant === "ghost"
      ? "inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      : variant === "minimal"
      ? "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
      : "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-accent/40 hover:bg-accent/5 dark:hover:bg-slate-700 transition-all shadow-sm";

  return (
    <div className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={triggerClass}>
        <span className="flex h-6 w-8 items-center justify-center overflow-hidden rounded-sm bg-gray-100 dark:bg-slate-700">
          <Image src={currentLocale.flagUrl} alt={currentLocale.flag} width={24} height={16} className="object-cover rounded-sm" />
        </span>
        {showLabel && <span className="hidden sm:inline">{currentLocale.nativeLabel}</span>}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100 dark:border-slate-800">
            <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
              {t("common.language")}
            </p>
          </div>
          {locales.map((item) => {
            const option = localeOptions[item];
            const isActive = item === locale;

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLocale(item);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <Image src={option.flagUrl} alt={option.flag} width={28} height={20} className="object-cover rounded-sm" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold">{option.nativeLabel}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
