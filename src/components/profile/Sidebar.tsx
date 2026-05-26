"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserDetailResponse } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

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
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useI18n();
 
  const handleLogout = async () => {
    if (isLoggingOut) return;
 
    setIsLoggingOut(true);
    await logout();
    // Redirect ngay lập tức sau khi logout
    router.push("/login");
  };
  const tabs = [
    {
      id: "profile",
      label: t("userMenu.profile"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "my-posts",
      label: t("userMenu.myPosts"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: "password",
      label: t("profilePage.passwordTab.changePassword"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      id: "security",
      label: t("profilePage.securityTab.security"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: "sessions",
      label: t("profilePage.sessionsTab.sessionsTitle"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => onTabChange("profile")}
          className="w-full flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username || "User"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-white">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            {user.mftEnable && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.username || t("profilePage.sidebar.user")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            {user.university && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">{user.university}</p>
            )}
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? "bg-accent text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{isLoggingOut ? t("profilePage.sidebar.loggingOut") : t("profilePage.sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
