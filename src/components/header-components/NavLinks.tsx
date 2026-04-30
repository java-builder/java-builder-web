"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";

const NAV_ITEMS_STATIC: { href: string; label: string; isPremium?: boolean; hasDropdown?: boolean; isDynamic?: boolean; icon?: string; dropdownItems?: { href: string; label: string; iconPath?: string; icon?: string }[] }[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học" },
  { 
    href: "/blogs", 
    label: "Bài viết",
    hasDropdown: true,
    dropdownItems: [
      { href: "/blogs", label: "Bài viết chia sẻ", icon: "article" },
      { href: "/docs", label: "Tài liệu hướng dẫn", icon: "document" },
      { href: "/documents", label: "Ebook", icon: "ebook" }
    ]
  },
  { 
    href: "/interview", 
    label: "Phỏng vấn",
    hasDropdown: true,
    isDynamic: true, 
  },
  // { href: "/qna", label: "Q&A" },
  { href: "/roadmap", label: "Lộ trình học tập", icon: "roadmap" },
  { href: "/contact", label: "Liên hệ", icon: "contact" },
  { href: "/pricing", label: "Membership", isPremium: true }
];

interface NavLinksProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function NavLinks({ mobile, onItemClick }: NavLinksProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { topics: interviewTopics, isLoading: isLoadingTopics } = useInterviewTopics();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getDropdownItems = (item: typeof NAV_ITEMS_STATIC[0]) => {
    if (item.isDynamic && item.href === "/interview") {
      return interviewTopics.map(topic => ({
        href: `/interview/${topic.slug}`,
        label: topic.name,
        iconPath: topic.thumbnailUrl || "/logos/logo-java.png",
      }));
    }
    if (item.dropdownItems) {
      return item.dropdownItems;
    }
    return [];
  };

  const hasDropdown = (item: typeof NAV_ITEMS_STATIC[0]) => {
    return item.hasDropdown === true;
  };

  const handleMouseEnter = (href: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(href);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  if (mobile) {
    return (
      <div className="space-y-2">
        {NAV_ITEMS_STATIC.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const dropdownItems = getDropdownItems(item);
          
          if (hasDropdown(item)) {
            return (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={`flex-1 py-2 flex items-center gap-2 ${
                      isActive ? "text-accent font-medium" : "text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={onItemClick}
                  >
                    {item.href === "/interview" ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : item.href === "/blogs" ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    ) : null}
                    {item.label}
                  </Link>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                    className="p-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.href ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {openDropdown === item.href && (
                  <div className="pl-4 space-y-2 mt-2">
                    {isLoadingTopics ? (
                      <div className="py-2 text-sm text-gray-500 dark:text-gray-400">
                        Đang tải...
                      </div>
                    ) : dropdownItems.length > 0 ? (
                      dropdownItems.map((dropItem) => (
                        <Link
                          key={dropItem.href}
                          href={dropItem.href}
                          className="block py-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors flex items-center gap-2"
                          onClick={onItemClick}
                        >
                          {dropItem.iconPath ? (
                            <div className="w-5 h-5 relative flex-shrink-0">
                              <Image
                                src={dropItem.iconPath}
                                alt={dropItem.label}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            </div>
                          ) : "icon" in dropItem && dropItem.icon === "article" ? (
                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          ) : "icon" in dropItem && dropItem.icon === "document" ? (
                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          ) : "icon" in dropItem && dropItem.icon === "ebook" ? (
                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          ) : null}
                          <span>{dropItem.label}</span>
                        </Link>
                      ))
                    ) : null}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 flex items-center gap-2 ${
                item.isPremium 
                  ? "text-amber-600 dark:text-amber-500 font-medium" 
                  : isActive 
                  ? "text-accent font-medium" 
                  : "text-gray-700 dark:text-gray-300 hover:text-accent"
              }`}
              onClick={onItemClick}
            >
              {item.isPremium && <span>✨</span>}
              {item.icon === "roadmap" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
              {item.icon === "contact" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-2">
      {NAV_ITEMS_STATIC.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        const dropdownItems = getDropdownItems(item);
        
        if (hasDropdown(item)) {
          return (
            <div
              key={item.href}
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => handleMouseEnter(item.href)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className={`font-medium transition-all flex items-center gap-1 py-2 px-3 rounded-lg ${
                  isActive 
                    ? "text-accent bg-accent/5" 
                    : "text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {item.href === "/interview" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : item.href === "/blogs" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                ) : null}
                {item.label}
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === item.href ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              
              {/* Dropdown Menu */}
              {openDropdown === item.href && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50"
                  onMouseEnter={() => handleMouseEnter(item.href)}
                  onMouseLeave={handleMouseLeave}
                >
                  {isLoadingTopics ? (
                    <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 text-center">
                      Đang tải...
                    </div>
                  ) : dropdownItems.length > 0 ? (
                    dropdownItems.map((dropItem) => (
                      <Link
                        key={dropItem.href}
                        href={dropItem.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-accent transition-colors"
                      >
                        {dropItem.iconPath ? (
                          <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                              src={dropItem.iconPath}
                              alt={dropItem.label}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                        ) : "icon" in dropItem && dropItem.icon === "article" ? (
                          <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        ) : "icon" in dropItem && dropItem.icon === "document" ? (
                          <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        ) : "icon" in dropItem && dropItem.icon === "ebook" ? (
                          <svg className="w-5 h-5 text-gray-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        ) : null}
                        <span>{dropItem.label}</span>
                      </Link>
                    ))
                  ) : null}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`font-medium transition-all flex items-center gap-2 py-2 px-3 rounded-lg ${
              item.isPremium
                ? "text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                : isActive 
                ? "text-accent bg-accent/5" 
                : "text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-slate-800"
            }`}
          >
            {item.isPremium && <span>✨</span>}
            {item.icon === "roadmap" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            )}
            {item.icon === "contact" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
