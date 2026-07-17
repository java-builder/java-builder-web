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

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  const formats = [
    /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  ];

  if (formats[0].test(dateString)) {
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString("vi-VN");
};

export const formatPercent = (val: number): string => {
  return val % 1 === 0 ? val.toString() : val.toFixed(2);
};
