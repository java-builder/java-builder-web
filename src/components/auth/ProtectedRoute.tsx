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

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập hoặc có lỗi thông tin user, hiển thị luôn UnauthorizedModal mà không cần chờ checkAdmin
  if (!isAuthenticated || userError) {
    return <UnauthorizedModal />;
  }

  if (requireAdmin && !adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !hasAdminAccess) {
    return <UnauthorizedModal />;
  }

  return <>{children}</>;
}
