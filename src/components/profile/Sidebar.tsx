"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  LogOut,
  PenSquare,
  ShieldCheck,
  Smartphone,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { UserDetailResponse } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

interface SidebarProps {
  user: UserDetailResponse;
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
      icon: Smartphone,
    },
  ];

  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* User Card */}
      <button
        type="button"
        onClick={() => onTabChange("profile")}
        className="group flex w-full items-center gap-3 border-b border-gray-200 p-5 text-left transition hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
      >
        <div className="relative flex-shrink-0">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-600">
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
          <h3 className="truncate text-sm font-semibold text-gray-900 transition group-hover:text-accent dark:text-white">
            {user.username || t("profilePage.sidebar.user")}
          </h3>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
          {user.university && (
            <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
              {user.university}
            </p>
          )}
        </div>
      </button>

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
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-accent text-white font-semibold shadow-sm shadow-accent/30"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      isActive
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
      <div className="border-t border-gray-200 p-2 dark:border-slate-700">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
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
