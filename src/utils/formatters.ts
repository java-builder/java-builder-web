export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export const formatCurrency = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B VND`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M VND`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K VND`;
  }
  return `${num.toLocaleString("vi-VN")} VND`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatPriceInput = (value: string): string => {
  const numValue = parseInt(value.replace(/\D/g, "") || "0");
  return numValue.toLocaleString("vi-VN");
};

export const parsePriceInput = (value: string): number => {
  return parseInt(value.replace(/\D/g, "") || "0");
};

export const formatPercent = (val: number): string => {
  return val % 1 === 0 ? val.toString() : val.toFixed(2);
};

export const formatBytes = (bytes?: number | null, decimals = 2): string => {
  if (bytes === undefined || bytes === null || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
};

