"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/services/conversation.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { menuGroups } from "./menuData";
import { MenuItem, MenuGroup } from "./types";
import SidebarMenuGroup from "./SidebarMenuGroup";
import MobileSidebar from "./MobileSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Bell, BellOff, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { fcmService } from "@/services/fcm.service";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const { data: notifData } = useNotifications(1, "all");
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialOpenState: Record<string, boolean> = {};
    menuGroups.forEach((group) => {
      initialOpenState[group.title] = group.defaultOpen ?? false;
    });
    return initialOpenState;
  });
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const [clientTitle, setClientTitle] = useState<string | null>(null);

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
    try {
      const stored = localStorage.getItem("app_name_cache");
      if (stored) {
        setClientTitle(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof rawAppName === "string" && rawAppName.trim() !== "") {
      try {
        localStorage.setItem("app_name_cache", rawAppName);
      } catch {
        // ignore
      }
    }
  }, [rawAppName]);

  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : clientTitle
        ? clientTitle
        : "Java Builder";

  const allHrefs = useMemo(() => {
    const hrefs: string[] = [];
    menuGroupsWithBadge.forEach((group) =>
      group.items.forEach((item) => hrefs.push(item.href))
    );
    return hrefs;
  }, [menuGroupsWithBadge]);

  const isActive = useCallback(
    (href: string) => {
      if (!pathname) return false;
      if (href === "/") {
        return pathname === "/";
      }
      if (pathname === href) return true;
      if (pathname.startsWith(`${href}/`)) {
        const hasMoreSpecific = allHrefs.some(
          (h) => h !== href && h.startsWith(`${href}/`) && pathname.startsWith(h)
        );
        return !hasMoreSpecific;
      }
      return false;
    },
    [pathname, allHrefs]
  );

  useEffect(() => {
    setOpenGroups((prev) => {
      let hasChange = false;
      const next = { ...prev };
      menuGroupsWithBadge.forEach((group) => {
        if (next[group.title] === undefined) {
          next[group.title] = group.defaultOpen ?? false;
          hasChange = true;
        }
        // Auto-expand group if any child item is active
        const hasActiveItem = group.items.some((item) => isActive(item.href));
        if (hasActiveItem && !next[group.title]) {
          next[group.title] = true;
          hasChange = true;
        }
      });
      return hasChange ? next : prev;
    });
  }, [menuGroupsWithBadge, isActive]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
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
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={handleCloseMobileSidebar}
      />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-surface border-r border-border transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo & Toggle */}
        <div
          className={`flex items-center h-16 border-b border-border shrink-0 ${
            isCollapsed ? "px-2.5 justify-between gap-1" : "px-4 justify-between"
          }`}
        >
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/logos/java-logo.png"
                  alt={appName}
                  width={36}
                  height={36}
                  className="object-contain [filter:hue-rotate(16deg)_saturate(1.25)_brightness(1.05)]"
                />
              </div>
              {!rawAppName && clientTitle === null ? (
                <span className="w-24 h-4 rounded bg-muted inline-block" />
              ) : (
                <span className="text-xs font-bold text-foreground tracking-wider uppercase leading-tight truncate">
                  {appName}
                </span>
              )}
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center shrink-0">
              <div className="relative w-8 h-8">
                <Image
                  src="/logos/java-logo.png"
                  alt={appName}
                  width={32}
                  height={32}
                  className="object-contain [filter:hue-rotate(16deg)_saturate(1.25)_brightness(1.05)]"
                />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-full text-text-muted hover:text-primary hover:bg-primary-soft dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-1">
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
          <div className="px-3 py-2 border-t border-border">
            {fcmService.isSupported() ? (
              isCollapsed ? (
                <button
                  onClick={handleTogglePush}
                  disabled={isToggling}
                  type="button"
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isPushEnabled
                      ? "bg-primary-soft border-primary-soft-border text-primary"
                      : "bg-background border-border text-text-muted hover:text-primary hover:bg-primary-soft"
                  }`}
                  title={isPushEnabled ? "Đã bật thông báo đẩy" : "Bấm để nhận thông báo đẩy"}
                >
                  {isToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : isPushEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="p-3 rounded-xl border border-border bg-background flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    {isPushEnabled ? (
                      <Bell className="w-4 h-4 text-primary" />
                    ) : (
                      <BellOff className="w-4 h-4 text-text-muted" />
                    )}
                    <span>Nhận thông báo</span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <button
                    onClick={handleTogglePush}
                    disabled={isToggling}
                    type="button"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPushEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                    } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isPushEnabled ? "translate-x-4" : "translate-x-0"
                      } flex items-center justify-center`}
                    >
                      {isToggling && <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />}
                    </span>
                  </button>
                </div>
              )
            ) : isIOS ? (
              isCollapsed ? (
                <div
                  className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center border border-dashed border-border text-warning cursor-help"
                  title="iOS: Nhấn Chia sẻ 📤 -> 'Thêm vào MH chính' để nhận thông báo đẩy."
                >
                  <BellOff className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-border bg-background flex flex-col gap-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <BellOff className="w-4 h-4 text-warning" />
                    <span>Nhận thông báo (iOS)</span>
                  </div>
                  <p className="text-[10px] leading-normal text-text-muted">
                    Nhấn <span className="font-semibold text-foreground">Chia sẻ 📤</span> trên Safari &rarr; chọn <span className="font-semibold text-foreground">&quot;Thêm vào MH chính&quot;</span> để bật thông báo.
                  </p>
                </div>
              )
            ) : null}
          </div>
        )}

      </aside>

      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      />
    </>
  );
}
