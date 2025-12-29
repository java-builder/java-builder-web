"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Trang chủ",
    href: "/admin",
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
    name: "Quản lý người dùng",
    href: "/admin/users",
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
    name: "Tin nhắn",
    href: "/admin/messages",
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    name: "Thông báo",
    href: "/admin/notifications",
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
    name: "Quản lý đăng nhập",
    href: "/admin/sessions",
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
    name: "Quản lý bài viết",
    href: "/admin/blogs",
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
    name: "Báo cáo",
    href: "/admin/reports",
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute requireAdmin={true}>
        <>
          <style jsx global>{`
            @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");

            .swal-compact {
              border-radius: 16px !important;
              box-shadow:
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
              border: 1px solid rgba(255, 255, 255, 0.1) !important;
              backdrop-filter: blur(10px) !important;
            }
            .swal-title {
              font-size: 17px !important;
              font-weight: 700 !important;
              color: #1f2937 !important;
              margin-bottom: 12px !important;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }
            .swal-text {
              font-size: 13px !important;
              color: #4b5563 !important;
              margin-bottom: 20px !important;
              line-height: 1.5 !important;
            }
            .swal-actions {
              gap: 10px !important;
              margin-top: 20px !important;
            }
            .swal-button {
              border-radius: 8px !important;
              padding: 10px 20px !important;
              font-size: 13px !important;
              font-weight: 600 !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              border: none !important;
              cursor: pointer !important;
              position: relative !important;
              overflow: hidden !important;
            }
            .swal-button:before {
              content: "" !important;
              position: absolute !important;
              top: 0 !important;
              left: -100% !important;
              width: 100% !important;
              height: 100% !important;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
              ) !important;
              transition: left 0.5s !important;
            }
            .swal-button:hover:before {
              left: 100% !important;
            }
            .swal-confirm {
              background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
              color: white !important;
              box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3) !important;
            }
            .swal-confirm:hover {
              background: linear-gradient(135deg, #b91c1c, #991b1b) !important;
              transform: translateY(-2px) scale(1.02) !important;
              box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4) !important;
            }
            .swal-confirm:active {
              transform: translateY(0) scale(0.98) !important;
            }
            .swal-cancel {
              background: linear-gradient(135deg, #f9fafb, #f3f4f6) !important;
              color: #374151 !important;
              border: 1px solid #d1d5db !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            .swal-cancel:hover {
              background: linear-gradient(135deg, #f3f4f6, #e5e7eb) !important;
              transform: translateY(-1px) scale(1.02) !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }
            .swal-cancel:active {
              transform: translateY(0) scale(0.98) !important;
            }
          `}</style>
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "13px",
                padding: "8px 12px",
                minHeight: "40px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          />
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
                <div className="relative flex items-center justify-between h-16 px-6 bg-gradient-to-r from-accent via-blue-600 to-blue-700 flex-shrink-0 overflow-hidden">
                  {/* Animated background particles */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-6 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-4 left-16 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
                    <div className="absolute bottom-2 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
                  </div>

                  <Link
                    href="/admin"
                    className="group flex items-center space-x-3 relative z-10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z"
                            />
                          </svg>
                        </div>
                      </div>

                      <svg
                        viewBox="0 0 24 24"
                        className="absolute -inset-1 w-12 h-12 text-accent pointer-events-none spin-accent-strong"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeDasharray="31.4 31.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg tracking-wide transition-all duration-300 group-hover:text-blue-100">
                        F-Learning
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden relative z-10 p-2 text-white hover:text-blue-200 hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-110"
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

                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-50 text-accent border-r-2 border-accent"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`mr-3 ${isActive ? "text-accent" : "text-gray-400"}`}
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
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        admin@flearning.com
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
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
                    <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg">
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
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
    </AuthProvider>
  );
}
