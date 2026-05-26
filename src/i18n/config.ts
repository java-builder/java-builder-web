export const locales = ["vi", "en", "ja", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localeOptions: Record<Locale, { label: string; nativeLabel: string; flag: string }> = {
  vi: { label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  en: { label: "English", nativeLabel: "English", flag: "🇺🇸" },
  ja: { label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  ko: { label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
};

export const localeStorageKey = "javabuilder_locale";

export const isLocale = (value: string | null | undefined): value is Locale => {
  return !!value && locales.includes(value as Locale);
};
