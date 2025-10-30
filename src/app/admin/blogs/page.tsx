'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useConfirm } from '@/hooks/useConfirm';
import CreateBlogModal from '@/components/admin/blogs/CreateBlogModal';
import BlogGrid from '@/components/admin/blogs/BlogGrid';
import BlogSuccessToast from '@/components/admin/blogs/BlogSuccessToast';
import BlogPreviewModal from '@/components/admin/blogs/BlogPreviewModal';
import { Blog } from '@/types/blog';
import { blogService } from '@/services/blog.service';
import { formatApiDateOnly } from '@/utils/dateUtils';

interface BlogStats {
    total: number;
    published: number;
    draft: number;
    archived: number;
}

type FilterType = 'day' | 'week' | 'month' | 'year';

export default function BlogsPage() {
    const [filterType, setFilterType] = useState<FilterType>('month');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isDeleting, setIsDeleting] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
    const { confirm } = useConfirm();

    // State cho blogs và pagination
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [stats, setStats] = useState<BlogStats>({
        total: 0,
        published: 0,
        draft: 0,
        archived: 0
    });
    const [pagination, setPagination] = useState({
        page: 1,
        size: 20,
        totalElements: 0,
        totalPages: 0
    });

    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await blogService.getBlogs({
                page: pagination.page,
                titleOrSummary: search || undefined
            });

            setBlogs(response.result);
            setPagination({
                page: response.currentPages,
                size: response.pageSizes,
                totalElements: response.totalElements,
                totalPages: response.totalPages
            });

            const total = response.totalElements;
            const published = response.result.length;
            const draft = 0;
            const archived = 0;

            setStats({ total, published, draft, archived });
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
            setStats({ total: 0, published: 0, draft: 0, archived: 0 });
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, search]);

    const handleFilterChange = (type: FilterType) => {
        setFilterType(type);
        fetchBlogs();
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        fetchBlogs();
    };

    const getFilterLabel = () => {
        const labels = {
            day: 'Hôm nay',
            week: 'Tuần này',
            month: 'Tháng này',
            year: `Năm ${selectedYear}`
        };
        return labels[filterType];
    };

    const getFilteredStats = () => {
        // Mock filtered stats based on filter type
        const multiplier = filterType === 'day' ? 0.1 : filterType === 'week' ? 0.3 : filterType === 'month' ? 0.7 : 1;
        return {
            total: Math.floor(stats.total * multiplier),
            published: Math.floor(stats.published * multiplier),
            draft: Math.floor(stats.draft * multiplier),
            archived: Math.floor(stats.archived * multiplier)
        };
    };

    const handleDelete = async (id: string, title: string) => {
        await confirm(
            async () => {
                setIsDeleting(id);
                try {
                    await blogService.deleteBlog(id);

                    await fetchBlogs();
                } catch (error) {
                    console.error('Error deleting blog:', error);
                } finally {
                    setIsDeleting('');
                }
            },
            {
                title: '📝 Xác nhận xóa bài viết',
                message: `
                    <div style="text-align: center; line-height: 1.5;">
                        <p style="margin-bottom: 8px;">Bạn có chắc chắn muốn xóa bài viết</p>
                        <p style="font-weight: 700; color: #dc2626; font-size: 14px; margin: 8px 0; padding: 6px 12px; background: #fef2f2; border-radius: 6px; display: inline-block; max-width: 280px; word-wrap: break-word;">
                            "${title}"
                        </p>
                        <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                            ⚠️ Hành động này không thể hoàn tác
                        </p>
                    </div>
                `,
                confirmText: '🗑️ Xóa bài viết',
                cancelText: '❌ Hủy bỏ',
                type: 'error'
            }
        );
    };

    useEffect(() => {
        fetchBlogs();
    }, [filterType, selectedYear, search, fetchBlogs]);

    const filteredStats = getFilteredStats();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Blog</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Thống kê và quản lý tất cả bài viết blog trong hệ thống
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo bài viết mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lọc theo thời gian
                            </label>
                            <div className="flex space-x-2">
                                {[
                                    { key: 'day', label: 'Ngày' },
                                    { key: 'week', label: 'Tuần' },
                                    { key: 'month', label: 'Tháng' },
                                    { key: 'year', label: 'Năm' }
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => handleFilterChange(filter.key as FilterType)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${filterType === filter.key
                                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filterType === 'year' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn năm
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(Number(e.target.value))}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            Hiển thị dữ liệu: <span className="font-medium text-gray-900">{getFilterLabel()}</span>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                title="Xem dạng lưới"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'table'
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                title="Xem dạng bảng"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={fetchBlogs}
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredStats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredStats.published}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredStats.draft}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Lưu trữ</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredStats.archived}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 max-w-lg">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="animate-spin h-4 w-4 text-orange-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-orange-700">Đang cập nhật dữ liệu...</span>
                    </div>
                </div>
            )}

            {/* Blog Content */}
            {viewMode === 'grid' ? (
                <BlogGrid
                    blogs={blogs}
                    onEdit={(blog) => {
                        // Handle edit - có thể mở modal edit hoặc navigate
                        console.log('Edit blog:', blog);
                    }}
                    onDelete={handleDelete}
                    onPreview={(blog) => setPreviewBlog(blog)}
                    isDeleting={isDeleting}
                    isLoading={isLoading}
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bài viết
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tác giả
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thống kê
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày xuất bản
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {blog.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">Admin</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Đã xuất bản
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {blog.viewCount}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        {blog.likeCount}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        {blog.commentCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatApiDateOnly(blog.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/blogs/${blog.id}/edit`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id, blog.title)}
                                                    disabled={isDeleting === blog.id}
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    {isDeleting === blog.id ? (
                                                        <>
                                                            <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang xóa...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Xóa
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Blog Modal */}
            <CreateBlogModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchBlogs(); // Refresh the blog list
                    setShowSuccessToast(true);
                }}
            />

            {/* Success Toast */}
            <BlogSuccessToast
                show={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
            />

            {/* Preview Modal */}
            <BlogPreviewModal
                isOpen={!!previewBlog}
                onClose={() => setPreviewBlog(null)}
                blog={previewBlog}
            />
        </div>
    );
}