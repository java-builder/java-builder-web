"use client";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminNotificationDropdown from "@/components/admin/AdminNotificationDropdown";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useI18n } from "@/contexts/I18nContext";
import Logo from "@/components/header-components/Logo";
import SidebarUserProfile from "@/components/sidebar/SidebarUserProfile";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  nameKey: string;
  href: string;
  colorKey: string;
  icon: ReactNode;
}

interface NavGroup {
  titleKey: string;
  borderColor: string;
  icon: ReactNode;
  items: NavItem[];
}

interface ColorTheme {
  iconActive: string;
  itemActiveText: string;
  itemActiveBg: string;
  itemHoverText: string;
  itemHoverBg: string;
  borderClass: string;
}

const colorThemes: Record<string, ColorTheme> = {
  blue: {
    iconActive: "text-blue-600 dark:text-blue-400",
    itemActiveText: "text-blue-700 dark:text-blue-300 font-semibold",
    itemActiveBg: "bg-blue-50 dark:bg-blue-950/30 border-r-2 border-blue-500",
    itemHoverText: "hover:text-blue-700 dark:hover:text-blue-300",
    itemHoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/10",
    borderClass: "border-blue-500",
  },
  indigo: {
    iconActive: "text-indigo-600 dark:text-indigo-400",
    itemActiveText: "text-indigo-700 dark:text-indigo-300 font-semibold",
    itemActiveBg: "bg-indigo-50 dark:bg-indigo-950/30 border-r-2 border-indigo-500",
    itemHoverText: "hover:text-indigo-700 dark:hover:text-indigo-300",
    itemHoverBg: "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10",
    borderClass: "border-indigo-500",
  },
  teal: {
    iconActive: "text-teal-600 dark:text-teal-400",
    itemActiveText: "text-teal-700 dark:text-teal-300 font-semibold",
    itemActiveBg: "bg-teal-50 dark:bg-teal-950/30 border-r-2 border-teal-500",
    itemHoverText: "hover:text-teal-700 dark:hover:text-teal-300",
    itemHoverBg: "hover:bg-teal-50/50 dark:hover:bg-teal-950/10",
    borderClass: "border-teal-500",
  },
  emerald: {
    iconActive: "text-emerald-600 dark:text-emerald-400",
    itemActiveText: "text-emerald-700 dark:text-emerald-300 font-semibold",
    itemActiveBg: "bg-emerald-50 dark:bg-emerald-950/30 border-r-2 border-emerald-500",
    itemHoverText: "hover:text-emerald-700 dark:hover:text-emerald-300",
    itemHoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10",
    borderClass: "border-emerald-500",
  },
  purple: {
    iconActive: "text-purple-600 dark:text-purple-400",
    itemActiveText: "text-purple-700 dark:text-purple-300 font-semibold",
    itemActiveBg: "bg-purple-50 dark:bg-purple-950/30 border-r-2 border-purple-500",
    itemHoverText: "hover:text-purple-700 dark:hover:text-purple-300",
    itemHoverBg: "hover:bg-purple-50/50 dark:hover:bg-purple-950/10",
    borderClass: "border-purple-500",
  },
  green: {
    iconActive: "text-green-600 dark:text-green-400",
    itemActiveText: "text-green-700 dark:text-green-300 font-semibold",
    itemActiveBg: "bg-green-50 dark:bg-green-950/30 border-r-2 border-green-500",
    itemHoverText: "hover:text-green-700 dark:hover:text-green-300",
    itemHoverBg: "hover:bg-green-50/50 dark:hover:bg-green-950/10",
    borderClass: "border-green-500",
  },
  orange: {
    iconActive: "text-orange-600 dark:text-orange-400",
    itemActiveText: "text-orange-700 dark:text-orange-300 font-semibold",
    itemActiveBg: "bg-orange-50 dark:bg-orange-950/30 border-r-2 border-orange-500",
    itemHoverText: "hover:text-orange-700 dark:hover:text-orange-300",
    itemHoverBg: "hover:bg-orange-50/50 dark:hover:bg-orange-950/10",
    borderClass: "border-orange-500",
  },
  red: {
    iconActive: "text-red-600 dark:text-red-400",
    itemActiveText: "text-red-700 dark:text-red-300 font-semibold",
    itemActiveBg: "bg-red-50 dark:bg-red-950/30 border-r-2 border-red-500",
    itemHoverText: "hover:text-red-700 dark:hover:text-red-300",
    itemHoverBg: "hover:bg-red-50/50 dark:hover:bg-red-950/10",
    borderClass: "border-red-500",
  },
  fuchsia: {
    iconActive: "text-fuchsia-600 dark:text-fuchsia-400",
    itemActiveText: "text-fuchsia-700 dark:text-fuchsia-300 font-semibold",
    itemActiveBg: "bg-fuchsia-50 dark:bg-fuchsia-950/30 border-r-2 border-fuchsia-500",
    itemHoverText: "hover:text-fuchsia-700 dark:hover:text-fuchsia-300",
    itemHoverBg: "hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-950/10",
    borderClass: "border-fuchsia-500",
  },
  violet: {
    iconActive: "text-violet-600 dark:text-violet-400",
    itemActiveText: "text-violet-700 dark:text-violet-300 font-semibold",
    itemActiveBg: "bg-violet-50 dark:bg-violet-950/30 border-r-2 border-violet-500",
    itemHoverText: "hover:text-violet-700 dark:hover:text-violet-300",
    itemHoverBg: "hover:bg-violet-50/50 dark:hover:bg-violet-950/10",
    borderClass: "border-violet-500",
  },
  amber: {
    iconActive: "text-amber-600 dark:text-amber-400",
    itemActiveText: "text-amber-700 dark:text-amber-300 font-semibold",
    itemActiveBg: "bg-amber-50 dark:bg-amber-950/30 border-r-2 border-amber-500",
    itemHoverText: "hover:text-amber-700 dark:hover:text-amber-300",
    itemHoverBg: "hover:bg-amber-50/50 dark:hover:bg-amber-950/10",
    borderClass: "border-amber-500",
  },
  pink: {
    iconActive: "text-pink-600 dark:text-pink-400",
    itemActiveText: "text-pink-700 dark:text-pink-300 font-semibold",
    itemActiveBg: "bg-pink-50 dark:bg-pink-950/30 border-r-2 border-pink-500",
    itemHoverText: "hover:text-pink-700 dark:hover:text-pink-300",
    itemHoverBg: "hover:bg-pink-50/50 dark:hover:bg-pink-950/10",
    borderClass: "border-pink-500",
  },
  rose: {
    iconActive: "text-rose-600 dark:text-rose-400",
    itemActiveText: "text-rose-700 dark:text-rose-300 font-semibold",
    itemActiveBg: "bg-rose-50 dark:bg-rose-950/30 border-r-2 border-rose-500",
    itemHoverText: "hover:text-rose-700 dark:hover:text-rose-300",
    itemHoverBg: "hover:bg-rose-50/50 dark:hover:bg-rose-950/10",
    borderClass: "border-rose-500",
  },
  cyan: {
    iconActive: "text-cyan-600 dark:text-cyan-400",
    itemActiveText: "text-cyan-700 dark:text-cyan-300 font-semibold",
    itemActiveBg: "bg-cyan-50 dark:bg-cyan-950/30 border-r-2 border-cyan-500",
    itemHoverText: "hover:text-cyan-700 dark:hover:text-cyan-300",
    itemHoverBg: "hover:bg-cyan-50/50 dark:hover:bg-cyan-950/10",
    borderClass: "border-cyan-500",
  },
  yellow: {
    iconActive: "text-yellow-600 dark:text-yellow-400",
    itemActiveText: "text-yellow-700 dark:text-yellow-300 font-semibold",
    itemActiveBg: "bg-yellow-50 dark:bg-yellow-950/30 border-r-2 border-yellow-500",
    itemHoverText: "hover:text-yellow-700 dark:hover:text-yellow-300",
    itemHoverBg: "hover:bg-yellow-50/50 dark:hover:bg-yellow-950/10",
    borderClass: "border-yellow-500",
  },
  sky: {
    iconActive: "text-sky-600 dark:text-sky-400",
    itemActiveText: "text-sky-700 dark:text-sky-300 font-semibold",
    itemActiveBg: "bg-sky-50 dark:bg-sky-950/30 border-r-2 border-sky-500",
    itemHoverText: "hover:text-sky-700 dark:hover:text-sky-300",
    itemHoverBg: "hover:bg-sky-50/50 dark:hover:bg-sky-950/10",
    borderClass: "border-sky-500",
  },
  slate: {
    iconActive: "text-slate-500 dark:text-slate-400",
    itemActiveText: "text-slate-700 dark:text-slate-300 font-semibold",
    itemActiveBg: "bg-slate-100 dark:bg-slate-700/60 border-r-2 border-slate-500",
    itemHoverText: "hover:text-slate-700 dark:hover:text-slate-300",
    itemHoverBg: "hover:bg-slate-50 dark:hover:bg-slate-700/30",
    borderClass: "border-slate-500",
  },
};

const navGroups: NavGroup[] = [
  {
    titleKey: "admin.layout.groupOverview",
    borderColor: "border-blue-500",
    icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.home",
        href: "/admin",
        colorKey: "blue",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.backToUser",
        href: "/",
        colorKey: "indigo",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    titleKey: "admin.layout.groupUsers",
    borderColor: "border-teal-500",
    icon: (
      <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.users",
        href: "/admin/users",
        colorKey: "teal",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11a4 4 0 11-8 0 4 4 0 018 0zM7 11a3 3 0 100-6 3 3 0 000 6zM2 20v-1c0-2.761 3.134-5 7-5h6c3.866 0 7 2.239 7 5v1" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.roles",
        href: "/admin/roles",
        colorKey: "pink",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.sessions",
        href: "/admin/sessions",
        colorKey: "emerald",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.sessionsAnalytics",
        href: "/admin/sessions/analytics",
        colorKey: "indigo",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.activeUsers",
        href: "/admin/active-users",
        colorKey: "cyan",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11l2 2 4-4" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.userStreaks",
        href: "/admin/user-streaks",
        colorKey: "orange",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9.879z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.userSubscriptions",
        href: "/admin/user-subscriptions",
        colorKey: "purple",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.payments",
        href: "/admin/payments",
        colorKey: "green",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
    ],
  },
  {
    titleKey: "admin.layout.groupCourses",
    borderColor: "border-orange-500",
    icon: (
      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.courses",
        href: "/admin/courses",
        colorKey: "orange",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.exercises",
        href: "/admin/exercises",
        colorKey: "indigo",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.interviewTopics",
        href: "/admin/interview-topics",
        colorKey: "red",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.questionContributions",
        href: "/admin/question-contributions",
        colorKey: "fuchsia",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.qna",
        href: "/admin/qna",
        colorKey: "cyan",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.comments",
        href: "/admin/comments",
        colorKey: "purple",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.categories",
        href: "/admin/categories",
        colorKey: "emerald",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.tags",
        href: "/admin/tags",
        colorKey: "blue",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        ),
      },
    ],
  },
  {
    titleKey: "admin.layout.groupBlogs",
    borderColor: "border-violet-500",
    icon: (
      <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.blogs",
        href: "/admin/blogs",
        colorKey: "violet",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.documents",
        href: "/admin/documents",
        colorKey: "amber",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
    ],
  },
  {
    titleKey: "admin.layout.groupNotifications",
    borderColor: "border-pink-500",
    icon: (
      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.notifications",
        href: "/admin/notifications",
        colorKey: "pink",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.messages",
        href: "/admin/messages",
        colorKey: "sky",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.pushNotifications",
        href: "/admin/push-notifications",
        colorKey: "amber",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.828a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.emailTemplates",
        href: "/admin/email-templates",
        colorKey: "purple",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.emailMarketing",
        href: "/admin/notifications/send",
        colorKey: "rose",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    titleKey: "admin.layout.groupSystem",
    borderColor: "border-indigo-500",
    icon: (
      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: [
      {
        nameKey: "admin.layout.reports",
        href: "/admin/reports",
        colorKey: "cyan",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.subscriptions",
        href: "/admin/subscriptions",
        colorKey: "yellow",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.aiTraining",
        href: "/admin/ai-training",
        colorKey: "purple",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.scheduledJobs",
        href: "/admin/scheduled-jobs",
        colorKey: "sky",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.settings",
        href: "/admin/settings",
        colorKey: "slate",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        nameKey: "admin.layout.ipAccessRules",
        href: "/admin/ip-access-rules",
        colorKey: "red",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
  },
];


export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-sidebar-collapsed") === "true";
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  };

  const { data: currentUser } = useCurrentUser();
  const { t, isSwitching } = useI18n();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Initialize group states and auto-expand active group
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      // Auto-expand if any item in the group is active
      const hasActiveChild = group.items.some((item) => {
        if (item.href === "/admin") {
          return pathname === "/admin";
        }
        return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
      });
      initialState[group.titleKey] = hasActiveChild || true;
    });
    setOpenGroups(initialState);
  }, [pathname]);

  const toggleGroup = (groupTitleKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitleKey]: !prev[groupTitleKey],
    }));
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  const renderSidebarContent = (isCollapsedState: boolean, isDesktop: boolean) => {
    return (
      <div className="flex flex-col h-full">
        {/* Logo & Toggle Header */}
        <div className={`flex items-center p-4 border-b border-gray-200 dark:border-slate-700 ${isCollapsedState && isDesktop ? "lg:flex-col lg:gap-3 lg:justify-center" : "justify-between"}`}>
          {isCollapsedState && isDesktop ? (
            <Link href="/" className="hidden lg:flex items-center justify-center">
              <div className="relative w-9 h-9">
                <Image
                  src="/logos/java-logo.png"
                  alt="Java Builder"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </Link>
          ) : (
            <Logo hideText={false} />
          )}

          <div className="flex items-center gap-1.5">
            {isDesktop && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-750 dark:hover:text-white transition-colors text-gray-600 dark:text-gray-400 cursor-pointer"
                aria-label={isCollapsedState ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                {isCollapsedState ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            )}

            {!isDesktop && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className={`flex-1 py-4 space-y-3.5 overflow-y-auto ${isCollapsedState && isDesktop ? "px-1.5" : "px-2.5"}`}>
          {navGroups.map((group, groupIdx) => {
            const isOpen = (isCollapsedState && isDesktop) ? true : !!openGroups[group.titleKey];
            const hasActiveChild = group.items.some((item) => {
              if (item.href === "/admin") {
                return pathname === "/admin";
              }
              return (
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(`${item.href}/`) &&
                  !navGroups.some((g) =>
                    g.items.some((i) => i.href !== item.href && pathname.startsWith(i.href))
                  ))
              );
            });

            return (
              <div key={group.titleKey} className="space-y-1">
                {isCollapsedState && isDesktop && groupIdx > 0 && (
                  <div className="border-t border-gray-100 dark:border-slate-700/60 my-3.5 mx-2" />
                )}

                {/* Group Header Button */}
                {!(isCollapsedState && isDesktop) && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.titleKey)}
                    className={`group w-full flex items-center justify-between px-2 py-1.5 text-[10.5px] font-bold text-left uppercase tracking-wider transition-all duration-200 select-none rounded-lg ${hasActiveChild
                      ? "bg-slate-50 dark:bg-slate-800/40 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/20"
                      }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ${hasActiveChild
                        ? `${group.borderColor.replace('border-', 'bg-')}/10 dark:${group.borderColor.replace('border-', 'bg-')}/20`
                        : "bg-gray-100/70 dark:bg-slate-700/40 group-hover:bg-gray-200/80 dark:group-hover:bg-slate-700/60"
                        }`}>
                        {group.icon}
                      </div>
                      <span className="truncate pr-1">{t(group.titleKey as Parameters<typeof t>[0])}</span>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Group Items */}
                {isOpen && (
                  <div className={(isCollapsedState && isDesktop)
                    ? "space-y-1.5 flex flex-col items-center"
                    : `space-y-1 pl-2.5 ml-3 mt-1 border-l border-dashed ${group.borderColor} dark:border-opacity-35 border-opacity-25`
                  }>
                    {group.items.map((item) => {
                      const theme = colorThemes[item.colorKey] || colorThemes.blue;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href ||
                          (item.href !== "/" &&
                            pathname.startsWith(`${item.href}/`) &&
                            !navGroups.some((g) =>
                              g.items.some((i) => i.href !== item.href && pathname.startsWith(i.href))
                            ));

                      const label = t(item.nameKey as Parameters<typeof t>[0]);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={(isCollapsedState && isDesktop) ? label : undefined}
                          className={`group flex items-center transition-all duration-200 ${(isCollapsedState && isDesktop)
                            ? `justify-center w-12 h-12 rounded-xl ${isActive ? `${theme.itemActiveBg} border-r-0` : `text-gray-600 dark:text-gray-300 ${theme.itemHoverBg} ${theme.itemHoverText}`}`
                            : `px-2 py-1.5 text-[13px] font-medium rounded-md ${isActive ? `${theme.itemActiveBg} ${theme.itemActiveText}` : `text-gray-600 dark:text-gray-300 ${theme.itemHoverBg} ${theme.itemHoverText}`}`
                            }`}
                        >
                          <span
                            className={`flex-shrink-0 transition-all duration-200 ${(isCollapsedState && isDesktop) ? "" : "mr-2"} ${isActive
                              ? theme.iconActive
                              : `${theme.iconActive} opacity-40 group-hover:opacity-100`
                              }`}
                          >
                            <div className="w-4 h-4 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                              {item.icon}
                            </div>
                          </span>
                          {!(isCollapsedState && isDesktop) && <span className="truncate flex-1">{label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile - Fixed at bottom */}
        <div className={`border-t border-gray-200 dark:border-slate-700 flex-shrink-0 transition-all duration-300 ${(isCollapsedState && isDesktop) ? "p-3 flex justify-center" : "p-4"}`}>
          <SidebarUserProfile
            currentUser={currentUser || undefined}
            isCollapsed={isCollapsedState && isDesktop}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <>
        <style jsx global>{`
            @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");

            /* Modern SweetAlert2 Styles */
            .swal-modern-popup {
              border-radius: 16px !important;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
              border: none !important;
              padding: 0 !important;
            }
            .swal-modern-icon {
              margin: 2rem auto 1rem !important;
              border-width: 3px !important;
              width: 60px !important;
              height: 60px !important;
            }
            .swal-modern-icon.swal2-error {
              border-color: #fee2e2 !important;
              color: #ef4444 !important;
            }
            .swal-modern-icon.swal2-error [class^='swal2-x-mark-line'] {
              background-color: #ef4444 !important;
            }
            .swal-modern-icon.swal2-warning {
              border-color: #fef3c7 !important;
              color: #f59e0b !important;
            }
            .swal-modern-title {
              font-size: 18px !important;
              font-weight: 600 !important;
              color: #111827 !important;
              padding: 0 1.5rem !important;
              margin-bottom: 0.5rem !important;
            }
            .swal-modern-text {
              font-size: 14px !important;
              color: #6b7280 !important;
              padding: 0 1.5rem !important;
              margin: 0 !important;
              line-height: 1.5 !important;
            }
            .swal-modern-actions {
              padding: 1.5rem !important;
              gap: 12px !important;
              margin-top: 0.5rem !important;
            }
            .swal-modern-confirm {
              background: #ef4444 !important;
              color: white !important;
              border: none !important;
              border-radius: 10px !important;
              padding: 10px 20px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              cursor: pointer !important;
              transition: all 0.2s !important;
            }
            .swal-modern-confirm:hover {
              background: #dc2626 !important;
              transform: translateY(-1px) !important;
            }
            .swal-modern-confirm:focus {
              box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3) !important;
            }
            .swal-modern-cancel {
              background: #f3f4f6 !important;
              color: #374151 !important;
              border: none !important;
              border-radius: 10px !important;
              padding: 10px 20px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              cursor: pointer !important;
              transition: all 0.2s !important;
            }
            .swal-modern-cancel:hover {
              background: #e5e7eb !important;
            }
            .swal-modern-cancel:focus {
              box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2) !important;
            }
          `}</style>
        <div className="h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden relative" suppressHydrationWarning>
          {/* Fullscreen skeleton overlay khi đổi locale */}
          {isSwitching && (
            <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-slate-900 flex">
              {/* Sidebar skeleton */}
              <div className={`hidden lg:flex flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
                <div className={`h-16 border-b border-gray-100 dark:border-slate-700 flex items-center ${isCollapsed ? "px-4 justify-center" : "px-6"}`}>
                  <div className={`h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse ${isCollapsed ? "w-8" : "w-28"}`} />
                </div>
                <div className={`flex-1 space-y-2 py-6 ${isCollapsed ? "px-2" : "px-4"}`}>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className={`flex items-center rounded-lg ${isCollapsed ? "justify-center py-2" : "px-4 py-3"}`}>
                      <div className={`w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded animate-pulse ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <div className="h-4 flex-1 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />}
                    </div>
                  ))}
                </div>
                <div className={`border-t border-gray-200 dark:border-slate-700 ${isCollapsed ? "p-3 flex justify-center" : "p-4"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main area skeleton */}
              <div className="flex-1 flex flex-col">
                {/* Header skeleton */}
                <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 px-6 flex items-center justify-between flex-shrink-0">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="h-7 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-96 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-5 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          )}

          {/* Mobile Sidebar - Drawer style */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden flex flex-col`}
          >
            {renderSidebarContent(false, false)}
          </div>

          {/* Desktop Sidebar - Fixed height & transition width */}
          <aside
            className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-40 ${isCollapsed ? "w-20" : "w-64"}`}
          >
            {renderSidebarContent(isCollapsed, true)}
          </aside>

          {/* Main content area */}
          <div className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
            {/* Top header - Fixed */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
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
                  <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900 dark:text-white">
                    {(() => {
                      let currentItem: NavItem | undefined;
                      for (const group of navGroups) {
                        const found = group.items.find((item) => item.href === pathname);
                        if (found) {
                          currentItem = found;
                          break;
                        }
                      }
                      return currentItem
                        ? t(currentItem.nameKey as Parameters<typeof t>[0])
                        : t("admin.layout.dashboard");
                    })()}
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <LanguageSwitcher variant="minimal" />
                  <ThemeToggle />
                  <AdminNotificationDropdown />
                </div>
              </div>
            </header>

            {/* Page content - Scrollable */}
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
              {children}
            </main>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
