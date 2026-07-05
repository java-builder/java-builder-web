"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import UnauthorizedModal from "./UnauthorizedModal";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasAdminAccess, checkAdmin } = useAuth();
  const { isLoading: userLoading, isError: userError } = useCurrentUser();
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    if (requireAdmin && isAuthenticated && !isLoading) {
      checkAdmin().finally(() => setAdminChecked(true));
    }
  }, [requireAdmin, isAuthenticated, isLoading, checkAdmin]);

  const renderDashboardSkeleton = () => (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-gray-200 dark:border-slate-800 p-5 space-y-6 hidden md:block animate-pulse">
        <div className="h-8 bg-muted rounded w-2/3 mb-10" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-muted" />
              <div className="h-4 bg-muted rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
      {/* Content area skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="w-10 h-10 rounded-full bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
        <div className="bg-card border border-border rounded-xl p-6 h-96 animate-pulse" />
      </div>
    </div>
  );

  if (isLoading || userLoading) {
    return renderDashboardSkeleton();
  }

  // Nếu chưa đăng nhập hoặc có lỗi thông tin user, hiển thị luôn UnauthorizedModal mà không cần chờ checkAdmin
  if (!isAuthenticated || userError) {
    return <UnauthorizedModal />;
  }

  if (requireAdmin && !adminChecked) {
    return renderDashboardSkeleton();
  }

  if (requireAdmin && !hasAdminAccess) {
    return <UnauthorizedModal />;
  }

  return <>{children}</>;
}
