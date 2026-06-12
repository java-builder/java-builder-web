"use client";

import { useRouter } from "next/navigation";
import { ShieldX, RotateCcw, LogIn, Home } from "lucide-react";

export default function UnauthorizedModal() {
  const router = useRouter();

  const handleReload = () => {
    window.location.reload();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-5">
          <ShieldX className="h-7 w-7 text-red-500" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không đủ quyền truy cập
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập trang này.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Tải lại trang
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </button>

            <button
              onClick={handleHome}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="h-4 w-4" />
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
