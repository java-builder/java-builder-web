"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarUserProfile from "./SidebarUserProfile";
import MobileSidebar from "./MobileSidebar";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: notifData } = useNotifications(1, "all");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const [clientTitle, setClientTitle] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthChecked(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : clientTitle
      ? clientTitle
      : "Java Builder";

  const handleLogout = async () => {
    queryClient.clear();
    await authApi.logout();
    router.push("/login");
  };

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    menuGroupsWithBadge.forEach((group) => {
      initialOpenState[group.title] = group.defaultOpen ?? false;
    });
    setOpenGroups(initialOpenState);
  }, [menuGroupsWithBadge]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <>
      {/* Mobile Header Bar - Only visible on mobile */}
      <div className="lg:hidden sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileSidebarOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Mở menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logos/java-logo.png"
                alt={appName}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {appName}
            </span>
          </Link>

          {/* Empty space for balance */}
          <div className="w-8 h-8"></div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
      />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo & Toggle */}
        <div className={`flex items-center p-4 border-b border-gray-200 dark:border-slate-700 ${
          isCollapsed ? "flex-col gap-3" : "justify-between"
        }`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5">
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
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center">
              <div className="relative w-9 h-9">
                <Image
                  src="/logos/java-logo.png"
                  alt={appName}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuGroupsWithBadge.map((group) => {
            if (!shouldShowGroup(group)) return null;

            return (
              <SidebarMenuGroup
                key={group.title}
                group={group}
                isCollapsed={isCollapsed}
                isOpen={openGroups[group.title]}
                onToggle={() => toggleGroup(group.title)}
                isActive={isActive}
                shouldShowItem={shouldShowItem}
              />
            );
          })}
        </nav>

        <div className={`border-t border-gray-200 dark:border-slate-700 p-4 ${
          isCollapsed ? "flex flex-col items-center gap-3" : ""
        }`}>
          {!isAuthChecked || isLoading ? (
            isCollapsed ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <SidebarUserProfile
              currentUser={currentUser}
              isCollapsed={isCollapsed}
              onLogout={handleLogout}
            />
          )}
        </div>
      </aside>

      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      />
    </>
  );
}
