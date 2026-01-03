"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; isPremium?: boolean }[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học" },
  { href: "/documents", label: "Tài liệu" },
  { href: "/blogs", label: "Bài viết" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/pricing", label: "Nâng cấp", isPremium: true },
];

interface NavLinksProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function NavLinks({ mobile, onItemClick }: NavLinksProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <div className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 ${
                item.isPremium 
                  ? "text-amber-600 font-medium flex items-center gap-1.5" 
                  : isActive 
                  ? "text-accent font-medium" 
                  : "text-gray-700 hover:text-accent"
              }`}
              onClick={onItemClick}
            >
              {item.isPremium && <span>✨</span>}
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-8">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`font-medium transition-colors ${
              item.isPremium
                ? "text-amber-600 hover:text-amber-700 flex items-center gap-1"
                : isActive 
                ? "text-accent border-b-2 border-accent pb-2" 
                : "text-gray-700 dark:text-gray-300 hover:text-accent"
            }`}
          >
            {item.isPremium && <span>✨</span>}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
