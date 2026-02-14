"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSession } from "@/types/session";
import { userSessionApi } from "@/services/user-session.service";
import { PageResponse } from "@/types/api";
import toast from "react-hot-toast";
import { SessionsHeader } from "@/components/admin/sessions/SessionsHeader";
import { SessionsSearchBar } from "@/components/admin/sessions/SessionsSearchBar";
import { SessionTableRow } from "@/components/admin/sessions/SessionTableRow";
import { SessionDetailModal } from "@/components/admin/sessions/SessionDetailModal";
import { RevokeSessionModal } from "@/components/admin/sessions/RevokeSessionModal";
import { RevokeAllSessionsModal } from "@/components/admin/sessions/RevokeAllSessionsModal";
import { Pagination } from "@/components/ui/Pagination";
  
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
  const [revokeUserTarget, setRevokeUserTarget] = useState<{ userId: string; username: string } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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

  const confirmRevokeAllUserSessions = async () => {
    if (!revokeUserTarget) return;
    setIsRevoking(true);
    try {
      await userSessionApi.revokeAllUserSessions(revokeUserTarget.userId);
      toast.success(`Đã thu hồi tất cả phiên đăng nhập của ${revokeUserTarget.username}`);
      fetchSessions();
    } catch {
      toast.error("Không thể thu hồi phiên đăng nhập");
    } finally {
      setIsRevoking(false);
      setRevokeUserTarget(null);
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

  const handleImageError = (sessionId: string) => {
    setImageErrors(prev => new Set(prev).add(sessionId));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <SessionsHeader />

      <SessionsSearchBar
        query={query}
        onSearch={handleSearch}
      />

      <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-4 dark:bg-slate-800 dark:ring-0 dark:border dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">
                <th className="px-4 py-3 min-w-[200px]">Người dùng</th>
                <th className="px-4 py-3">Nguồn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 min-w-[140px]">Trình duyệt</th>
                <th className="px-4 py-3 min-w-[120px]">Thiết bị</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3 min-w-[140px]">Thời gian</th>
                <th className="px-4 py-3 text-center min-w-[80px]">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
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
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {query ? "Không tìm thấy phiên đăng nhập phù hợp" : "Không có phiên đăng nhập nào"}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <SessionTableRow
                    key={s.sessionId}
                    session={s}
                    imageErrors={imageErrors}
                    onImageError={handleImageError}
                    onViewDetails={setViewSession}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemName="phiên"
        />
      )}

      {viewSession && (
        <SessionDetailModal
          session={viewSession}
          imageErrors={imageErrors}
          onImageError={handleImageError}
          onClose={() => setViewSession(null)}
          onRevokeSession={setRevokeTarget}
          onRevokeAllSessions={(userId, username) => setRevokeUserTarget({ userId, username })}
        />
      )}

      {revokeTarget && (
        <RevokeSessionModal
          session={revokeTarget}
          isRevoking={isRevoking}
          onConfirm={confirmRevoke}
          onClose={() => setRevokeTarget(null)}
        />
      )}

      {revokeUserTarget && (
        <RevokeAllSessionsModal
          userId={revokeUserTarget.userId}
          username={revokeUserTarget.username}
          isRevoking={isRevoking}
          onConfirm={confirmRevokeAllUserSessions}
          onClose={() => setRevokeUserTarget(null)}
        />
      )}
    </div>
  );
}
