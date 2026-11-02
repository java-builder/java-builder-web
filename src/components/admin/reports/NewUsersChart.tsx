"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import { ChartDataPoint, getChartColors } from "./reportUtils";

interface NewUsersChartProps {
  data: ChartDataPoint[];
  isDark: boolean;
}

export const NewUsersChart = ({ data, isDark }: NewUsersChartProps) => {
  const chartColors = getChartColors(isDark);

  const UserTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card px-4 py-3 shadow-xl rounded-xl border border-border text-foreground">
          <p className="text-sm font-medium text-muted-foreground mb-1">📅 {label}</p>
          <p className="text-lg font-bold text-emerald-500">
            👤 {payload[0].value} người dùng mới
          </p>
        </div>
      );
    }
    return null;
  };

  const totalUsers = data.reduce((sum, d) => sum + d.value, 0);
  const avgUsersPerDay =
    data.length > 0 ? Math.round(totalUsers / data.length) : 0;
  const maxUsers = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
            Người dùng mới
          </h3>
          <p className="text-sm text-muted-foreground mt-1 ml-4">
            Số lượng người dùng đăng ký mới theo ngày
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-[#10b981]"></div>
            <span className="text-xs text-muted-foreground">Người dùng</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-xs text-muted-foreground">Xu hướng</span>
          </div>
        </div>

        <div className="h-64">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="userBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
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
                  allowDecimals={false}
                />
                <Tooltip content={<UserTooltip />} />
                <Bar
                  dataKey="value"
                  name="Người dùng mới"
                  fill="url(#userBarGrad)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  name="Xu hướng"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: "#f59e0b", stroke: "#fff", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 text-muted-foreground/60" />
                <p>Chưa có dữ liệu</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-border">
          <div className="text-center min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Tổng người dùng mới</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-emerald-600 tabular-nums truncate">
              {totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="text-center border-l border-r border-border min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Trung bình/ngày</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-blue-600 tabular-nums truncate">
              {avgUsersPerDay.toLocaleString()}
            </p>
          </div>
          <div className="text-center min-w-0">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-1 truncate">Cao nhất</p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-foreground tabular-nums truncate">
              {maxUsers.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

