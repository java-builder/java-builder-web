'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';
import ExportButton from '@/components/admin/ExportButton';
import toast from 'react-hot-toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
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
    const [timeRange, setTimeRange] = useState('30days');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data
    const [revenueDetails, setRevenueDetails] = useState<RevenueDetail[]>([
        { date: '2024-12-01', revenue: 15000000, orders: 45, avgOrderValue: 333333, refunds: 500000 },
        { date: '2024-12-02', revenue: 18000000, orders: 52, avgOrderValue: 346154, refunds: 300000 },
        { date: '2024-12-03', revenue: 12000000, orders: 38, avgOrderValue: 315789, refunds: 200000 },
        { date: '2024-12-04', revenue: 22000000, orders: 67, avgOrderValue: 328358, refunds: 800000 },
        { date: '2024-12-05', revenue: 25000000, orders: 78, avgOrderValue: 320513, refunds: 400000 },
    ]);

    const [topCourses, setTopCourses] = useState<TopCourse[]>([
        { id: '1', name: 'React & Next.js - Từ Zero đến Hero', revenue: 45000000, enrollments: 350, avgPrice: 1285714, growth: 15.2 },
        { id: '2', name: 'Node.js & Express API Development', revenue: 38000000, enrollments: 280, avgPrice: 1357143, growth: 12.8 },
        { id: '3', name: 'Python for Data Science', revenue: 32000000, enrollments: 245, avgPrice: 1306122, growth: 8.5 },
        { id: '4', name: 'UI/UX Design với Figma', revenue: 28000000, enrollments: 220, avgPrice: 1272727, growth: 22.1 },
        { id: '5', name: 'JavaScript Fundamentals', revenue: 25000000, enrollments: 195, avgPrice: 1282051, growth: 5.7 },
    ]);

    const totalRevenue = revenueDetails.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = revenueDetails.reduce((sum, item) => sum + item.orders, 0);
    const totalRefunds = revenueDetails.reduce((sum, item) => sum + item.refunds, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Chart data
    const revenueChartData = {
        labels: revenueDetails.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: revenueDetails.map(item => item.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Hoàn tiền (VNĐ)',
                data: revenueDetails.map(item => item.refunds),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const ordersChartData = {
        labels: revenueDetails.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
        datasets: [
            {
                label: 'Số đơn hàng',
                data: revenueDetails.map(item => item.orders),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
        ],
    };

    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)}B VNĐ`;
        } else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M VNĐ`;
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const formatNames = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };
            toast.success(`Xuất báo cáo doanh thu ${formatNames[format]} thành công!`);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xuất báo cáo');
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link href="/admin/reports" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                                Báo cáo
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Báo cáo doanh thu</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            💰 Báo cáo Doanh thu Chi tiết
                        </h1>
                        <p className="text-gray-600">
                            Phân tích chi tiết doanh thu và hiệu suất bán hàng
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="7days">7 ngày qua</option>
                            <option value="30days">30 ngày qua</option>
                            <option value="3months">3 tháng qua</option>
                            <option value="6months">6 tháng qua</option>
                            <option value="1year">1 năm qua</option>
                        </select>
                        <ExportButton onExport={handleExport} disabled={isLoading} />
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Giá trị đơn hàng TB</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(avgOrderValue)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng hoàn tiền</p>
                            <p className="text-2xl font-bold text-red-600">{formatPrice(totalRefunds)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Doanh thu & Hoàn tiền theo thời gian</h3>
                    <div className="h-80">
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Số đơn hàng theo thời gian</h3>
                    <div className="h-80">
                        <Bar data={ordersChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Top Courses Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Top khóa học theo doanh thu</h3>
                    <p className="text-sm text-gray-600">Các khóa học có doanh thu cao nhất trong kỳ</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khóa học
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng ký
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá TB
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tăng trưởng
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topCourses.map((course, index) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm mr-3">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{formatPrice(course.revenue)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{course.enrollments.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatPrice(course.avgPrice)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            <span className="text-sm font-medium text-green-600">+{course.growth}%</span>
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