export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export const formatCurrency = (num: number): string => {
  if (num >= 1000000000) {
    return `₫${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `₫${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `₫${(num / 1000).toFixed(1)}K`;
  }
  return `₫${num}`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
