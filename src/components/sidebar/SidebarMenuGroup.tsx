import Link from "next/link";
import { MenuItem, MenuGroup } from "./types";
import { useI18n } from "@/contexts/I18nContext";

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
  const { t } = useI18n();
  const hasActiveChild = group.items.some((item) => isActive(item.href));

  const themeMap: Record<string, { activeText: string; activeBg: string; activeIconBg: string }> = {
    "border-blue-500": {
      activeText: "text-blue-600 dark:text-blue-400",
      activeBg: "bg-slate-50 dark:bg-slate-800/40",
      activeIconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    "border-teal-500": {
      activeText: "text-teal-600 dark:text-teal-400",
      activeBg: "bg-slate-50 dark:bg-slate-800/40",
      activeIconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    },
    "border-yellow-500": {
      activeText: "text-yellow-600 dark:text-yellow-400",
      activeBg: "bg-slate-50 dark:bg-slate-800/40",
      activeIconBg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    },
    "border-purple-500": {
      activeText: "text-purple-600 dark:text-purple-400",
      activeBg: "bg-slate-50 dark:bg-slate-800/40",
      activeIconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    },
  };

  const currentTheme = themeMap[group.borderColor || ""] || themeMap["border-blue-500"];

  return (
    <div className="space-y-0.5">
      {!isCollapsed && (
        <button
          type="button"
          onClick={onToggle}
          className={`group w-full flex items-center justify-between px-2.5 py-1 text-[10.5px] font-bold text-left uppercase tracking-wider transition-all duration-200 select-none rounded-lg ${hasActiveChild
              ? `${currentTheme.activeBg} ${currentTheme.activeText}`
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/20"
            }`}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {group.icon && (
              <div className={`w-5.5 h-5.5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ${hasActiveChild
                  ? currentTheme.activeIconBg
                  : "bg-gray-100/70 dark:bg-slate-700/40 group-hover:bg-gray-200/80 dark:group-hover:bg-slate-700/60"
                }`}>
                {group.icon}
              </div>
            )}
            <span className="truncate pr-1">
              {group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}
            </span>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {(isCollapsed || isOpen) && (
        <ul className={`space-y-1 mt-1 ${!isCollapsed ? "pl-3.5 ml-4 border-l border-solid border-gray-150 dark:border-slate-800/60" : ""}`}>
          {group.items.map((item) => {
            if (!shouldShowItem(item)) return null;

            const active = isActive(item.href);
            const displayedLabel = item.labelKey ? t(item.labelKey as Parameters<typeof t>[0]) : item.label;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group relative ${isCollapsed ? "justify-center py-2.5" : ""
                    } ${item.highlight
                      ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-300 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/30"
                      : active
                        ? "bg-accent/8 dark:bg-accent/15 text-accent dark:text-accent-on-dark font-semibold shadow-xs"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-150/55 dark:hover:bg-slate-800"
                    }`}
                  title={isCollapsed ? displayedLabel : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${item.highlight
                        ? "text-purple-600 dark:text-purple-300"
                        : active
                          ? "text-accent dark:text-accent-on-dark [&_svg]:text-accent dark:[&_svg]:text-accent-on-dark"
                          : item.color || "text-gray-500 dark:text-gray-300"
                      }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 font-medium text-sm ${item.highlight ? "font-semibold" : ""
                        }`}>
                        {displayedLabel}
                      </span>
                      {item.highlight && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full shadow-sm ${item.href === "/notifications"
                            ? "bg-red-650 text-white"
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
                      {displayedLabel}
                      {item.highlight && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className={`ml-2 px-1.5 py-0.5 text-xs font-bold rounded ${item.href === "/notifications"
                            ? "bg-red-650 text-white"
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
