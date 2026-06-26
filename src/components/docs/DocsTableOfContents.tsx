"use client";

import { useEffect, useState, useRef } from "react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
}

export default function DocsTableOfContents({ items }: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const targetIdRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Track active heading on scroll
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for top header
      
      // Find the heading that is closest above the current scroll position
      let currentActiveId = "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPosition) {
            currentActiveId = item.id;
          } else {
            break;
          }
        }
      }
      
      // If we are at the very top of the page, highlight the first item
      if (window.scrollY < 50 && items.length > 0) {
        currentActiveId = items[0].id;
      }
      
      // If programmatically scrolling to a target ID, block other highlights
      // until we actually reach the target or hit the page bottom
      if (targetIdRef.current) {
        const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 15;
        if (currentActiveId === targetIdRef.current || isAtBottom) {
          targetIdRef.current = null; // target reached, release the block
        } else {
          return; // keep the clicked item active
        }
      }
      
      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load/render
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      targetIdRef.current = id;
      setActiveId(id);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Safety fallback to release the scroll-spy block after 1.5 seconds
      scrollTimeoutRef.current = setTimeout(() => {
        targetIdRef.current = null;
      }, 1500);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 border-l border-gray-100 dark:border-slate-800/40">
      <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
        Mục lục bài viết
      </h3>
      <nav className="relative border-l border-gray-200 dark:border-slate-700/60 pl-3.5 space-y-3">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isSubItem = item.level > 2;
          
          return (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block transition-all duration-200 cursor-pointer ${
                isSubItem 
                  ? "pl-3 text-xs" 
                  : "text-[13px]"
              } ${
                isActive 
                  ? "text-accent dark:text-sky-400 font-bold -ml-[15.5px] border-l-2 border-accent pl-[13.5px] translate-x-0.5" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-slate-200"
              }`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
