export const locales = ["vi", "en", "ja", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localeOptions: Record<Locale, { label: string; nativeLabel: string; flag: string; flagUrl: string }> = {
  vi: { label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "VN", flagUrl: "/languages/vn.png" },
  en: { label: "English", nativeLabel: "English", flag: "US", flagUrl: "/languages/us.png" },
  ja: { label: "Japanese", nativeLabel: "日本語", flag: "JP", flagUrl: "/languages/jp.png" },
  ko: { label: "Korean", nativeLabel: "한국어", flag: "KR", flagUrl: "/languages/kr.png" },
};

export const localeStorageKey = "javabuilder_locale";

export const isLocale = (value: string | null | undefined): value is Locale => {
  return !!value && locales.includes(value as Locale);
};
