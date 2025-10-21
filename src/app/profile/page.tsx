'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useUser } from '@/hooks/useUser';
import Sidebar from '@/components/profile/Sidebar';
import ProfileTab from '@/components/profile/ProfileTab';
import SecurityTab from '@/components/profile/SecurityTab';
import PasswordTab from '@/components/profile/PasswordTab';
import { UserDetailResponse } from '@/types/user';

export default function ProfilePage() {
    const { user, loading, error, updateUser } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (data: Partial<UserDetailResponse>) => {
        try {
            setIsSaving(true);
            await updateUser(data);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab user={user!} onSave={handleSave} isSaving={isSaving} />;
            case 'security':
                return <SecurityTab />;
            case 'password':
                return <PasswordTab />;
            default:
                return <ProfileTab user={user!} onSave={handleSave} isSaving={isSaving} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded-xl"></div>
                            <div className="h-96 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy thông tin người dùng</h2>
                        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem thông tin cá nhân</p>
                        <a
                            href="/login"
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-6 h-full">
                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <Sidebar
                            user={user}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">FL</span>
                                </div>
                                <span className="text-xl font-bold text-gray-800">F Learning</span>
                            </div>
                            <p className="text-gray-600 mb-4 max-w-md">
                                Nền tảng học tập trực tuyến hiện đại, giúp bạn tiếp cận kiến thức mọi lúc, mọi nơi với chất lượng tốt nhất.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Khóa học</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Frontend Development</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Backend Development</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Mobile Development</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Data Science</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Hỗ trợ</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Trung tâm trợ giúp</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Liên hệ</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Điều khoản sử dụng</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">Chính sách bảo mật</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8">
                        <p className="text-center text-gray-500 text-sm">
                            © 2024 F Learning. Tất cả quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
