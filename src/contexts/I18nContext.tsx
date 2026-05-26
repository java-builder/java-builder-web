"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, isLocale, Locale, localeStorageKey } from "@/i18n/config";
import { messages } from "@/i18n/messages";

type TranslationPath<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${TranslationPath<T[K]>}` : K;
    }[keyof T & string]
  : never;

type TranslationKey = TranslationPath<(typeof messages)[typeof defaultLocale]>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const getNestedValue = (source: unknown, path: string): string | undefined => {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = localStorage.getItem(localeStorageKey);

    if (isLocale(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(localeStorageKey, locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: TranslationKey) => {
      return (
        getNestedValue(messages[locale], key) ||
        getNestedValue(messages[defaultLocale], key) ||
        key
      );
    };

    return {
      locale,
      setLocale: setLocaleState,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
