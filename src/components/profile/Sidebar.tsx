"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  LogOut,
  PenSquare,
  ShieldCheck,
  MonitorSmartphone,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { ProfileDetailResponse } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

interface SidebarProps {
  user: ProfileDetailResponse;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
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
    router.push("/login");
  };

  const tabs: TabItem[] = [
    { id: "profile", label: t("userMenu.profile"), icon: UserIcon },
    { id: "my-posts", label: t("userMenu.myPosts"), icon: PenSquare },
    {
      id: "password",
      label: t("profilePage.passwordTab.changePassword"),
      icon: KeyRound,
    },
    {
      id: "security",
      label: t("profilePage.securityTab.security"),
      icon: ShieldCheck,
    },
    {
      id: "sessions",
      label: t("profilePage.sessionsTab.sessionsTitle"),
      icon: MonitorSmartphone,
    },
  ];

  return (
    <aside className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      {/* User Card */}
      <div className="border-b border-[#E8E8E8] dark:border-border p-5 space-y-3">
        <button
          type="button"
          onClick={() => onTabChange("profile")}
          className="group flex w-full items-center gap-3 text-left transition"
        >
          <div className="relative flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF5A1F] to-[#FF9900]">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username || "User"}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            {user.mftEnable && (
              <span
                title={t("profilePage.securityTab.activated")}
                className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800"
              >
                <ShieldCheck className="h-3 w-3 text-white" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-gray-900 transition group-hover:text-[#FF5A1F] dark:text-white">
                {user.username || t("profilePage.sidebar.user")}
              </h3>
              {user.experienceLevel && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5A1F]/10 text-[#FF5A1F] dark:bg-[#FF5A1F]/20 dark:text-[#FF9900]">
                  {user.experienceLevel}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            {user.headline ? (
              <p className="mt-0.5 truncate text-[11px] font-medium text-[#FF5A1F] dark:text-[#FF9900]">
                {user.headline}
              </p>
            ) : user.specialization ? (
              <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
                {user.specialization}
              </p>
            ) : user.university ? (
              <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                {user.university}
              </p>
            ) : null}
          </div>
        </button>


      </div>

      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                      ? "bg-[#FF5A1F] text-white font-semibold shadow-xs shadow-[#FF5A1F]/30"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#222938]"
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white"
                      }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#E8E8E8] dark:border-border p-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-900/20 active:scale-95"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {isLoggingOut
              ? t("profilePage.sidebar.loggingOut")
              : t("profilePage.sidebar.logout")}
          </span>
        </button>
      </div>
    </aside>
  );
}
