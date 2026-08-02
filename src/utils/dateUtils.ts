import { TranslationKey } from "@/contexts/I18nContext";

export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;

  if (dateString.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const nativeDate = new Date(dateString);
    if (!isNaN(nativeDate.getTime())) {
      return nativeDate;
    }
  }

  const parts = dateString.split(/[- :]/);
  if (parts.length === 6) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parseInt(parts[5], 10);

    const parsed = new Date(year, month, day, hour, minute, second);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date(dateString);
  return isNaN(fallback.getTime()) ? null : fallback;
};

export const formatDate = (
  dateString: string | null | undefined,
  locale?: string
): string => {
  const date = parseDate(dateString);
  if (!date) return dateString || "";

  if (locale) {
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTime = (
  dateString: string | null | undefined,
  locale: string = "vi-VN"
): string => {
  const date = parseDate(dateString);
  if (!date) return "-";

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (
  dateString: string | null | undefined,
  t?: (key: TranslationKey) => string
): string => {
  const date = parseDate(dateString);
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (t) {
    if (diffSeconds < 10) return t("time.justNow");
    if (diffSeconds < 60) return t("time.secondsAgo").replace("{count}", String(diffSeconds));
    if (diffMins < 60) return t("time.minutesAgo").replace("{count}", String(diffMins));
    if (diffHours < 24) return t("time.hoursAgo").replace("{count}", String(diffHours));
    if (diffDays < 30) return t("time.daysAgo").replace("{count}", String(diffDays));
    if (diffMonths < 12) return t("time.monthsAgo").replace("{count}", String(diffMonths));
    return t("time.yearsAgo").replace("{count}", String(diffYears));
  }

  if (diffSeconds < 10) return "Vừa xong";
  if (diffSeconds < 60) return `${diffSeconds} giây trước`;
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
};

export const parseApiDate = parseDate;
export const formatShortDate = formatDate;
export const formatReadableDate = formatDate;
export const formatReadableDateTime = formatDateTime;
export const formatLocaleString = formatDateTime;
export const formatApiDate = (dateString: string | null | undefined): string => dateString || "";
export const formatApiDateOnly = (dateString: string | null | undefined): string => dateString?.split(" ")[0] || "";
