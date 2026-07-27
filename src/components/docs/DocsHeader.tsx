"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import { CourseDetailResponse } from "@/types/course";
import {
  BookOpen,
  LogIn,
  Menu
} from "lucide-react";

interface DocsHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  course?: CourseDetailResponse | null;
}

export default function DocsHeader({
  onMenuClick,
  showMenuButton = false,
  course
}: DocsHeaderProps) {
  const { data: currentUser, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 shadow-sm transition-all duration-250">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Hamburger menu (mobile), Logo & Branding */}
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <>
                <button
                  onClick={onMenuClick}
                  className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors focus:outline-none cursor-pointer"
                  aria-label="Mở mục lục"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="lg:hidden h-5 w-px bg-gray-200 dark:bg-slate-700" />
              </>
            )}

            <Link href="/docs" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-sky-400 transition-colors duration-150">
                Tài liệu hướng dẫn
              </h1>
            </Link>
          </div>

          {/* Center: Current Course Title */}
          {course && (
            <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-md lg:max-w-lg xl:max-w-2xl mx-6 px-4 py-1.5 bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-750/50 rounded-2xl">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
              </span>
              <div className="text-left min-w-0">
                <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
                  Khóa học đang học
                </p>
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-200 truncate mt-1 leading-tight" title={course.title}>
                  {course.title}
                </h2>
              </div>
            </div>
          )}

          {/* Right: Navigation links, Theme toggle & User profile */}
          <div className="flex items-center gap-3">
            {/* Global Nav Links - hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-1 mr-2 border-r border-gray-200 dark:border-slate-700/80 pr-4">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-slate-700/40 rounded-lg transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/courses"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-slate-700/40 rounded-lg transition-colors"
              >
                Khóa học
              </Link>
              <Link
                href="/exercises"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-slate-700/40 rounded-lg transition-colors"
              >
                Bài tập
              </Link>
              <Link
                href="/blogs"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-slate-700/40 rounded-lg transition-colors"
              >
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* User Profile Info */}
              {currentUser ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 pr-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 hover:border-accent hover:shadow-sm rounded-full transition-all duration-200"
                  title="Xem hồ sơ cá nhân"
                >
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      width={26}
                      height={26}
                      className="w-6.5 h-6.5 rounded-full object-cover border border-gray-150 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-6.5 h-6.5 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-[10px]">
                      {(currentUser.username || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-gray-700 dark:text-slate-200 max-w-[90px] truncate">
                    {currentUser.username}
                  </span>
                </Link>
              ) : !isLoading ? (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-600 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Đăng nhập</span>
                </Link>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
