"use client";

import { useEffect, useState, useMemo } from "react";
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
import { useI18n } from "@/contexts/I18nContext";
import { Bell, BellOff, Loader2, X } from "lucide-react";
import { fcmService } from "@/services/fcm.service";
import toast from "react-hot-toast";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const { data: notifData } = useNotifications(1, "all");
  const { settings } = useSettingsContext();
  const { t } = useI18n();
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
          toast.success("🔔 Đã bật thông báo đẩy thành công!");
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

  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : clientTitle
        ? clientTitle
        : "Java Builder";

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

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


  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in-0 duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-surface border-r border-border z-50 lg:hidden transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
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
              <span className="text-xs font-bold text-foreground tracking-wider uppercase leading-tight">
                {appName}
              </span>
            )}
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary-soft dark:hover:bg-slate-800 transition-colors"
            aria-label={t("common.close") || "Đóng"}
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>


        {/* Menu Groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {menuGroupsWithBadge.map((group) => {
            if (!shouldShowGroup(group)) return null;

            return (
              <div key={group.title} className="space-y-1">
                <div className="flex items-center gap-2 px-2.5 py-1 mb-1 text-[11px] font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  {group.icon && (
                    <div className="w-5 h-5 rounded-md bg-primary-soft dark:bg-primary/15 flex items-center justify-center text-primary [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:!text-primary flex-shrink-0">
                      {group.icon}
                    </div>
                  )}
                  <span>{group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}</span>
                </div>
                <ul className="space-y-1 mt-1">
                  {group.items.map((item) => {
                    if (!shouldShowItem(item)) return null;

                    const active = isActive(item.href);
                    const displayedLabel = item.labelKey ? t(item.labelKey as Parameters<typeof t>[0]) : item.label;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            item.highlight || active
                              ? "bg-primary-soft dark:bg-primary/15 text-primary font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:rounded-r-full before:bg-primary"
                              : "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium"
                          }`}
                          onClick={onClose}
                        >
                          <span
                            className={`w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:stroke-[2] [&_svg]:flex-shrink-0 ${
                              active || item.highlight
                                ? "text-primary"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className={`flex-1 text-[14px] truncate ${active || item.highlight ? "font-semibold text-primary" : "font-medium text-slate-800 dark:text-slate-200"}`}>
                            {displayedLabel}
                          </span>
                          {item.tag ? (
                            item.tagVariant === "hot" ? (
                              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary text-primary-foreground uppercase leading-none shadow-xs">
                                {item.tag}
                              </span>
                            ) : item.tagVariant === "pro" ? (
                              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-secondary-soft text-secondary border border-secondary-soft-border uppercase leading-none">
                                {item.tag}
                              </span>
                            ) : item.tagVariant === "new" ? (
                              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-warning-soft text-warning border border-warning-border uppercase leading-none">
                                {item.tag}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary-soft text-primary border border-primary-soft-border uppercase leading-none">
                                {item.tag}
                              </span>
                            )
                          ) : null}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full shadow-xs leading-none bg-primary text-primary-foreground">
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

        {/* Quick Notification Settings Toggle Panel */}
        {currentUser && (
          <div className="px-4 py-3 border-t border-border">
            {fcmService.isSupported() ? (
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
            ) : isIOS ? (
              <div className="p-3 rounded-xl border border-dashed border-border bg-background flex flex-col gap-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <BellOff className="w-4 h-4 text-warning" />
                  <span>Nhận thông báo (iOS)</span>
                </div>
                <p className="text-[10px] leading-normal text-text-muted">
                  Nhấn <span className="font-semibold text-foreground">Chia sẻ 📤</span> trên Safari &rarr; chọn <span className="font-semibold text-foreground">&quot;Thêm vào MH chính&quot;</span> để bật thông báo.
                </p>
              </div>
            ) : null}
          </div>
        )}

      </aside>
    </>
  );
}
