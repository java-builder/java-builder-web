"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, GraduationCap } from "lucide-react";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useI18n } from "@/contexts/I18nContext";
import Image from "next/image";

export default function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { data: currentUser } = useCurrentUser();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`relative z-30 w-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-colors ${
        isHome
          ? "bg-transparent"
          : "bg-white dark:bg-[#0f1117] border-b border-[#E8E8E8] dark:border-[#222738]"
      }`}
    >
      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Search input with smooth pill styling */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("home.searchPlaceholder") || "Tìm kiếm khóa học, bài viết, chủ đề..."}
              className="w-full h-10 pl-11 pr-5 rounded-full border border-[#E8E8E8]/90 dark:border-[#262d3d] bg-white/95 dark:bg-[#181d28]/95 text-sm text-[#171717] dark:text-slate-100 placeholder-[#64748B] dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] shadow-2xs transition-all"
            />
          </div>
        </form>

        {/* Right side controls: ThemeToggle + LanguageSwitcher + Divider + Auth */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <ThemeToggle variant="default" />
          <LanguageSwitcher variant="ghost" showLabel={true} />

          {/* Thin Vertical Divider Line */}
          <div className="h-5 w-px mx-0.5 bg-slate-200 dark:bg-slate-700" />

          {currentUser ? (
            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-[#171717] dark:text-white"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FF5A1F] flex items-center justify-center border-2 border-white/50 shadow-xs">
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
              <span className="hidden sm:inline text-xs font-semibold tracking-wide text-[#171717] dark:text-white">
                {currentUser.username}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#FF5A1F] hover:bg-[#e04b16] text-white rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 flex-shrink-0"
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
