'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import ExportButton from '@/components/admin/ExportButton';
import toast from 'react-hot-toast';

// Đăng ký các component Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ReportStats {
    totalRevenue: number;
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    revenueGrowth: number;
    userGrowth: number;
    courseGrowth: number;
    enrollmentGrowth: number;
}

interface RevenueData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
    }[];
}

interface UserData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

interface CourseData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}

export default function ReportsPage() {
    const [timeRange, setTimeRange] = useState('7days');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - thay thế bằng API call thực tế
    const [stats, setStats] = useState<ReportStats>({
        totalRevenue: 125600000,
        totalUsers: 2847,
        totalCourses: 48,
        totalEnrollments: 5234,
        revenueGrowth: 18.5,
        userGrowth: 12.3,
        courseGrowth: 8.7,
        enrollmentGrowth: 25.4
    });

    // Dữ liệu biểu đồ doanh thu
    const [revenueData, setRevenueData] = useState<RevenueData>({
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: [12000000, 15000000, 8000000, 22000000, 18000000, 25000000, 20000000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    });

    // Dữ liệu biểu đồ người dùng mới
    const [userData, setUserData] = useState<UserData>({
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Người dùng mới',
                data: [45, 52, 38, 67, 73, 89, 56],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
        ],
    });

    // Dữ liệu biểu đồ phân bố khóa học
    const [courseData, setCourseData] = useState<CourseData>({
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

    const fetchReports = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));

            const formatNames = {
                pdf: 'PDF',
                excel: 'Excel',
                csv: 'CSV'
            };

            toast.success(`Xuất báo cáo ${formatNames[format]} thành công!`);

            // In thực tế, bạn sẽ gọi API để tạo và tải file
            // const response = await reportApi.export(format, { timeRange, filters });
            // window.open(response.downloadUrl);

        } catch (error) {
            toast.error('Có lỗi xảy ra khi xuất báo cáo');
            console.error('Export error:', error);
        }
    };

    useEffect(() => {
        fetchReports();
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

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
        },
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            📊 Báo cáo & Thống kê
                        </h1>
                        <p className="text-gray-600">
                            Theo dõi hiệu suất và phân tích dữ liệu hệ thống F-Learning
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
                        <ExportButton
                            onExport={handleExport}
                            disabled={isLoading}
                        />
                        <button
                            onClick={fetchReports}
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

            {/* Loading */}
            {isLoading && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-700 font-medium">Đang tải báo cáo...</span>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-sm font-medium text-green-600">+{stats.revenueGrowth}%</span>
                                <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-sm font-medium text-blue-600">+{stats.userGrowth}%</span>
                                <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng khóa học</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-purple-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-sm font-medium text-purple-600">+{stats.courseGrowth}%</span>
                                <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng đăng ký</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments.toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-orange-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-sm font-medium text-orange-600">+{stats.enrollmentGrowth}%</span>
                                <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</h3>
                            <p className="text-sm text-gray-600">Biểu đồ doanh thu trong {timeRange === '7days' ? '7 ngày' : timeRange === '30days' ? '30 ngày' : timeRange === '3months' ? '3 tháng' : timeRange === '6months' ? '6 tháng' : '1 năm'} qua</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={revenueData} options={chartOptions} />
                    </div>
                </div>

                {/* User Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Người dùng mới</h3>
                            <p className="text-sm text-gray-600">Số lượng người dùng đăng ký mới theo ngày</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-80">
                        <Bar data={userData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Course Distribution & Top Courses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Phân bố khóa học</h3>
                            <p className="text-sm text-gray-600">Theo danh mục</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-80">
                        <Doughnut data={courseData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Top Courses */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Khóa học hàng đầu</h3>
                            <p className="text-sm text-gray-600">Theo số lượng đăng ký</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'React & Next.js - Từ Zero đến Hero', students: 1247, revenue: 1618253000, growth: 15.2 },
                            { name: 'Node.js & Express API Development', students: 892, revenue: 1426508000, growth: 12.8 },
                            { name: 'Python for Data Science', students: 756, revenue: 982440000, growth: 8.5 },
                            { name: 'UI/UX Design với Figma', students: 634, revenue: 633366000, growth: 22.1 },
                            { name: 'JavaScript Fundamentals', students: 523, revenue: 679990000, growth: 5.7 }
                        ].map((course, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                                        <p className="text-sm text-gray-600">{course.students.toLocaleString()} học viên</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatPrice(course.revenue)}</p>
                                    <div className="flex items-center text-sm">
                                        <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-green-600 font-medium">+{course.growth}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Report Links */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Báo cáo chi tiết</h3>
                        <p className="text-sm text-gray-600">Truy cập các báo cáo chuyên sâu</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        {
                            name: 'Dashboard Tương tác',
                            description: 'Dashboard báo cáo tổng quan với biểu đồ tương tác',
                            href: '/admin/reports/dashboard',
                            icon: '📈',
                            color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                        },
                        {
                            name: 'Báo cáo Doanh thu',
                            description: 'Phân tích chi tiết doanh thu và bán hàng',
                            href: '/admin/reports/revenue',
                            icon: '💰',
                            color: 'bg-green-50 border-green-200 hover:bg-green-100'
                        },
                        {
                            name: 'Báo cáo Người dùng',
                            description: 'Thống kê và phân tích người dùng',
                            href: '/admin/reports/users',
                            icon: '👥',
                            color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        },
                        {
                            name: 'Báo cáo Khóa học',
                            description: 'Hiệu suất và đánh giá khóa học',
                            href: '/admin/reports/courses',
                            icon: '📚',
                            color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                        },
                        {
                            name: 'Báo cáo Hệ thống',
                            description: 'Tình trạng và hiệu suất hệ thống',
                            href: '/admin/reports/system',
                            icon: '⚙️',
                            color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                        }
                    ].map((report) => (
                        <Link
                            key={report.name}
                            href={report.href}
                            className={`block p-4 border-2 rounded-lg transition-all duration-200 ${report.color}`}
                        >
                            <div className="text-2xl mb-2">{report.icon}</div>
                            <h4 className="font-semibold text-gray-900 mb-1">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.description}</p>
                            <div className="mt-3 flex items-center text-sm font-medium text-gray-700">
                                Xem chi tiết
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activities & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                            <p className="text-sm text-gray-600">Các sự kiện quan trọng trong hệ thống</p>
                        </div>
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { type: 'enrollment', message: '156 học viên mới đăng ký khóa học', time: '5 phút trước', icon: '👥' },
                            { type: 'revenue', message: 'Doanh thu đạt 25M VNĐ trong ngày hôm nay', time: '1 giờ trước', icon: '💰' },
                            { type: 'course', message: 'Khóa học "Advanced React" được xuất bản', time: '2 giờ trước', icon: '📚' },
                            { type: 'user', message: '89 người dùng truy cập đồng thời', time: '3 giờ trước', icon: '🔥' },
                            { type: 'system', message: 'Backup dữ liệu hoàn tất thành công', time: '6 giờ trước', icon: '✅' }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <div className="text-lg">{activity.icon}</div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Tình trạng hệ thống</h3>
                            <p className="text-sm text-gray-600">Hiệu suất và trạng thái các dịch vụ</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'API Server', status: 'healthy', value: '99.9%', color: 'green' },
                            { name: 'Database', status: 'healthy', value: '98.7%', color: 'green' },
                            { name: 'CDN', status: 'healthy', value: '99.5%', color: 'green' },
                            { name: 'Video Streaming', status: 'warning', value: '95.2%', color: 'yellow' },
                            { name: 'Payment Gateway', status: 'healthy', value: '99.8%', color: 'green' }
                        ].map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${service.color === 'green' ? 'bg-green-500' : service.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                    <span className="font-medium text-gray-900">{service.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-900">{service.value}</span>
                                    <p className={`text-xs ${service.color === 'green' ? 'text-green-600' : service.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {service.status === 'healthy' ? 'Hoạt động tốt' : service.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}