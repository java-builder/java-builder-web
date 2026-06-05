"use client";

import { useState, useEffect, useCallback } from "react";
import { UserSession } from "@/types/session";
import { userSessionApi } from "@/services/user-session.service";
import { PageResponse } from "@/types/api";
import toast from "react-hot-toast";
import { SessionsHeader } from "@/components/admin/sessions/SessionsHeader";
import { SessionsSearchBar } from "@/components/admin/sessions/SessionsSearchBar";
import { SessionsTable } from "@/components/admin/sessions/SessionsTable";
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

  const handleClearSearch = () => {
    setQuery("");
    setFilters("");
    setCurrentPage(1);
  };

  const handleImageError = (sessionId: string) => {
    setImageErrors((prev) => new Set(prev).add(sessionId));
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <SessionsHeader totalCount={pagination?.totalElements ?? 0} />

      <SessionsSearchBar
        query={query}
        onChange={handleSearch}
        onClear={handleClearSearch}
      />

      <SessionsTable
        sessions={filtered}
        isLoading={isLoading}
        totalElements={pagination?.totalElements ?? 0}
        hasFilter={query.length > 0}
        imageErrors={imageErrors}
        onImageError={handleImageError}
        onViewDetails={setViewSession}
      />

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
