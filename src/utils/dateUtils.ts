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

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  const date = parseDate(dateString);
  if (!date) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return formatApiDate(dateString);
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
