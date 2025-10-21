'use client';

import Image from 'next/image';
import { UserDetailResponse } from '@/types/user';

interface SidebarProps {
    user: UserDetailResponse;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ user, activeTab, onTabChange }: SidebarProps) {
    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
        { id: 'security', label: 'Bảo mật', icon: '🔒' },
        { id: 'password', label: 'Đổi mật khẩu', icon: '🔑' },
    ];

    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            {/* User Info */}
            <div className="p-8 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.username || 'User avatar'}
                                width={64}
                                height={64}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl font-medium text-gray-600">
                                {user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{user.username || 'Người dùng'}</h2>
                        <p className="text-sm text-gray-500">{user.email || 'Chưa có email'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => onTabChange(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-3">{tab.icon}</span>
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}