"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/services/conversation.service";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { menuGroups } from "./menuData";
import { MenuItem, MenuGroup } from "./types";
import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarUserProfile from "./SidebarUserProfile";
import MobileSidebar from "./MobileSidebar";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useSidebar } from "@/contexts/SidebarContext";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { fcmService } from "@/services/fcm.service";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: notifData } = useNotifications(1, "all");
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const [clientTitle, setClientTitle] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent || "";
      const ios = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);
      setIsIOS(ios);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && fcmService.isSupported() && currentUser) {
      const status = fcmService.getPermissionStatus();
      const localToken = localStorage.getItem("fcm_token_registered");
      setIsPushEnabled(status === "granted" && !!localToken);
    }
  }, [currentUser]);

  const handleTogglePush = async () => {
    if (!fcmService.isSupported()) {
      toast.error("Trình duyệt không hỗ trợ thông báo đẩy (FCM)");
      return;
    }

    const currentPermission = fcmService.getPermissionStatus();
    if (currentPermission === "denied") {
      toast.error("Quyền thông báo bị chặn! Hãy click icon 🔒 trên URL để bật lại.");
      return;
    }

    setIsToggling(true);
    try {
      if (!isPushEnabled) {
        const token = await fcmService.requestPermission();
        if (token) {
          await fcmService.saveFCMToken(token);
          localStorage.setItem("fcm_token_registered", token);
          setIsPushEnabled(true);
          toast.success("🔔 Đã bật thông báo thành công!");
        } else {
          const statusAfterPrompt = fcmService.getPermissionStatus();
          if (statusAfterPrompt === "denied") {
            toast.error("Bạn đã từ chối quyền nhận thông báo.");
          } else {
            toast.error("Không thể bật thông báo. Vui lòng thử lại.");
          }
        }
      } else {
        await fcmService.deleteFCMToken();
        localStorage.removeItem("fcm_token_registered");
        setIsPushEnabled(false);
        toast.success("🔕 Đã tắt thông báo đẩy");
      }
    } catch (error) {
      console.error("Error toggling FCM:", error);
      toast.error("Có lỗi xảy ra khi thiết lập thông báo");
    } finally {
      setIsToggling(false);
    }
  };

  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { data: unreadConvData } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () => conversationApi.getUnreadCount(),
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5,
  });

  const unreadChatCount = unreadConvData?.data ?? 0;

  const menuGroupsWithBadge = useMemo(() => {
    return menuGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.href === "/notifications" && unreadCount > 0) {
          return {
            ...item,
            badge: unreadCount > 99 ? "99+" : String(unreadCount),
          };
        }
        if (item.href === "/messages" && unreadChatCount > 0) {
          return {
            ...item,
            badge: unreadChatCount > 99 ? "99+" : String(unreadChatCount),
          };
        }
        return item;
      }),
    }));
  }, [unreadCount, unreadChatCount]);



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

  const allHrefs = useMemo(() => {
    const hrefs: string[] = [];
    menuGroupsWithBadge.forEach((group) =>
      group.items.forEach((item) => hrefs.push(item.href))
    );
    return hrefs;
  }, [menuGroupsWithBadge]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    if (pathname === href) return true;
    // Only match startsWith if no other more-specific menu href matches
    if (pathname.startsWith(`${href}/`)) {
      const hasMoreSpecific = allHrefs.some(
        (h) => h !== href && h.startsWith(`${href}/`) && pathname.startsWith(h)
      );
      return !hasMoreSpecific;
    }
    return false;
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
            <div className="relative w-8 h-8" suppressHydrationWarning>
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

          <LanguageSwitcher variant="minimal" />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
      />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-40 ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Logo & Toggle */}
        <div className={`flex items-center p-4 border-b border-gray-200 dark:border-slate-700 ${isCollapsed ? "flex-col gap-3" : "justify-between"
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
            {isCollapsed ? (
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>



        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-1">
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

        {/* Quick Notification Settings Toggle Panel */}
        {currentUser && (
          <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-800/60">
            {fcmService.isSupported() ? (
              isCollapsed ? (
                <button
                  onClick={handleTogglePush}
                  disabled={isToggling}
                  type="button"
                  className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${isPushEnabled
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-50 border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/80 text-gray-400 hover:text-foreground hover:bg-gray-100"
                    }`}
                  title={isPushEnabled ? "Đã bật thông báo đẩy" : "Bấm để nhận thông báo đẩy"}
                >
                  {isToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPushEnabled ? (
                    <Bell className="w-4 h-4 animate-pulse" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="p-3 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-950/20 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {isPushEnabled ? (
                      <Bell className="w-4 h-4 text-emerald-500 animate-bounce" />
                    ) : (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Nhận thông báo</span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <button
                    onClick={handleTogglePush}
                    disabled={isToggling}
                    type="button"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPushEnabled ? "bg-accent" : "bg-gray-200 dark:bg-slate-700"
                      } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isPushEnabled ? "translate-x-4" : "translate-x-0"
                        } flex items-center justify-center`}
                    >
                      {isToggling && <Loader2 className="w-2.5 h-2.5 animate-spin text-accent" />}
                    </span>
                  </button>
                </div>
              )
            ) : isIOS ? (
              isCollapsed ? (
                <div
                  className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center border border-dashed border-gray-200 dark:border-slate-700/80 text-amber-500/70 cursor-help"
                  title="iOS: Nhấn Chia sẻ 📤 -> 'Thêm vào MH chính' để nhận thông báo đẩy."
                >
                  <BellOff className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-gray-200 dark:border-slate-700/80 bg-gray-50/30 dark:bg-slate-950/10 flex flex-col gap-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-650 dark:text-gray-400">
                    <BellOff className="w-4 h-4 text-amber-500/80" />
                    <span>Nhận thông báo (iOS)</span>
                  </div>
                  <p className="text-[10px] leading-normal text-gray-500 dark:text-gray-400">
                    Nhấn <span className="font-semibold">Chia sẻ 📤</span> trên Safari &rarr; chọn <span className="font-semibold">&quot;Thêm vào MH chính&quot;</span> để bật thông báo.
                  </p>
                </div>
              )
            ) : null}
          </div>
        )}

        <div className={`border-t border-gray-200 dark:border-slate-700 p-4 ${isCollapsed ? "flex flex-col items-center gap-3" : ""
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
        className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
          }`}
      />
    </>
  );
}
