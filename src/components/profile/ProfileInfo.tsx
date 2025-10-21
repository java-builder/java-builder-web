'use client';

import { useState } from 'react';
import { UserDetailResponse } from '@/types/user';

interface ProfileInfoProps {
    user: UserDetailResponse;
    isEditing?: boolean;
    onSave?: (data: Partial<UserDetailResponse>) => void;
    onCancel?: () => void;
}

export default function ProfileInfo({ user, isEditing = false, onSave, onCancel }: ProfileInfoProps) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        university: user.university || '',
        avatar: user.avatar || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave?.(formData);
    };

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            university: user.university || '',
            avatar: user.avatar || '',
        });
        onCancel?.();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                <p className="text-sm text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
            </div>

            <div className="p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên người dùng
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trường đại học
                                </label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="Nhập tên trường đại học"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Avatar
                                </label>
                                <input
                                    type="url"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Tên người dùng
                                </label>
                                <p className="text-lg text-gray-900">{user.username || 'Chưa có tên người dùng'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900">{user.email || 'Chưa có email'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Trường đại học
                                </label>
                                <p className="text-lg text-gray-900">
                                    {user.university || 'Chưa cập nhật'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Trạng thái tài khoản
                                </label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${user.userStatus === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : user.userStatus === 'INACTIVE'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.userStatus === 'ACTIVE' ? 'Hoạt động' :
                                        user.userStatus === 'INACTIVE' ? 'Không hoạt động' : 'Bị cấm'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">ID người dùng</p>
                                        <p className="text-sm text-gray-600">{user.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Ngày tham gia</p>
                                        <p className="text-sm text-gray-600">15 tháng 1, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
