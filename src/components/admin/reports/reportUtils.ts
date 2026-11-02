export interface ChartDataPoint {
  name: string;
  value: number;
  avg?: number;
  trend?: number;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatYAxis = (value: number): string => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
};

export const getChartColors = (isDark: boolean) => ({
  text: isDark ? "#9ca3af" : "#6b7280",
  grid: isDark ? "#374151" : "#e5e7eb",
  tooltipBg: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
  tooltipBorder: isDark ? "#4b5563" : "#e5e7eb",
  tooltipText: isDark ? "#fff" : "#111827",
});

