'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConfirm } from '@/hooks/useConfirm';

interface CourseStats {
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalStudents: number;
    totalRevenue: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    price: number;
    originalPrice?: number;
    duration: string;
    lessons: number;
    students: number;
    rating: number;
    reviews: number;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return {
                    color: 'bg-green-100 text-green-800',
                    text: 'Đã xuất bản'
                };
            case 'DRAFT':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    text: 'Bản nháp'
                };
            case 'ARCHIVED':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    text: 'Lưu trữ'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    text: status
                };
        }
    };

    const config = getStatusConfig(status);
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

const LevelBadge = ({ level }: { level: string }) => {
    const getLevelConfig = (level: string) => {
        switch (level) {
            case 'BEGINNER':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    text: 'Cơ bản'
                };
            case 'INTERMEDIATE':
                return {
                    color: 'bg-orange-100 text-orange-800',
                    text: 'Trung cấp'
                };
            case 'ADVANCED':
                return {
                    color: 'bg-purple-100 text-purple-800',
                    text: 'Nâng cao'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    text: level
                };
        }
    };

    const config = getLevelConfig(level);
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

export default function CoursesPage() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string>('');
    const { confirm } = useConfirm();

    // Mock data - thay thế bằng API call thực tế
    const [stats, setStats] = useState<CourseStats>({
        total: 48,
        published: 32,
        draft: 12,
        archived: 4,
        totalStudents: 2847,
        totalRevenue: 125600000
    });

    const [courses, setCourses] = useState<Course[]>([
        {
            id: '1',
            title: 'React & Next.js - Từ Zero đến Hero',
            description: 'Khóa học toàn diện về React và Next.js với các dự án thực tế',
            instructor: 'Nguyễn Văn A',
            category: 'Frontend Development',
            level: 'INTERMEDIATE',
            status: 'PUBLISHED',
            price: 1299000,
            originalPrice: 1999000,
            duration: '24 giờ',
            lessons: 156,
            students: 1247,
            rating: 4.8,
            reviews: 324,
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-12-10T14:20:00Z'
        },
        {
            id: '2',
            title: 'Node.js & Express API Development',
            description: 'Xây dựng RESTful API chuyên nghiệp với Node.js và Express',
            instructor: 'Trần Thị B',
            category: 'Backend Development',
            level: 'ADVANCED',
            status: 'PUBLISHED',
            price: 1599000,
            originalPrice: 2299000,
            duration: '32 giờ',
            lessons: 198,
            students: 892,
            rating: 4.9,
            reviews: 267,
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-02-20T09:15:00Z',
            updatedAt: '2024-12-08T16:45:00Z'
        },
        {
            id: '3',
            title: 'UI/UX Design với Figma',
            description: 'Thiết kế giao diện người dùng chuyên nghiệp từ cơ bản đến nâng cao',
            instructor: 'Lê Văn C',
            category: 'Design',
            level: 'BEGINNER',
            status: 'DRAFT',
            price: 999000,
            duration: '18 giờ',
            lessons: 89,
            students: 0,
            rating: 0,
            reviews: 0,
            thumbnail: '/api/placeholder/300/200',
            createdAt: '2024-11-01T14:30:00Z',
            updatedAt: '2024-12-15T10:20:00Z'
        }
    ]);

    const categories = ['Frontend Development', 'Backend Development', 'Mobile Development', 'Design', 'DevOps', 'Data Science'];

    const fetchCourses = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handleDelete = async (id: string, title: string) => {
        await confirm(
            async () => {
                setIsDeleting(id);
                try {
                    // Replace with actual API call
                    // await courseApi.delete(id);
                    console.log('✅ Delete Course Success');

                    // Remove from local state for demo
                    setCourses(courses.filter(course => course.id !== id));
                } finally {
                    setIsDeleting('');
                }
            },
            {
                title: '🎓 Xác nhận xóa khóa học',
                message: `
                    <div style="text-align: center; line-height: 1.5;">
                        <p style="margin-bottom: 8px;">Bạn có chắc chắn muốn xóa khóa học</p>
                        <p style="font-weight: 700; color: #dc2626; font-size: 14px; margin: 8px 0; padding: 6px 12px; background: #fef2f2; border-radius: 6px; display: inline-block; max-width: 280px; word-wrap: break-word;">
                            "${title}"
                        </p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                            ⚠️ Hành động này sẽ ảnh hưởng đến tất cả học viên đã đăng ký
                        </p>
                    </div>
                `,
                confirmText: '🗑️ Xóa khóa học',
                cancelText: '❌ Hủy bỏ',
                type: 'error'
            }
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatRevenue = (revenue: number) => {
        if (revenue >= 1000000000) {
            return `${(revenue / 1000000000).toFixed(1)}B VNĐ`;
        } else if (revenue >= 1000000) {
            return `${(revenue / 1000000).toFixed(1)}M VNĐ`;
        }
        return formatPrice(revenue);
    };

    useEffect(() => {
        fetchCourses();
    }, [search, categoryFilter, statusFilter, levelFilter]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Quản lý Khóa học
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi tất cả khóa học trong hệ thống F-Learning
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/admin/courses/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo khóa học mới
                        </Link>
                        <button
                            onClick={fetchCourses}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng khóa học</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Đã xuất bản</p>
                            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Bản nháp</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Lưu trữ</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Học viên</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalStudents.toLocaleString()}</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">{formatRevenue(stats.totalRevenue)}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="PUBLISHED">Đã xuất bản</option>
                            <option value="DRAFT">Bản nháp</option>
                            <option value="ARCHIVED">Lưu trữ</option>
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                        >
                            <option value="all">Tất cả cấp độ</option>
                            <option value="BEGINNER">Cơ bản</option>
                            <option value="INTERMEDIATE">Trung cấp</option>
                            <option value="ADVANCED">Nâng cao</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-indigo-700 font-medium">Đang tải khóa học...</span>
                    </div>
                </div>
            )}

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute top-4 left-4 flex gap-2">
                                <StatusBadge status={course.status} />
                                <LevelBadge level={course.level} />
                            </div>
                            <div className="absolute top-4 right-4">
                                {course.originalPrice && (
                                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                        -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                                    {course.title}
                                </h3>
                                <p className="text-gray-200 text-sm">
                                    {course.instructor}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    {course.category}
                                </span>
                                <div className="flex items-center text-yellow-500">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">
                                        {course.rating > 0 ? course.rating : 'N/A'}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({course.reviews})
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {course.description}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="text-gray-600 text-xs font-medium">Thời lượng</div>
                                    <div className="text-gray-900 font-bold text-sm">{course.duration}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="text-gray-600 text-xs font-medium">Bài học</div>
                                    <div className="text-gray-900 font-bold text-sm">{course.lessons}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="text-gray-600 text-xs font-medium">Học viên</div>
                                    <div className="text-gray-900 font-bold text-sm">{course.students.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {formatPrice(course.price)}
                                    </span>
                                    {course.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatPrice(course.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/courses/${course.id}/edit`}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Chỉnh sửa
                                </Link>
                                <button
                                    onClick={() => handleDelete(course.id, course.title)}
                                    disabled={isDeleting === course.id}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isDeleting === course.id ? (
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {courses.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
                    <p className="text-gray-500 mb-6">Bắt đầu tạo khóa học đầu tiên của bạn</p>
                    <Link
                        href="/admin/courses/new"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                        Tạo khóa học mới
                    </Link>
                </div>
            )}
        </div>
    );
}