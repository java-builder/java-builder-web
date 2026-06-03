"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Logo,
  ThemeToggle,
  NotificationDropdown,
  UserMenu,
  AuthButtons,
} from "./header-components";
import { MobileSidebar } from "./sidebar";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { data: currentUser, isLoading } = useCurrentUser();
  
  useEffect(() => {
    setHasToken(authApi.isAuthenticated());
  }, []);

  useEffect(() => {
    if (currentUser) {
      setHasToken(true);
    } else if (!isLoading && hasToken !== null) {
      const tokenExists = authApi.isAuthenticated();
      setHasToken(tokenExists);
    }
  }, [currentUser, isLoading, hasToken]);

  const isLoggedIn = !!currentUser;
  const showAuthLoading = hasToken === true && isLoading;

  const handleLogout = async () => {
    setHasToken(false);
    queryClient.clear(); 
    setIsMobileSidebarOpen(false);
    
    await authApi.logout();
    router.push("/login");
  };

  return (
    <>
      <nav className="w-full bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 relative z-30">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t("header.openMenu")}
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
            
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="minimal" />
            <ThemeToggle />

            {showAuthLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                <NotificationDropdown />
                <UserMenu onLogout={handleLogout} />
              </>
            ) : hasToken === false ? (
              <AuthButtons />
            ) : null}
          </div>
        </div>
      </nav>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </>
  );
}
