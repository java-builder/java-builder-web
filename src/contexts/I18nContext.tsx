"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  /** True trong 1s sau khi đổi locale — dùng để hiển thị skeleton trên data UI */
  isSwitching: boolean;
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

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const storedLocale = localStorage.getItem(localeStorageKey);

    if (isLocale(storedLocale) && storedLocale !== initialLocale) {
      setLocaleState(storedLocale);
      try {
        document.cookie = `${localeStorageKey}=${storedLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.error("Failed to write cookie on mount sync:", e);
      }
    } else if (!storedLocale) {
      try {
        localStorage.setItem(localeStorageKey, initialLocale);
        document.cookie = `${localeStorageKey}=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (error) {
        console.error("Failed to initialize locale storage on mount:", error);
      }
    }
  }, [initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState((prev) => {
      if (newLocale === prev) return prev;
      try {
        localStorage.setItem(localeStorageKey, newLocale);
        const verifiedLocale = localStorage.getItem(localeStorageKey);
        if (verifiedLocale !== newLocale) {
          console.warn(`Locale verification failed: expected "${newLocale}" in localStorage but got "${verifiedLocale}"`);
        }
        document.cookie = `${localeStorageKey}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (error) {
        console.error("Failed to save locale synchronously:", error);
      }
      // Bật cờ switching → UI hiện skeleton 1s rồi tắt
      setIsSwitching(true);
      setTimeout(() => setIsSwitching(false), 1000);
      return newLocale;
    });
  }, []);

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
      setLocale,
      t,
      isSwitching,
    };
  }, [locale, isSwitching, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
