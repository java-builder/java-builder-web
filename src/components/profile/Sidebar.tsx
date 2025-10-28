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
        {
            id: 'profile',
            label: 'Thông tin cá nhân',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'security',
            label: 'Bảo mật',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            id: 'password',
            label: 'Đổi mật khẩu',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            )
        },
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
                        <p className="text-sm font-medium text-gray-700">{user.email || 'Chưa có email'}</p>
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
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center ${activeTab === tab.id
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