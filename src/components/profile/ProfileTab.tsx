'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserDetailResponse } from '@/types/user';
import { userApi } from '@/services/user.service';

interface ProfileTabProps {
    user: UserDetailResponse;
    onSave?: (data: Partial<UserDetailResponse>) => Promise<void>;
    isSaving?: boolean;
}

export default function ProfileTab({ user, isSaving, onSave }: ProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(user.avatar || '');
    const [formData, setFormData] = useState({
        username: user.username || '',
        email: user.email || '',
        university: user.university || '',
    });

    useEffect(() => {
        setCurrentAvatar(user.avatar || '');
    }, [user.avatar]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasChanges =
            formData.username !== user.username ||
            formData.university !== (user.university || '');

        if (!hasChanges) {
            setIsEditing(false);
            return;
        }

        try {
            await userApi.updateProfile({
                username: formData.username,
                university: formData.university
            });
            if (onSave) {
                await onSave({
                    username: formData.username,
                    university: formData.university
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            university: user.university || '',
        });
        setIsEditing(false);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh hợp lệ.');
            return;
        }

        try {
            setIsUploadingAvatar(true);
            const response = await userApi.updateAvatar(file);

            if (response.result) {
                setCurrentAvatar(response.result);
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
        } finally {
            setIsUploadingAvatar(false);
        }
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
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center relative">
                                {currentAvatar ? (
                                    <Image
                                        key={currentAvatar}
                                        src={`${currentAvatar}?t=${Date.now()}`}
                                        alt={user.username || 'User avatar'}
                                        width={96}
                                        height={96}
                                        className="w-full h-full rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-3xl font-medium text-gray-600">
                                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Ảnh đại diện</h3>
                                <p className="text-sm text-gray-500 mb-3">JPG, PNG hoặc GIF. Tối đa 2MB.</p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={isUploadingAvatar}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        id="avatar-upload"
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer inline-block ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isUploadingAvatar ? 'Đang tải lên...' : 'Thay đổi ảnh'}
                                    </label>
                                </div>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-50 disabled:text-gray-800 text-gray-900"
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