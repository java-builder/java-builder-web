'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserDetailResponse } from '@/types/user';

interface ProfileTabProps {
    user: UserDetailResponse;
    onSave?: (data: Partial<UserDetailResponse>) => Promise<void>;
    isSaving?: boolean;
}

export default function ProfileTab({ user, isSaving }: ProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        university: user.university || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            university: user.university || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Thông tin cá nhân</h1>
                        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="px-8 py-8">
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.username || 'User avatar'}
                                        width={96}
                                        height={96}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-medium text-gray-600">
                                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Ảnh đại diện</h3>
                                <p className="text-sm text-gray-500 mb-3">JPG, PNG hoặc GIF. Tối đa 2MB.</p>
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Thay đổi ảnh
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên người dùng
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
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
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trường đại học
                                </label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="Nhập tên trường đại học"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}