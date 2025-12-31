"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/auth.service";
import {
  Logo,
  NavLinks,
  ThemeToggle,
  NotificationDropdown,
  MessagesDropdown,
  UserMenu,
  AuthButtons,
  MobileMenuButton,
} from "./header-components";

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(authApi.isAuthenticated());
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      authApi.clearAuthData();
    }
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="w-full bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Mobile Menu + Logo */}
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

          {isLoggedIn && (
            <>
              <MessagesDropdown />
              <NotificationDropdown />
            </>
          )}

          {isLoggedIn ? <UserMenu /> : <AuthButtons />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 shadow-lg">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <NavLinks mobile onItemClick={() => setIsMobileMenuOpen(false)} />
            
            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 my-3" />
                <button 
                  onClick={handleLogout} 
                  className="block py-2 text-red-600 w-full text-left"
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
