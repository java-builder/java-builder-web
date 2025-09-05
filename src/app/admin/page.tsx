'use client';

import Link from 'next/link';

const stats = [
    {
        name: 'Tổng người dùng',
        value: '1,234',
        change: '+12%',
        changeType: 'increase',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
    {
        name: 'Khóa học hoạt động',
        value: '89',
        change: '+5%',
        changeType: 'increase',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
    {
        name: 'Doanh thu tháng này',
        value: '₫45.2M',
        change: '+18%',
        changeType: 'increase',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        name: 'Học viên mới',
        value: '156',
        change: '+8%',
        changeType: 'increase',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
    },
];

const quickActions = [
    {
        name: 'Thêm người dùng mới',
        description: 'Tạo tài khoản cho học viên hoặc giảng viên',
        href: '/admin/users/new',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
        color: 'bg-blue-500',
    },
    {
        name: 'Tạo khóa học',
        description: 'Thêm khóa học mới vào hệ thống',
        href: '/admin/courses/new',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        color: 'bg-green-500',
    },
    {
        name: 'Xem báo cáo',
        description: 'Phân tích dữ liệu và thống kê',
        href: '/admin/reports',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: 'bg-purple-500',
    },
    {
        name: 'Cài đặt hệ thống',
        description: 'Quản lý cấu hình và thiết lập',
        href: '/admin/settings',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'bg-orange-500',
    },
];

const recentActivities = [
    {
        id: 1,
        user: 'Nguyễn Văn A',
        action: 'đã đăng ký khóa học',
        target: 'React Fundamentals',
        time: '2 phút trước',
        avatar: 'A',
    },
    {
        id: 2,
        user: 'Trần Thị B',
        action: 'đã hoàn thành bài học',
        target: 'JavaScript Basics - Lesson 5',
        time: '15 phút trước',
        avatar: 'B',
    },
    {
        id: 3,
        user: 'Lê Văn C',
        action: 'đã tạo khóa học mới',
        target: 'Advanced Node.js',
        time: '1 giờ trước',
        avatar: 'C',
    },
    {
        id: 4,
        user: 'Phạm Thị D',
        action: 'đã đánh giá khóa học',
        target: 'Python for Beginners',
        time: '2 giờ trước',
        avatar: 'D',
    },
];

export default function AdminDashboard() {
    return (
        <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Chào mừng trở lại!</h1>
                <p className="mt-2 text-gray-600">
                    Đây là tổng quan về hoạt động của hệ thống F Learning hôm nay.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <div className="text-blue-600">{stat.icon}</div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <div className="flex items-baseline">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className={`ml-2 text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
                            <p className="text-sm text-gray-600">Các tác vụ thường dùng trong hệ thống</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.name}
                                        href={action.href}
                                        className="group relative bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg ${action.color} text-white`}>
                                                {action.icon}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                                    {action.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                            <p className="text-sm text-gray-600">Các sự kiện mới nhất trong hệ thống</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-white">
                                                    {activity.avatar}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">{activity.user}</span>{' '}
                                                {activity.action}{' '}
                                                <span className="font-medium">{activity.target}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Link
                                    href="/admin/activities"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Xem tất cả hoạt động →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}