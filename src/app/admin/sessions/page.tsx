"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSession } from "@/types/session";
import { userSessionApi } from "@/services/user-session.service";
import { PageResponse } from "@/types/api";
import toast from "react-hot-toast";


const getProviderBadge = (provider: string) => {
  const p = (provider || "").toUpperCase();
  switch (p) {
    case 'GOOGLE':
      return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M21.6 12.227c0-.68-.06-1.336-.176-1.958H12v3.71h5.44c-.234 1.228-.93 2.27-1.976 2.966v2.466h3.19c1.88-1.744 2.97-4.307 2.97-7.184z" fill="#EA4335"/>
            <path d="M12 21.6c2.56 0 4.7-.852 6.28-2.18l-3.19-2.466c-.874.588-1.99.94-3.09.94-2.38 0-4.4-1.605-5.12-3.765H2.64v2.36C4.22 19.86 7.86 21.6 12 21.6z" fill="#34A853"/>
            <path d="M6.88 14.24a5.2 5.2 0 01-.36-2.24c0-.78.12-1.53.36-2.24V7.06H2.64C1.93 8.86 1.6 10.78 1.6 12.72c0 1.94.33 3.86 1.04 5.66l3.24-2.14z" fill="#FBBC05"/>
            <path d="M12 4.64c1.12 0 2.18.384 3 1.12l2.24-2.24C16.66 2.08 14.56 1.2 12 1.2 7.86 1.2 4.22 2.94 2.64 5.94l3.24 2.36C7.6 6.245 9.62 4.64 12 4.64z" fill="#4285F4"/>
          </svg>
          Google
        </span>
      );
    case 'GITHUB':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          GitHub
        </span>
      );
    case 'LINKEDIN':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="3" fill="#0A66C2" />
            <path d="M6.94 8.5h2.22v8.5H6.94v-8.5zM7.99 6.94a1.28 1.28 0 110-2.56 1.28 1.28 0 010 2.56zM13.56 12.06c0-1.62.03-3.69-2.41-3.69-2.43 0-2.8 1.9-2.8 3.64v4.49h2.22v-4.02c0-.74.02-1.68 1.03-1.68 1 0 1.03.96 1.03 1.73v3.97h2.22v-4.44z" fill="#fff"/>
          </svg>
          LinkedIn
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          {provider ? provider : 'Tài khoản hệ thống'}
        </span>
      );
  }
};

const getStatusBadge = (status: string) => {
  const isActive = status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-500/10 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700"
      : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
      }`}>
      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"} hidden sm:inline-block`}></span>
      <span className="ml-0.5">{isActive ? "Đang hoạt động" : "Đã thu hồi"}</span>
    </span>
  );
};

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [pagination, setPagination] = useState<PageResponse<UserSession> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewSession, setViewSession] = useState<UserSession | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<UserSession | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userSessionApi.getUserSessions({
        page: currentPage,
        size: pageSize,
        filters: filters.trim() || undefined,
      });
      if (response && response.data) {
        setSessions(response.data.data || []);
        setPagination(response.data);
      } else {
        setSessions([]);
        setPagination(null);
      }
    } catch {
      toast.error("Không thể tải danh sách phiên đăng nhập");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchSessions();
  }, [currentPage, filters, fetchSessions]);

  const getPages = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = currentPage;
    const delta = 2; // pages around current
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);
    const pages: (number | string)[] = [];

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total) {
      if (right < total - 1) pages.push("right-ellipsis");
      pages.push(total);
    }

    return pages;
  };

  const revokeSession = (sessionId: string) => {
    const target = sessions.find((s) => s.sessionId === sessionId) || null;
    setRevokeTarget(target);
  };

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      await userSessionApi.revokeSession(revokeTarget.sessionId);
      toast.success("Phiên đăng nhập đã được thu hồi thành công");
      fetchSessions();
    } catch {
      toast.error("Không thể thu hồi phiên đăng nhập");
    } finally {
      setIsRevoking(false);
      setRevokeTarget(null);
    }
  };

  const filtered = sessions.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.browser.toLowerCase().includes(q) ||
      s.ipAddress.includes(q) ||
      s.device.toLowerCase().includes(q) ||
      s.os.toLowerCase().includes(q)
    );
  });

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      setFilters(searchTerm.trim());
    } else {
      setFilters("");
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý phiên đăng nhập
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi và quản lý bảo mật cho các phiên truy cập hệ thống.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md">
          <div className="relative flex-1 group">
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
              aria-label="Tìm kiếm phiên"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
          <button
            onClick={async () => {
              setIsExporting(true);
              const rows = filtered.map((s) => ({
                sessionId: s.sessionId,
                status: s.status === 'ACTIVE' ? "Hoạt động" : "Đã thu hồi",
                provider: s.provider || "Tài khoản hệ thống",
                userId: s.userId,
                browser: s.browser,
                browserVersion: s.browserVersion,
                os: s.os,
                device: s.device,
                ipAddress: s.ipAddress,
                createdAt: new Date(s.createdAt).toLocaleString("vi-VN"),
              }));
              const csvHeader = Object.keys(rows[0]).join(",") + "\n";
              const csvBody = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const csv = csvHeader + csvBody;
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `sessions_export_${new Date().toISOString()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              setIsExporting(false);
            }}
            className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm dark:from-slate-700 dark:to-slate-800 dark:border-slate-600 dark:text-white dark:hover:from-slate-600 dark:hover:to-slate-700"
            disabled={isExporting}
          >
            {isExporting ? (
              <svg className="w-4 h-4 animate-spin text-accent-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-4 dark:bg-slate-800 dark:ring-0 dark:border dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">
                <th className="px-6 py-3">Nguồn đăng nhập</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Trình duyệt</th>
                <th className="px-4 py-3">Thiết bị</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {query ? "Không tìm thấy phiên đăng nhập phù hợp" : "Không có phiên đăng nhập nào"}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-4 py-3 align-top">{getProviderBadge(s.provider)}</td>
                    <td className="px-4 py-3 align-top">{getStatusBadge(s.status)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top">{s.browser} {s.browserVersion}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top">{s.device} · {s.os}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top">{s.ipAddress}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 align-top">{new Date(s.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewSession(s)}
                          className="p-2 text-blue-600 bg-blue-100/50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:bg-slate-700/40 dark:hover:bg-slate-700 dark:text-blue-200"
                          title="Xem chi tiết"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {s.status === 'ACTIVE' ? (
                          <button
                            onClick={() => revokeSession(s.sessionId)}
                            className="p-2 text-red-600 bg-red-100/50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200 dark:bg-slate-700/40 dark:hover:bg-slate-700 dark:text-red-300"
                            title="Thu hồi phiên"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <div className="p-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed border border-transparent" title="Đã thu hồi">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, pagination.totalElements)} trong tổng số {pagination.totalElements} phiên
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {getPages().map((p) => {
              if (typeof p === "string") {
                return (
                  <span key={p} className="min-w-[32px] h-8 px-2 text-sm rounded-lg font-medium flex items-center justify-center text-gray-400">
                    &hellip;
                  </span>
                );
              }

              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[32px] h-8 px-2 text-sm rounded-lg font-medium transition-colors ${currentPage === p
                    ? "bg-accent-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-accent-600"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* View session modal */}
      {viewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10" onClick={() => setViewSession(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-10 ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-0 dark:border dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết phiên đăng nhập</h3>
              </div>
              <button onClick={() => setViewSession(null)} className="p-2 text-gray-500 hover:text-gray-700 rounded-md bg-gray-50">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <div className="text-gray-500">Session ID</div>
                <div className="font-medium text-gray-800 font-mono text-xs">{viewSession.sessionId}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Nguồn</div>
                <div className="font-medium text-gray-800">{getProviderBadge(viewSession.provider)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Trạng thái</div>
                <div className="font-medium">{getStatusBadge(viewSession.status)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Trình duyệt</div>
                <div className="font-medium text-gray-800">{viewSession.browser} {viewSession.browserVersion}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Hệ điều hành</div>
                <div className="font-medium text-gray-800">{viewSession.os}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Thiết bị</div>
                <div className="font-medium text-gray-800">{viewSession.device}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">IP</div>
                <div className="font-medium text-gray-800">{viewSession.ipAddress}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Thời gian</div>
                <div className="font-medium text-gray-800">{new Date(viewSession.createdAt).toLocaleString("vi-VN")}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setViewSession(null)} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:text-white">Đóng</button>
              {viewSession.status === 'ACTIVE' && (
                <button onClick={() => { setRevokeTarget(viewSession); setViewSession(null); }} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md shadow hover:from-red-700 dark:from-red-600 dark:to-red-700">Thu hồi</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revoke confirm modal */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 backdrop-blur-sm bg-black/10" onClick={() => setRevokeTarget(null)} />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Xác nhận thu hồi phiên</h3>
                <p className="text-sm text-gray-500">Bạn sắp thu hồi phiên đăng nhập sau:</p>
              </div>
              <button onClick={() => setRevokeTarget(null)} className="p-1 text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="text-gray-500">Session ID</div>
                <div className="font-medium text-gray-800 font-mono text-xs break-all">{revokeTarget.sessionId}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">IP</div>
                <div className="font-medium text-gray-800">{revokeTarget.ipAddress}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Thiết bị</div>
                <div className="font-medium text-gray-800">{revokeTarget.device}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setRevokeTarget(null)} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Hủy</button>
              <button onClick={confirmRevoke} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md shadow">
                {isRevoking ? "Đang thu hồi..." : "Thu hồi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


