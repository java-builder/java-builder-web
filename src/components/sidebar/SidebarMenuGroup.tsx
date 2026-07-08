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

  return (
    <div className="space-y-1 mt-6 first:mt-0">
      {!isCollapsed && (
        <button
          type="button"
          onClick={onToggle}
          className="group w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none rounded-lg hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            {group.icon && (
              <span className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-all duration-200 [&_svg]:w-3.5 [&_svg]:h-3.5">
                {group.icon}
              </span>
            )}
            <span>
              {group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}
            </span>
          </div>
          <svg
            className={`w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
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
        <ul className={`space-y-0.5 ${!isCollapsed ? "pl-3 px-1" : ""}`}>
          {group.items.map((item) => {
            if (!shouldShowItem(item)) return null;

            const active = isActive(item.href);
            const displayedLabel = item.labelKey ? t(item.labelKey as Parameters<typeof t>[0]) : item.label;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 group relative ${isCollapsed ? "justify-center py-2.5" : ""
                    } ${item.highlight
                      ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-300 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/30"
                      : active
                        ? "bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-650 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  title={isCollapsed ? displayedLabel : undefined}
                >
                  <span
                    className={`flex-shrink-0 transition-all duration-200 [&_svg]:w-4 [&_svg]:h-4 ${item.highlight
                        ? "text-purple-600 dark:text-purple-300"
                        : active
                          ? "text-blue-600 dark:text-blue-400 scale-105"
                          : `${item.color || "text-slate-400 dark:text-slate-500"} opacity-70 group-hover:opacity-100 group-hover:scale-105`
                      }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 text-[13px] font-medium transition-colors ${active ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
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
                              : "bg-blue-50 text-blue-650 dark:bg-blue-900/30 dark:text-blue-400"
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
                              : "bg-blue-600 text-white"
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
