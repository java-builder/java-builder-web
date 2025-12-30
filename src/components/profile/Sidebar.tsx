"use client";

import Image from "next/image";
import { UserDetailResponse } from "@/types/user";

interface SidebarProps {
  user: UserDetailResponse;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({
  user,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const tabs = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 lg:h-full">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username || "User avatar"}
                width={48}
                height={48}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm sm:text-base">
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {user.username || "Người dùng"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {user.email || "Chưa có email"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Horizontal on mobile, vertical on desktop */}
      <nav className="p-2">
        <ul className="flex lg:flex-col lg:space-y-1 overflow-x-auto lg:overflow-x-visible gap-1 lg:gap-0">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-shrink-0 lg:flex-shrink">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap group ${
                  activeTab === tab.id
                    ? "bg-accent-50 text-accent-700 lg:border-r-2 border-accent"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`mr-2 lg:mr-3 transition-colors ${
                    activeTab === tab.id
                      ? "text-accent-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
