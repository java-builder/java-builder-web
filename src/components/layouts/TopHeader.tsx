"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  Crown,
  CreditCard,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Heart,
  Lightbulb,
  MessageCircle,
  Menu,
} from "lucide-react";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { logout, hasAdminAccess } = useAuth();
  const { t } = useI18n();
  const { setIsMobileOpen } = useSidebar();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAdmin =
    hasAdminAccess ||
    currentUser?.authorities?.some(
      (a: string) => a === "ROLE_ADMIN" || a === "ADMIN" || a.includes("ADMIN")
    );

  return (
    <header className="sticky top-0 z-40 w-full h-14 lg:h-16 px-4 sm:px-6 md:px-8 flex items-center transition-colors bg-surface/95 backdrop-blur-md border-b border-border">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between lg:justify-end gap-2 sm:gap-4">
        {/* Left side (Mobile Only): Hamburger Menu */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileOpen(true);
            }}
            className="p-2 -ml-1.5 rounded-full hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Right side controls: ThemeToggle + LanguageSwitcher + Divider + Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
          <ThemeToggle variant="default" />
          <LanguageSwitcher variant="ghost" showLabel={true} />

          {/* Thin Vertical Divider Line */}
          <div className="h-5 w-px mx-0.5 bg-border" />

          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 sm:gap-2.5 p-1 sm:pr-2.5 rounded-full transition-all cursor-pointer select-none ${
                  isDropdownOpen
                    ? "bg-primary-soft dark:bg-primary/15 text-primary"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-foreground"
                }`}
                aria-expanded={isDropdownOpen}
                aria-label="Tài khoản người dùng"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center border-2 border-white/50 shadow-xs shrink-0">
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.username || "User"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {currentUser.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold tracking-wide truncate max-w-[120px]">
                  {currentUser.username}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Header */}
                  <div className="px-3.5 py-3 border-b border-border mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-primary flex items-center justify-center border border-white/40 shadow-2xs shrink-0">
                        {currentUser.avatar ? (
                          <Image
                            src={currentUser.avatar}
                            alt={currentUser.username || "User"}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {currentUser.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate">
                          {currentUser.username}
                        </p>
                        {currentUser.email && (
                          <p className="text-xs text-text-muted truncate">
                            {currentUser.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account & Billing Section */}
                  <div className="space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <User className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span>Thông tin cá nhân</span>
                    </Link>

                    <Link
                      href="/profile/subscription"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Crown className="w-4 h-4 text-warning" />
                        <span>Gói Premium của tôi</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning-soft text-warning border border-warning-border">
                        PRO
                      </span>
                    </Link>

                    <Link
                      href="/payment-history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span>Lịch sử thanh toán</span>
                    </Link>
                  </div>

                  {/* Personal Activity Section */}
                  <div className="my-1 border-t border-border" />
                  <div className="space-y-0.5">
                    <Link
                      href="/favorites"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span>{t("sidebar.favorites") || "Nội dung yêu thích"}</span>
                    </Link>

                    <Link
                      href="/my-contributions"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span>{t("sidebar.contributedQuestions") || "Câu hỏi đóng góp"}</span>
                    </Link>

                    <Link
                      href="/my-contributions"
                      onClick={() => setIsDropdownOpen(false)}
                      className="hidden"
                    />

                    <Link
                      href="/my-comments"
                      onClick={() => setIsDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span>{t("sidebar.myComments") || "Bình luận của tôi"}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Trang Quản trị</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-soft-border">
                          ADMIN
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-1 border-t border-border" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-error hover:bg-error-soft transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t("auth.login") || "Đăng nhập"}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
