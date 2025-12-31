"use client";

import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-2">
      <Link 
        href="/login" 
        className="px-3 py-1.5 text-sm text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Đăng nhập
      </Link>
      <Link 
        href="/register" 
        className="px-4 py-1.5 bg-accent hover:bg-accent-600 text-white rounded-md text-sm font-medium shadow-sm"
      >
        Đăng ký
      </Link>
    </div>
  );
}
