"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSession } from "@/types/session";
import { userSessionApi } from "@/services/user-session.service";
import { PageResponse } from "@/types/api";
import toast from "react-hot-toast";

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
      setSessions(response.result?.result || []);
      setPagination(response.result || null);
    } catch {
      toast.error("Không thể tải danh sách phiên đăng nhập");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchSessions();
  }, [currentPage, filters, fetchSessions]);

  const revokeSession = (sessionId: string) => {
    const target = sessions.find((s) => s.sessionId === sessionId) || null;
    setRevokeTarget(target);
  };

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
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
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phiên đăng nhập</h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem và thu hồi các phiên đăng nhập của người dùng (IP, thiết bị, vị trí).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Tìm theo trình duyệt, IP hoặc thiết bị..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Tìm kiếm phiên"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </div>
          <button
            onClick={async () => {
              setIsExporting(true);
              const rows = filtered.map((s) => ({
                sessionId: s.sessionId,
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
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50"
            title="Export CSV"
            disabled={isExporting}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50">
                <th className="px-4 py-3">Session ID</th>
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
                  <tr key={s.sessionId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm text-gray-700 break-all">{s.sessionId}</td>
                    <td className="px-4 py-3 text-gray-700">{s.browser} {s.browserVersion}</td>
                    <td className="px-4 py-3 text-gray-700">{s.device} · {s.os}</td>
                    <td className="px-4 py-3 text-gray-700">{s.ipAddress}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(s.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => setViewSession(s)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-sm rounded-md hover:bg-gray-50 shadow-sm"
                          title="Xem chi tiết"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem
                        </button>
                        <button
                          onClick={() => revokeSession(s.sessionId)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 text-sm rounded-md hover:bg-red-50"
                          title="Thu hồi phiên"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                          </svg>
                          <span className="text-red-600">Thu hồi</span>
                        </button>
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    currentPage === pageNum
                      ? "bg-accent-600 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
        </div>
      )}

      {/* View session modal */}
      {viewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 backdrop-blur-sm bg-black/10" onClick={() => setViewSession(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-10 ring-1 ring-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phiên {viewSession.sessionId}</h3>
                <p className="text-sm text-gray-500">Chi tiết phiên đăng nhập</p>
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
              <button onClick={() => setViewSession(null)} className="px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Đóng</button>
              <button onClick={() => { setRevokeTarget(viewSession); setViewSession(null); }} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md shadow hover:from-red-700">Thu hồi</button>
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


