"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { menuGroups } from "./menuData";
import { MenuItem, MenuGroup } from "./types";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { data: notifData } = useNotifications(1, "all");
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const [clientTitle, setClientTitle] = useState<string | null>(null);

  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Update menu groups with notification badge
  const menuGroupsWithBadge = useMemo(() => {
    return menuGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.href === "/notifications" && unreadCount > 0) {
          return {
            ...item,
            badge: unreadCount > 9 ? "9+" : String(unreadCount),
          };
        }
        return item;
      }),
    }));
  }, [unreadCount]);

  useEffect(() => {
    if (!rawAppName && typeof document !== "undefined") {
      setClientTitle(document.title || null);
    }
  }, [rawAppName]);

  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : clientTitle
      ? clientTitle
      : "Java Builder";

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const shouldShowGroup = (group: MenuGroup) => {
    if (!group.requireAuth) return true;
    return !!currentUser;
  };

  const shouldShowItem = (item: MenuItem) => {
    if (!item.requireAuth) return true;
    return !!currentUser;
  };

  const handleLogout = async () => {
    onClose();
    queryClient.clear();
    await authApi.logout();
    router.push("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 z-50 lg:hidden transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/logos/java-logo.png"
                alt={appName}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            {(!rawAppName && clientTitle === null) ? (
              <span className="w-24 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse inline-block" />
            ) : (
              <span className="text-xs font-semibold text-gray-900 dark:text-white tracking-wider uppercase leading-tight">
                {appName}
              </span>
            )}
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Đóng menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Section (if logged in) */}
        {currentUser && (
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {currentUser.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.username || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {currentUser.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentUser.username || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Xem hồ sơ
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Login/Register Buttons (if not logged in) */}
        {!currentUser && (
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium text-center"
                onClick={onClose}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="w-full px-4 py-2.5 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-sm font-medium text-center"
                onClick={onClose}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        )}

        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuGroupsWithBadge.map((group) => {
            if (!shouldShowGroup(group)) return null;

            return (
              <div key={group.title}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    if (!shouldShowItem(item)) return null;

                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            active
                              ? "bg-accent/10 text-accent dark:bg-accent/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                          }`}
                          onClick={onClose}
                        >
                          <span
                            className={`flex-shrink-0 ${
                              active ? "text-accent" : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 font-medium text-sm">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Logout Button - Only show if logged in */}
        {currentUser && (
          <div className="border-t border-gray-200 dark:border-slate-700 p-3 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
