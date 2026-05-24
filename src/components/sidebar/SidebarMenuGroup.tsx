import Link from "next/link";
import { MenuItem, MenuGroup } from "./types";

interface SidebarMenuGroupProps {
  group: MenuGroup;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isActive: (href: string) => boolean;
  shouldShowItem: (item: MenuItem) => boolean;
}

export default function SidebarMenuGroup({
  group,
  isCollapsed,
  isOpen,
  onToggle,
  isActive,
  shouldShowItem,
}: SidebarMenuGroupProps) {
  return (
    <div>
      {!isCollapsed && (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span>{group.title}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
      {(isCollapsed || isOpen) && (
        <ul className="space-y-1 mt-1">
          {group.items.map((item) => {
            if (!shouldShowItem(item)) return null;

            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    item.highlight
                      ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/30"
                      : active
                      ? "bg-accent/10 text-accent dark:bg-accent/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      item.highlight
                        ? "text-purple-600 dark:text-purple-400"
                        : active
                        ? "text-accent"
                        : item.color || "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 font-medium text-sm ${
                        item.highlight ? "font-semibold" : ""
                      }`}>
                        {item.label}
                      </span>
                      {item.highlight && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full shadow-sm ${
                          item.href === "/notifications" 
                            ? "bg-red-600 text-white" 
                            : item.badgeColor
                            ? `${item.badgeColor} text-white animate-pulse`
                            : "bg-accent/20 text-accent"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                      {item.highlight && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className={`ml-2 px-1.5 py-0.5 text-xs font-bold rounded ${
                          item.href === "/notifications"
                            ? "bg-red-600 text-white"
                            : item.badgeColor
                            ? `${item.badgeColor} text-white`
                            : "bg-accent text-white"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
