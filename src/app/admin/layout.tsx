"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminNotificationDropdown from "@/components/admin/AdminNotificationDropdown";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Logo from "@/components/header-components/Logo";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Trang chủ",
    href: "/admin",
    color: "text-blue-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
        />
      </svg>
    ),
  },
  {
    name: "Về trang người dùng",
    href: "/",
    color: "text-indigo-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Quản lý người dùng",
    href: "/admin/users",
    color: "text-teal-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 11a4 4 0 11-8 0 4 4 0 018 0zM7 11a3 3 0 100-6 3 3 0 000 6zM2 20v-1c0-2.761 3.134-5 7-5h6c3.866 0 7 2.239 7 5v1"
        />
      </svg>
    ),
  },
  {
    name: "Khóa học",
    href: "/admin/courses",
    color: "text-orange-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    name: "Thông báo",
    href: "/admin/notifications",
    color: "text-pink-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1"
        />
      </svg>
    ),
  },
  {
    name: "Gửi thông báo",
    href: "/admin/notifications/send",
    color: "text-rose-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2 21l21-9L2 3v7l15 2-15 2v7z"
        />
      </svg>
    ),
  },
  {
    name: "Quản lý đăng nhập",
    href: "/admin/sessions",
    color: "text-emerald-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 11c2.761 0 5-2.239 5-5S14.761 1 12 1 7 3.239 7 6s2.239 5 5 5zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"
        />
      </svg>
    ),
  },
  {
    name: "Danh mục",
    href: "/admin/categories",
    color: "text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    name: "Quản lý bài viết",
    href: "/admin/blogs",
    color: "text-violet-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    name: "Bình luận",
    href: "/admin/comments",
    color: "text-purple-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
  },
  {
    name: "Quản lý tài liệu",
    href: "/admin/documents",
    color: "text-amber-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    name: "Gói Premium",
    href: "/admin/subscriptions",
    color: "text-yellow-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    name: "Báo cáo",
    href: "/admin/reports",
    color: "text-cyan-600",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    color: "text-slate-500",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
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
        <div className="h-screen flex bg-gray-50 overflow-hidden">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          )}

          {/* Sidebar - Fixed */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col`}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              {/* Logo */}
              <div className="relative flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 flex-shrink-0">
                <Logo />

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation - Scrollable */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                        ? `bg-blue-50 border-r-2 ${item.color.replace('text-', 'border-').replace('500', '600').replace('600', '600')} ${item.color}`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span
                        className={`mr-3 ${isActive ? item.color : item.color || "text-gray-400"}`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User profile - Fixed at bottom */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {currentUser?.avatar ? (
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.username || "Avatar"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-white font-medium">
                        {currentUser?.username?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser?.username || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || "admin@JavaBuilder.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Đăng xuất"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top header - Fixed */}
            <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
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
                  <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">
                    {navigation.find((item) => item.href === pathname)
                      ?.name || "Dashboard"}
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <AdminNotificationDropdown />
                </div>
              </div>
            </header>

            {/* Page content - Scrollable */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
