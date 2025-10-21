'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import MotionWrapper from '@/components/MotionWrapper';
import { courseApi } from '@/services/course.service';
import { CourseDetailResponse, CourseLevel } from '@/types/course';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params?.id as string;

    const [course, setCourse] = useState<CourseDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'description' | 'comments' | 'curriculum' | 'instructor'>('description');

    const fetchCourseDetail = useCallback(async () => {
        if (!courseId) return;

        try {
            setIsLoading(true);
            setError('');
            const result = await courseApi.getById(courseId);
            if (result.code === 200 && result.result) {
                setCourse(result.result);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseDetail();
    }, [courseId, fetchCourseDetail]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        try {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('-');
            const [hour, minute, second] = timePart.split(':');

            const date = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hour),
                parseInt(minute),
                parseInt(second)
            );

            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getLevelText = (level: CourseLevel) => {
        switch (level) {
            case CourseLevel.BEGINNER:
                return 'Cơ bản';
            case CourseLevel.INTERMEDIATE:
                return 'Trung cấp';
            case CourseLevel.ADVANCED:
                return 'Nâng cao';
            default:
                return level;
        }
    };

    const getLevelColor = (level: CourseLevel) => {
        switch (level) {
            case CourseLevel.BEGINNER:
                return 'bg-orange-100 text-orange-800';
            case CourseLevel.INTERMEDIATE:
                return 'bg-orange-100 text-orange-800';
            case CourseLevel.ADVANCED:
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="text-red-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
                        <p className="text-gray-600 mb-6">{error || 'Khóa học không tồn tại hoặc đã bị xóa.'}</p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300"
                        >
                            Quay lại danh sách khóa học
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">
                            Trang chủ
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/courses" className="text-gray-500 hover:text-orange-500 transition-colors">
                            Khóa học
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium">{course.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <MotionWrapper animation="fadeInUp" duration={0.6}>
                            <div className="bg-white rounded-xl overflow-hidden">
                                {/* Course Cover */}
                                <div className="relative h-64 md:h-80 overflow-hidden">
                                    {course.courseCover ? (
                                        <Image
                                            src={course.courseCover}
                                            alt={course.title}
                                            width={800}
                                            height={320}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <p className="text-lg font-medium">Khóa học</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20"></div>
                                </div>

                                {/* Course Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex-1">
                                            <h1 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h1>

                                            <div className="flex items-center space-x-3 mb-4">
                                                {course.level && (
                                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}>
                                                        {getLevelText(course.level)}
                                                    </span>
                                                )}
                                                {course.duration && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                                        {course.duration} giờ
                                                    </span>
                                                )}
                                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs font-medium">
                                                    {formatDate(course.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 mb-6">
                                        <nav className="-mb-px flex space-x-8">
                                            <button
                                                onClick={() => setActiveTab('description')}
                                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'description'
                                                    ? 'border-orange-500 text-orange-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                Mô tả khóa học
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('curriculum')}
                                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'curriculum'
                                                    ? 'border-orange-500 text-orange-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                Nội dung khóa học
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('instructor')}
                                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'instructor'
                                                    ? 'border-orange-500 text-orange-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                Thông tin tác giả
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('comments')}
                                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'comments'
                                                    ? 'border-orange-500 text-orange-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                Bình luận
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="min-h-[300px]">
                                        {activeTab === 'description' && (
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {course.description}
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === 'curriculum' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <span className="text-orange-600 font-semibold text-sm">1</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Giới thiệu và cài đặt môi trường</h3>
                                                        <p className="text-sm text-gray-600">Tìm hiểu về Spring Boot và cách cài đặt</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <span className="text-orange-600 font-semibold text-sm">2</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Xây dựng API cơ bản</h3>
                                                        <p className="text-sm text-gray-600">Tạo RESTful API với Spring Boot</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <span className="text-orange-600 font-semibold text-sm">3</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Kết nối cơ sở dữ liệu</h3>
                                                        <p className="text-sm text-gray-600">Sử dụng JPA và Hibernate</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <span className="text-orange-600 font-semibold text-sm">4</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">Triển khai ứng dụng</h3>
                                                        <p className="text-sm text-gray-600">Deploy ứng dụng lên server</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'instructor' && (
                                            <div className="space-y-6">
                                                {/* Instructor Profile */}
                                                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-xl">LĐ</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">Lê Khánh Đức</h3>
                                                        <p className="text-orange-600 font-medium mb-2">Backend Developer</p>
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            Chuyên gia phát triển backend với kinh nghiệm sâu về Java, Spring Boot và các công nghệ cloud.
                                                            Tôi đam mê chia sẻ kiến thức và giúp đỡ các bạn trẻ phát triển kỹ năng lập trình backend.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3">Kỹ năng chuyên môn</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Java', 'Spring Boot', 'Docker', 'PostgreSQL', 'Elasticsearch', 'MongoDB', 'AWS', 'Kubernetes'].map((skill) => (
                                                            <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Contact */}
                                                <div className="p-4 bg-orange-50 rounded-lg">
                                                    <h4 className="font-semibold text-gray-900 mb-2">Liên hệ với giảng viên</h4>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Có câu hỏi về khóa học? Hãy liên hệ trực tiếp với tôi!
                                                    </p>
                                                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm">
                                                        Gửi tin nhắn
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'comments' && (
                                            <div className="text-center py-12">
                                                <div className="text-gray-400 mb-4">
                                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bình luận nào</h3>
                                                <p className="text-gray-600">Hãy là người đầu tiên đánh giá khóa học này!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
                            <div className="bg-white rounded-xl p-5 sticky top-8">
                                {/* Price */}
                                <div className="text-center mb-5">
                                    <div className="text-3xl font-bold text-orange-500 mb-2">
                                        {formatPrice(course.price)}
                                    </div>
                                    <p className="text-sm text-gray-600">Một lần thanh toán, học mãi mãi</p>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-2 mb-6">
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 hover:shadow-md cursor-pointer">
                                        Đăng ký ngay
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>Thêm vào yêu thích</span>
                                    </button>
                                </div>

                                {/* Course Stats */}
                                <div className="border-t border-gray-200 pt-5">
                                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Thông tin khóa học</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Trình độ:</span>
                                            <span className="font-medium text-gray-900">{getLevelText(course.level || CourseLevel.BEGINNER)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Thời lượng:</span>
                                            <span className="font-medium text-gray-900">{course.duration || 0} giờ</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Đánh giá:</span>
                                            <div className="flex items-center space-x-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">(0)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo & Description */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">F</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">F Learning</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                                Nền tảng học tập trực tuyến hàng đầu, giúp bạn phát triển kỹ năng và thăng tiến trong sự nghiệp.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Trang chủ</Link></li>
                                <li><Link href="/courses" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Khóa học</Link></li>
                                <li><Link href="/blogs" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Blog</Link></li>
                                <li><Link href="/about" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Về chúng tôi</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Hỗ trợ</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Trung tâm trợ giúp</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Liên hệ</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Điều khoản sử dụng</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">Chính sách bảo mật</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 F Learning. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.007 0C5.373 0 .007 5.373.007 12s5.366 12 12 12 12-5.373 12-12S18.641 0 12.007 0zm5.5 8.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm-7 0c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
