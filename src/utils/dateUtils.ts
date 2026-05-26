export const formatApiDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  return dateString;
};

export const formatApiDateOnly = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const parts = dateString.split(" ");
  return parts[0] || dateString;
};

export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  const parts = dateString.split(/[- :]/);
  if (parts.length !== 6) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const hour = parseInt(parts[3], 10);
  const minute = parseInt(parts[4], 10);
  const second = parseInt(parts[5], 10);
  
  return new Date(year, month, day, hour, minute, second);
};

export const parseApiDate = parseDate;

export const formatShortDate = (dateString: string | null | undefined): string => {
  const date = parseDate(dateString);
  if (!date) return "";
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const formatReadableDate = (
  dateString: string | null | undefined,
  locale: string = "vi-VN"
): string => {
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatRelativeTime = (
  dateString: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: (key: any) => string
): string => {
  const date = parseDate(dateString);
  if (!date) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (t) {
    if (diffSeconds < 10) return t("time.justNow");
    if (diffSeconds < 60) return t("time.secondsAgo").replace("{count}", String(diffSeconds));
    if (diffMins < 60) return t("time.minutesAgo").replace("{count}", String(diffMins));
    if (diffHours < 24) return t("time.hoursAgo").replace("{count}", String(diffHours));
    if (diffDays < 7) return t("time.daysAgo").replace("{count}", String(diffDays));
    if (diffWeeks < 4) return t("time.weeksAgo").replace("{count}", String(diffWeeks));
    if (diffMonths < 12) return t("time.monthsAgo").replace("{count}", String(diffMonths));
    return t("time.yearsAgo").replace("{count}", String(diffYears));
  }
  
  if (diffSeconds < 10) return "Vừa xong";
  if (diffSeconds < 60) return `${diffSeconds} giây trước`;
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
};

export const formatLocaleString = (dateString: string | null | undefined, locale: string = "vi-VN"): string => {
  const date = parseDate(dateString);
  return date ? date.toLocaleString(locale) : "";
};

export const formatLocaleStringWithOptions = (
  dateString: string | null | undefined, 
  locale: string = "vi-VN",
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = parseDate(dateString);
  return date ? date.toLocaleString(locale, options) : "";
};
