"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartDataPoint, formatPrice, formatYAxis, getChartColors } from "./reportUtils";

interface RevenueOverTimeChartProps {
  data: ChartDataPoint[];
  timeRange: string;
  isDark: boolean;
}

const getTimeRangeLabel = (timeRange: string) => {
  switch (timeRange) {
    case "7days":
      return "7 ngày";
    case "30days":
      return "30 ngày";
    case "3months":
      return "3 tháng";
    case "6months":
      return "6 tháng";
    case "1year":
      return "1 năm";
    default:
      return timeRange;
  }
};

export const RevenueOverTimeChart = ({
  data,
  timeRange,
  isDark,
}: RevenueOverTimeChartProps) => {
  const chartColors = getChartColors(isDark);

  const RevenueTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const revenueData = payload.find((p) => p.dataKey === "value");
      const avgData = payload.find((p) => p.dataKey === "avg");
      return (
        <div className="bg-card px-4 py-3 shadow-xl rounded-xl border border-border text-foreground">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          {revenueData && (
            <p className="text-base font-bold text-blue-500 mb-1">
              Doanh thu: {formatPrice(revenueData.value)}
            </p>
          )}
          {avgData && (
            <p className="text-sm text-muted-foreground">
              Trung bình: {formatPrice(avgData.value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);
  const avgRevenue = data[0]?.avg || 0;
  const maxRevenue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
            Doanh thu theo thời gian
          </h3>
          <p className="text-sm text-muted-foreground mt-1 ml-4">
            Biểu đồ doanh thu trong {getTimeRangeLabel(timeRange)} qua
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs text-muted-foreground">Doanh thu</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-xs text-muted-foreground">Trung bình</span>
          </div>
        </div>

        <div className="h-64">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="avg"
                  name="Trung bình"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#avgGrad)"
                  dot={false}
                  activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={{ fill: "#3b82f6", stroke: "#fff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground/60" />
                <p>Chưa có dữ liệu</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-border">
          <div className="text-center min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Tổng doanh thu</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-green-500 tabular-nums truncate" title={formatPrice(totalRevenue)}>
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="text-center border-l border-r border-border min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Trung bình/kỳ</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-blue-600 tabular-nums truncate" title={formatPrice(avgRevenue)}>
              {formatPrice(avgRevenue)}
            </p>
          </div>
          <div className="text-center min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Cao nhất</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-foreground tabular-nums truncate" title={formatPrice(maxRevenue)}>
              {formatPrice(maxRevenue)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

