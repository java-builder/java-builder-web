"use client";

import { useState } from "react";
import { UserSessionDetailResponse } from "@/types/userSession";
import { formatReadableDate } from "@/utils/dateUtils";
import { useConfirm } from "@/hooks/useConfirm";
import { useUserSessions, useRevokeSession } from "@/hooks/useUserSessions";

export default function SessionsTab() {
  const [page, setPage] = useState(1);
  const { confirm } = useConfirm();
  
  const { data, isLoading } = useUserSessions(page, 10);
  const revokeSessionMutation = useRevokeSession();

  const sessions = data?.sessions || [];
  const totalPages = data?.totalPages || 0;

  const handleRevokeSession = async (sessionId: string) => {
    await confirm(async () => {
      await revokeSessionMutation.mutateAsync(sessionId);
    }, {
      title: "Thu hồi phiên đăng nhập",
      message: "<div>Bạn có chắc muốn thu hồi phiên đăng nhập này?<br/><strong>Thiết bị này sẽ bị đăng xuất ngay lập tức.</strong></div>",
      confirmText: "Thu hồi",
      cancelText: "Hủy",
      type: "warning",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device?.toLowerCase().includes("mobile")) {
      return (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (device?.toLowerCase().includes("tablet")) {
      return (
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Đang hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-red-500"></span>
        Đã thu hồi
      </span>
    );
  };

  const getProviderInfo = (provider: string) => {
    const providerMap: Record<string, { name: string; icon: React.ReactNode }> = {
      GOOGLE: {
        name: 'Google',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21.6 12.227c0-.68-.06-1.336-.176-1.958H12v3.71h5.44c-.234 1.228-.93 2.27-1.976 2.966v2.466h3.19c1.88-1.744 2.97-4.307 2.97-7.184z" fill="#EA4335"/>
            <path d="M12 21.6c2.56 0 4.7-.852 6.28-2.18l-3.19-2.466c-.874.588-1.99.94-3.09.94-2.38 0-4.4-1.605-5.12-3.765H2.64v2.36C4.22 19.86 7.86 21.6 12 21.6z" fill="#34A853"/>
            <path d="M6.88 14.24a5.2 5.2 0 01-.36-2.24c0-.78.12-1.53.36-2.24V7.06H2.64C1.93 8.86 1.6 10.78 1.6 12.72c0 1.94.33 3.86 1.04 5.66l3.24-2.14z" fill="#FBBC05"/>
            <path d="M12 4.64c1.12 0 2.18.384 3 1.12l2.24-2.24C16.66 2.08 14.56 1.2 12 1.2 7.86 1.2 4.22 2.94 2.64 5.94l3.24 2.36C7.6 6.245 9.62 4.64 12 4.64z" fill="#4285F4"/>
          </svg>
        )
      },
      GITHUB: {
        name: 'GitHub',
        icon: (
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-gray-900 dark:text-white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )
      },
      LINKEDIN: {
        name: 'LinkedIn',
        icon: (
          <svg width="16" height="16" fill="#0A66C2" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      },
      USERNAME_PASSWORD: {
        name: 'Mật khẩu',
        icon: (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-600 dark:text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )
      }
    };

    return providerMap[provider] || { name: provider, icon: null };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lịch sử đăng nhập</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Quản lý các phiên đăng nhập của bạn trên các thiết bị khác nhau
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Không có phiên đăng nhập nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: UserSessionDetailResponse) => (
              <div
                key={session.sessionId}
                className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-accent dark:hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex-shrink-0">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {session.browser} {session.browserVersion && `v${session.browserVersion}`}
                        </h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{session.device} • {session.os}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{session.ipAddress}</span>
                        </div>
                        {session.provider && (
                          <div className="flex items-center gap-2">
                            {getProviderInfo(session.provider).icon}
                            <span>Đăng nhập qua {getProviderInfo(session.provider).name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          <svg className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatReadableDate(session.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {session.status === "ACTIVE" && (
                    <button
                      onClick={() => handleRevokeSession(session.sessionId)}
                      className="flex-shrink-0 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                    >
                      Thu hồi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
