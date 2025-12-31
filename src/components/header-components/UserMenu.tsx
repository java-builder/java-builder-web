"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "@/services/auth.service";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      authApi.clearAuthData();
    }
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" data-dropdown>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center overflow-hidden">
          {currentUser?.avatar ? (
            <Image src={currentUser.avatar} alt="" width={36} height={36} className="w-full h-full object-cover" unoptimized />
          ) : (
            <span className="text-white font-semibold text-sm">{currentUser?.username?.[0]?.toUpperCase() || "U"}</span>
          )}
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" 
            onClick={() => setIsOpen(false)}
          >
            Thông tin cá nhân
          </Link>
          <Link 
            href="/favorites" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" 
            onClick={() => setIsOpen(false)}
          >
            Khóa học yêu thích
          </Link>
          <div className="border-t border-gray-200 my-1" />
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
