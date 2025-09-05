'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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
    ArcElement,
    RadialLinearScale,
} from 'chart.js';
import DateRangePicker from '@/components/admin/DateRangePicker';
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
    Legend,
    ArcElement,
    RadialLinearScale
);

export default function ReportsDashboard() {
    const [timeRange, setTimeRange] = useState('30days');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const [dashboardData, setDashboardData] = useState({
        kpis: {
            totalRevenue: 125600000,
            totalUsers: 2847,
            totalCourses: 48,
            totalEnrollments: 5234,
            conversionRate: 3.2,
            avgSessionDuration: 1847, // seconds
            bounceRate: 42.5,
            customerSatisfaction: 4.6
        },
        trends: {
            revenue: [12000000, 15000000, 8000000, 22000000, 18000000, 25000000, 20000000],
            users: [45, 52, 38, 67, 73, 89, 56],
            enrollments: [23, 31, 18, 42, 38, 51, 35]
        },
        performance: {
            labels: ['Hiệu suất', 'Chất lượng', 'Hài lòng', 'Tăng trưởng', 'Ổn định'],
            data: [85, 92, 88, 76, 90]
        }
    });

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

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m ${seconds % 60}s`;
    };

    // Chart configurations
    const revenueChartData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: dashboardData.trends.revenue,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const userChartData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Người dùng mới',
                data: dashboardData.trends.users,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
        ],
    };

    const performanceChartData = {
        labels: dashboardData.performance.labels,
        datasets: [
            {
                label: 'Điểm số',
                data: dashboardData.performance.data,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(139, 92, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(139, 92, 246)',
            },
        ],
    };

    const enrollmentChartData = {
        labels: ['Frontend', 'Backend', 'Mobile', 'Design', 'DevOps', 'Data Science'],
        datasets: [
            {
                data: [32, 28, 15, 18, 12, 8],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#06B6D4',
                ],
                borderColor: [
                    '#2563EB',
                    '#059669',
                    '#D97706',
                    '#DC2626',
                    '#7C3AED',
                    '#0891B2',
                ],
                borderWidth: 2,
            },
        ],
    };

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

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
        },
    };

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const formatNames = { pdf: 'PDF', excel: 'Excel', csv: 'CSV' };
            toast.success(`Xuất dashboard ${formatNames[format]} thành công!`);
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

    const tabs = [
        { id: 'overview', name: 'Tổng quan', icon: '📊' },
        { id: 'revenue', name: 'Doanh thu', icon: '💰' },
        { id: 'users', name: 'Người dùng', icon: '👥' },
        { id: 'performance', name: 'Hiệu suất', icon: '⚡' }
    ];

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
                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Dashboard Báo cáo</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            📈 Dashboard Báo cáo Tương tác
                        </h1>
                        <p className="text-gray-600">
                            Phân tích toàn diện và theo dõi hiệu suất hệ thống F-Learning
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <DateRangePicker
                            value={timeRange}
                            onChange={setTimeRange}
                            disabled={isLoading}
                        />
                        <ExportButton onExport={handleExport} disabled={isLoading} />
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isLoading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                            >
                                <span>{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium">Tổng doanh thu</p>
                                            <p className="text-2xl font-bold">{formatPrice(dashboardData.kpis.totalRevenue)}</p>
                                        </div>
                                        <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm font-medium">Tổng người dùng</p>
                                            <p className="text-2xl font-bold">{dashboardData.kpis.totalUsers.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm font-medium">Tổng khóa học</p>
                                            <p className="text-2xl font-bold">{dashboardData.kpis.totalCourses}</p>
                                        </div>
                                        <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm font-medium">Tổng đăng ký</p>
                                            <p className="text-2xl font-bold">{dashboardData.kpis.totalEnrollments.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Tỷ lệ chuyển đổi</p>
                                            <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.conversionRate}%</p>
                                        </div>
                                        <div className="text-green-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Thời gian phiên TB</p>
                                            <p className="text-2xl font-bold text-gray-900">{formatDuration(dashboardData.kpis.avgSessionDuration)}</p>
                                        </div>
                                        <div className="text-blue-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Tỷ lệ thoát</p>
                                            <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.bounceRate}%</p>
                                        </div>
                                        <div className="text-red-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Hài lòng khách hàng</p>
                                            <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis.customerSatisfaction}/5</p>
                                        </div>
                                        <div className="text-yellow-500">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng doanh thu</h3>
                                    <div className="h-80">
                                        <Line data={revenueChartData} options={chartOptions} />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đăng ký theo danh mục</h3>
                                    <div className="h-80">
                                        <Doughnut data={enrollmentChartData} options={doughnutOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'revenue' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo thời gian</h3>
                                <div className="h-96">
                                    <Line data={revenueChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Doanh thu hôm nay</h4>
                                    <p className="text-2xl font-bold text-green-600">{formatPrice(2500000)}</p>
                                    <p className="text-sm text-gray-500 mt-1">+12% so với hôm qua</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Doanh thu tuần này</h4>
                                    <p className="text-2xl font-bold text-blue-600">{formatPrice(18500000)}</p>
                                    <p className="text-sm text-gray-500 mt-1">+8% so với tuần trước</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Doanh thu tháng này</h4>
                                    <p className="text-2xl font-bold text-purple-600">{formatPrice(75200000)}</p>
                                    <p className="text-sm text-gray-500 mt-1">+15% so với tháng trước</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng mới theo ngày</h3>
                                <div className="h-96">
                                    <Bar data={userChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Người dùng hoạt động</h4>
                                    <p className="text-2xl font-bold text-green-600">1,847</p>
                                    <p className="text-sm text-gray-500 mt-1">Trong 24h qua</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Người dùng mới hôm nay</h4>
                                    <p className="text-2xl font-bold text-blue-600">56</p>
                                    <p className="text-sm text-gray-500 mt-1">+23% so với hôm qua</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-2">Tỷ lệ giữ chân</h4>
                                    <p className="text-2xl font-bold text-purple-600">78.5%</p>
                                    <p className="text-sm text-gray-500 mt-1">Trong 30 ngày</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Radar hiệu suất tổng thể</h3>
                                <div className="h-96">
                                    <Radar data={performanceChartData} options={radarOptions} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {dashboardData.performance.labels.map((label, index) => (
                                    <div key={label} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">{label}</h4>
                                        <div className="relative w-16 h-16 mx-auto mb-2">
                                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-gray-200"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="text-blue-500"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${dashboardData.performance.data[index]}, 100`}
                                                    strokeLinecap="round"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {dashboardData.performance.data[index]}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">Điểm số</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}