"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Logo,
  NavLinks,
  ThemeToggle,
  NotificationDropdown,
  UserMenu,
  AuthButtons,
  MobileMenuButton,
} from "./header-components";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    
    await authApi.logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <NavLinks />

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-3 flex-1">
          <ThemeToggle />

          {/* Auth Section - không render gì khi đang loading để tránh flash */}
          {showAuthLoading ? (
            // Placeholder để giữ layout ổn định
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <NavLinks mobile onItemClick={() => setIsMobileMenuOpen(false)} />
            
            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 dark:border-slate-700 my-3" />
                <button 
                  onClick={handleLogout} 
                  className="block py-2 text-red-600 dark:text-red-400 w-full text-left"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
