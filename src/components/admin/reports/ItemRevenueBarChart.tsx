"use client";

import { ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LabelProps,
} from "recharts";
import { ItemRevenue } from "@/types/report";
import { formatPrice, formatYAxis, getChartColors } from "./reportUtils";

interface ItemRevenueBarChartProps {
  title: string;
  subtitle: string;
  items: ItemRevenue[];
  itemUnit: string;
  ownerLabel: string;
  accentGradient: string;
  barColor: string;
  emptyIcon: ReactNode;
  emptyText: string;
  tooltipValueColor: string;
  isDark: boolean;
}

const formatCompactLabel = (val: number): string => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toString();
};

export const ItemRevenueBarChart = ({
  title,
  subtitle,
  items,
  itemUnit,
  ownerLabel,
  accentGradient,
  barColor,
  emptyIcon,
  emptyText,
  tooltipValueColor,
  isDark,
}: ItemRevenueBarChartProps) => {
  const chartColors = getChartColors(isDark);

  const totalRevenue = items.reduce((sum, c) => sum + c.revenue, 0);
  const totalOwners = items.reduce((sum, c) => sum + c.owners, 0);
  const maxRevenue = items.length > 0 ? Math.max(...items.map((c) => c.revenue)) : 0;

  return (
    <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-sm text-foreground flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <span className={`w-1 h-6 rounded-full shrink-0 ${accentGradient}`}></span>
              <span className="truncate">{title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 ml-3 sm:ml-4 truncate">
              {subtitle}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-mono font-medium whitespace-nowrap shrink-0">
            {items.length} {itemUnit}
          </span>
        </div>

        {/* Chart body */}
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            {emptyIcon}
            <p className="text-base font-medium">{emptyText}</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={items.map((item) => {
                  const titleStr = item.title || "";
                  return {
                    name: titleStr.length > 14 ? titleStr.substring(0, 12) + "..." : titleStr,
                    fullName: titleStr,
                    revenue: item.revenue,
                    owners: item.owners,
                  };
                })}
                margin={{ top: 25, right: 15, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartColors.text, fontSize: 10 }}
                  interval="preserveStartEnd"
                  minTickGap={10}
                  height={32}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  tickFormatter={formatYAxis}
                  width={42}
                />
                <Tooltip
                  cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface border border-border rounded-2xl p-3.5 shadow-xl text-foreground w-[220px] space-y-1.5">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                            {data.fullName}
                          </p>
                          <div className="space-y-1.5 pt-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">{ownerLabel}:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-100">
                                {data.owners.toLocaleString()}
                              </span>
                            </div>
                            <div className={`flex justify-between items-center text-sm font-bold ${tooltipValueColor}`}>
                              <span>Doanh thu:</span>
                              <span>{formatPrice(data.revenue)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={38}>
                  <LabelList
                    dataKey="revenue"
                    content={(props: LabelProps) => {
                      const { x, y, width, value } = props;
                      if (x === undefined || y === undefined || width === undefined || value === undefined) return null;
                      const numX = Number(x);
                      const numY = Number(y);
                      const numWidth = Number(width);
                      const numVal = Number(value);
                      if (isNaN(numX) || isNaN(numY) || isNaN(numWidth) || isNaN(numVal)) return null;

                      const formattedVal = formatCompactLabel(numVal);
                      const fontSize = 8.5;
                      const boxHeight = 14;
                      const boxWidth = formattedVal.length * 5.2 + 8;
                      const boxX = numX + numWidth / 2 - boxWidth / 2;
                      const boxY = numY - 17;

                      return (
                        <g>
                          <rect
                            x={boxX}
                            y={boxY}
                            width={boxWidth}
                            height={boxHeight}
                            rx={3}
                            fill={isDark ? "#1e293b" : "#ffffff"}
                            stroke={isDark ? "#334155" : "#e2e8f0"}
                            strokeWidth={1}
                          />
                          <text
                            x={numX + numWidth / 2}
                            y={boxY + 10}
                            fill={isDark ? "#cbd5e1" : "#4b5563"}
                            fontSize={fontSize}
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            {formattedVal}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer statistics */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-border">
          <div className="text-center min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Tổng doanh thu</p>
            <p
              className="text-xs sm:text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-500 tabular-nums truncate"
              title={formatPrice(totalRevenue)}
            >
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="text-center border-l border-border min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">
              Tổng {ownerLabel.toLowerCase()}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-blue-600 dark:text-blue-500 tabular-nums truncate">
              {totalOwners.toLocaleString()}
            </p>
          </div>
          <div className="text-center border-l border-border min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Cao nhất</p>
            <p
              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate"
              title={formatPrice(maxRevenue)}
            >
              {formatPrice(maxRevenue)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
