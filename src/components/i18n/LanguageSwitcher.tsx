"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeOptions } from "@/i18n/config";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentLocale = localeOptions[locale];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;

      setMenuPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const languageMenu = isOpen && mounted ? createPortal(
    <div
      className="fixed w-72 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 overflow-hidden z-[9999]"
      style={{ top: menuPosition.top, right: menuPosition.right }}
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          {t("common.language")}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
          {currentLocale.nativeLabel}
        </p>
      </div>
      <div className="p-2">
        {locales.map((item) => {
          const option = localeOptions[item];
          const active = item === locale;

          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setLocale(item);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                active
                  ? "bg-accent/10 text-accent ring-1 ring-accent/20"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold">
                {item.toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold">{option.nativeLabel}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{option.label}</span>
              </span>
              {active && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:border-accent/40 hover:bg-accent/5 dark:hover:bg-slate-700 transition-all shadow-sm"
        aria-label={t("common.language")}
        aria-expanded={isOpen}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
          {locale.toUpperCase()}
        </span>
        <span className="hidden sm:inline">{currentLocale.nativeLabel}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {languageMenu}
    </div>
  );
}
