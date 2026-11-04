"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeOptions } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "default" | "ghost" | "minimal" | "on-dark";
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
    variant === "on-dark"
      ? "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      : variant === "ghost"
        ? "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
        : variant === "minimal"
          ? "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface text-sm font-medium text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
          : "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-surface text-sm font-semibold text-foreground hover:bg-muted/70 transition-all shadow-2xs cursor-pointer";

  return (
    <div className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={triggerClass}>
        <Image
          src={currentLocale.flagUrl}
          alt={currentLocale.flag}
          width={22}
          height={15}
          className="object-cover rounded-xs shadow-2xs shrink-0"
        />
        {showLabel && <span className="hidden sm:inline">{currentLocale.nativeLabel}</span>}
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden z-50">
            <div className="px-3.5 py-2.5 border-b border-border">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Image
                    src={option.flagUrl}
                    alt={option.flag}
                    width={26}
                    height={17}
                    className="object-cover rounded-xs shadow-2xs shrink-0"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold">{option.nativeLabel}</span>
                    <span className="block text-xs text-text-muted">{option.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
