"use client";

import { useEffect, useState, useRef } from "react";
import { List, Bot, FileText } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
  showTools?: boolean;
  onOpenAi?: () => void;
  onOpenNotes?: () => void;
}

export default function DocsTableOfContents({
  items,
  showTools = false,
  onOpenAi,
  onOpenNotes,
}: DocsTableOfContentsProps) {
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

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
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

      if (window.scrollY < 50 && items.length > 0) {
        currentActiveId = items[0].id;
      }

      if (targetIdRef.current) {
        const isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 15;
        if (currentActiveId === targetIdRef.current || isAtBottom) {
          targetIdRef.current = null;
        } else {
          return;
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      targetIdRef.current = id;
      setActiveId(id);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      scrollTimeoutRef.current = setTimeout(() => {
        targetIdRef.current = null;
      }, 1500);
    }
  };

  if (items.length === 0 && !showTools) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-68 2xl:w-72 shrink-0 sticky top-15 h-[calc(100vh-3.75rem)] overflow-y-auto p-5 border-l border-border bg-background scrollbar-thin space-y-6">
      {showTools && (onOpenAi || onOpenNotes) && (
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2.5">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Công cụ học tập
          </p>
          <div className="grid grid-cols-2 gap-2">
            {onOpenAi && (
              <button
                type="button"
                onClick={onOpenAi}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 shrink-0" />
                <span>Hỏi AI</span>
              </button>
            )}
            {onOpenNotes && (
              <button
                type="button"
                onClick={onOpenNotes}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-background text-foreground border border-border hover:text-primary transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Ghi chú</span>
              </button>
            )}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-foreground uppercase tracking-wider mb-3.5">
            <List className="w-3.5 h-3.5 text-primary" />
            <span>Mục lục bài học</span>
          </div>
          <nav className="relative border-l border-border pl-3.5 space-y-2.5">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const isSubItem = item.level > 2;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block transition-all duration-150 cursor-pointer leading-snug ${
                    isSubItem ? "pl-3 text-xs" : "text-[13px]"
                  } ${
                    isActive
                      ? "text-primary font-semibold -ml-[15px] border-l-2 border-primary pl-[13px]"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {item.title}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </aside>
  );
}
