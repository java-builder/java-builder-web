"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ExportButton from "@/components/admin/ExportButton";
import toast from "react-hot-toast";
import { parseDate } from "@/utils/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface RevenueDetail {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  refunds: number;
}

interface TopCourse {
  id: string;
  name: string;
  revenue: number;
  enrollments: number;
  avgPrice: number;
  growth: number;
}

export default function RevenueReportPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mock data
  const [revenueDetails] = useState<RevenueDetail[]>([
    {
      date: "2024-12-01",
      revenue: 15000000,
      orders: 45,
      avgOrderValue: 333333,
      refunds: 500000,
    },
    {
      date: "2024-12-02",
      revenue: 18000000,
      orders: 52,
      avgOrderValue: 346154,
      refunds: 300000,
    },
    {
      date: "2024-12-03",
      revenue: 12000000,
      orders: 38,
      avgOrderValue: 315789,
      refunds: 200000,
    },
    {
      date: "2024-12-04",
      revenue: 22000000,
      orders: 67,
      avgOrderValue: 328358,
      refunds: 800000,
    },
    {
      date: "2024-12-05",
      revenue: 25000000,
      orders: 78,
      avgOrderValue: 320513,
      refunds: 400000,
    },
  ]);

  const [topCourses] = useState<TopCourse[]>([
    {
      id: "1",
      name: "React & Next.js - Từ Zero đến Hero",
      revenue: 45000000,
      enrollments: 350,
      avgPrice: 1285714,
      growth: 15.2,
    },
    {
      id: "2",
      name: "Node.js & Express API Development",
      revenue: 38000000,
      enrollments: 280,
      avgPrice: 1357143,
      growth: 12.8,
    },
    {
      id: "3",
      name: "Python for Data Science",
      revenue: 32000000,
      enrollments: 245,
      avgPrice: 1306122,
      growth: 8.5,
    },
    {
      id: "4",
      name: "UI/UX Design với Figma",
      revenue: 28000000,
      enrollments: 220,
      avgPrice: 1272727,
      growth: 22.1,
    },
    {
      id: "5",
      name: "JavaScript Fundamentals",
      revenue: 25000000,
      enrollments: 195,
      avgPrice: 1282051,
      growth: 5.7,
    },
  ]);

  const totalRevenue = revenueDetails.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const totalOrders = revenueDetails.reduce(
    (sum, item) => sum + item.orders,
    0,
  );
  const totalRefunds = revenueDetails.reduce(
    (sum, item) => sum + item.refunds,
    0,
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart data
  const revenueChartData = {
    labels: revenueDetails.map((item) => {
      const date = parseDate(item.date);
      return date ? date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" }) : item.date;
    }),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: revenueDetails.map((item) => item.revenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.06)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        borderWidth: 2.5,
      },
      {
        label: "Hoàn tiền (VNĐ)",
        data: revenueDetails.map((item) => item.refunds),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.04)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const ordersChartData = {
    labels: revenueDetails.map((item) => {
      const date = parseDate(item.date);
      return date ? date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" }) : item.date;
    }),
    datasets: [
      {
        label: "Số đơn hàng",
        data: revenueDetails.map((item) => item.orders),
        backgroundColor: "rgba(16, 185, 129, 0.85)",
        hoverBackgroundColor: "rgba(16, 185, 129, 1)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)}B VNĐ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M VNĐ`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const formatNames = { pdf: "PDF", excel: "Excel", csv: "CSV" };
      toast.success(
        `Xuất báo cáo doanh thu ${formatNames[format]} thành công!`,
      );
    } catch {
      toast.error("Có lỗi xảy ra khi xuất báo cáo");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const textColor = isDark ? "#9ca3af" : "#4b5563";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium hover:text-foreground"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                href="/admin/reports"
                className="ml-1 text-sm font-medium hover:text-foreground md:ml-2"
              >
                Báo cáo
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-muted-foreground/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                Báo cáo doanh thu
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-card rounded-xl p-8 border border-border shadow-sm text-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              💰 Báo cáo Doanh thu Chi tiết
            </h1>
            <p className="text-muted-foreground">
              Phân tích chi tiết doanh thu và hiệu suất bán hàng
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm bg-background text-foreground"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
            <ExportButton onExport={handleExport} disabled={isLoading} />
            <Button
              variant="accent"
              onClick={fetchData}
              disabled={isLoading}
              className="gap-2"
            >
              <svg
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-foreground">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tổng đơn hàng
              </p>
              <p className="text-2xl font-bold text-foreground">
                {totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Giá trị đơn hàng TB
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(avgOrderValue)}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tổng hoàn tiền
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatPrice(totalRefunds)}
              </p>
            </div>
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-foreground">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Doanh thu & Hoàn tiền theo thời gian
          </h3>
          <div className="h-80">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Số đơn hàng theo thời gian
          </h3>
          <div className="h-80">
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm text-foreground">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Top khóa học theo doanh thu
          </h3>
          <p className="text-sm text-muted-foreground">
            Các khóa học có doanh thu cao nhất trong kỳ
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Giá TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {topCourses.map((course, index) => (
                <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-500 rounded-full font-bold text-sm mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {course.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-foreground">
                      {formatPrice(course.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {course.enrollments.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {formatPrice(course.avgPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 text-green-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-600">
                        +{course.growth}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
