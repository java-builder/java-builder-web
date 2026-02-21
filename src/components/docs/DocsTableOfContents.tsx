"use client";

import { useEffect } from "react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
}

export default function DocsTableOfContents({ items }: DocsTableOfContentsProps) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Nội dung bài viết
      </h3>
      <nav className="space-y-2 text-sm">
        {items.map((item) => (
          <a 
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`block hover:text-accent transition-colors ${
              item.level === 2 
                ? 'text-accent hover:underline' 
                : 'text-gray-600 dark:text-gray-400 pl-3'
            }`}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
