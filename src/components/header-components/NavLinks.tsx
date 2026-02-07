"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { interviewService } from "@/services/interview.service";
import { InterviewTopicDetailResponse } from "@/types/interview";

const NAV_ITEMS_STATIC: { href: string; label: string; isPremium?: boolean; hasDropdown?: boolean; isDynamic?: boolean }[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học" },
  { href: "/documents", label: "Tài liệu" },
  { href: "/blogs", label: "Bài viết" },
  { 
    href: "/interview", 
    label: "Phỏng vấn",
    hasDropdown: true,
    isDynamic: true, // Flag to load from API
  },
  { href: "/qna", label: "Q&A" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/pricing", label: "Nâng cấp", isPremium: true },
];

interface NavLinksProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function NavLinks({ mobile, onItemClick }: NavLinksProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [interviewTopics, setInterviewTopics] = useState<InterviewTopicDetailResponse[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchInterviewTopics = async () => {
      try {
        const response = await interviewService.getAllTopics();
        setInterviewTopics(response.data?.topics || []);
      } catch (error) {
        console.error("Failed to fetch interview topics:", error);
        // Fallback: set empty array on error
        setInterviewTopics([]);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchInterviewTopics();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Build dropdown items from API data
  const getDropdownItems = (item: typeof NAV_ITEMS_STATIC[0]) => {
    if (item.isDynamic && item.href === "/interview") {
      return interviewTopics.map(topic => ({
        href: `/interview/${topic.slug}`,
        label: topic.name,
        iconPath: topic.iconPath || "/logos/logo-java.png",
      }));
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
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                  className={`w-full text-left py-2 flex items-center justify-between ${
                    isActive ? "text-accent font-medium" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {item.label}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === item.href ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
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
                          <div className="w-5 h-5 relative flex-shrink-0">
                            <Image
                              src={dropItem.iconPath}
                              alt={dropItem.label}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
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
              className={`block py-2 ${
                item.isPremium 
                  ? "text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1.5" 
                  : isActive 
                  ? "text-accent font-medium" 
                  : "text-gray-700 dark:text-gray-300 hover:text-accent"
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
                className={`font-medium transition-colors flex items-center gap-1 py-2 ${
                  isActive 
                    ? "text-accent" 
                    : "text-gray-700 dark:text-gray-300 hover:text-accent"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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
                        <div className="w-5 h-5 relative flex-shrink-0">
                          <Image
                            src={dropItem.iconPath}
                            alt={dropItem.label}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        </div>
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
            className={`font-medium transition-colors ${
              item.isPremium
                ? "text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1"
                : isActive 
                ? "text-accent" 
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
