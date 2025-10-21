'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/auth.service';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    setIsLoggedIn(authApi.isAuthenticated());
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn logout local ngay cả khi API call thất bại
      authApi.clearAuthData();
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      router.push('/');
    }
  };

  return (
    <nav className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FL</span>
          </div>
          <span className="text-xl font-bold text-gray-800">F Learning</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Nền tảng học tập trực tuyến</span>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Trang chủ
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Khóa học
          </Link>
          <Link href="/create-learning-path" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Lộ trình học tập
          </Link>
          <Link href="/blogs" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Bài viết
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Giới thiệu
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Liên hệ
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </div>
                  </Link>
                  <Link
                    href="/my-learning-path"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span>Lộ trình học tập</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng xuất</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/courses"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Khóa học
            </Link>
            <Link
              href="/create-learning-path"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lộ trình học tập
            </Link>
            <Link
              href="/blogs"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bài viết
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>

            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <Link
                  href="/profile"
                  className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  href="/my-learning-path"
                  className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Lộ trình học tập
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 text-left text-red-600 hover:text-red-700 font-medium transition-colors w-full"
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