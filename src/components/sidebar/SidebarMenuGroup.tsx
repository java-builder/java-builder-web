import Link from "next/link";
import { ChevronDown, Flame, Sparkles } from "lucide-react";
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

  const renderTag = (item: MenuItem) => {
    if (item.tag) {
      if (item.tagVariant === "hot") {
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9.5px] font-extrabold rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-xs tracking-wider animate-pulse uppercase leading-none">
            <Flame className="w-2.5 h-2.5 fill-current" />
            {item.tag}
          </span>
        );
      }
      if (item.tagVariant === "pro") {
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9.5px] font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs tracking-wider uppercase leading-none">
            <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
            {item.tag}
          </span>
        );
      }
      if (item.tagVariant === "new") {
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tracking-wider uppercase leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            {item.tag}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tracking-wider uppercase leading-none">
          {item.tag}
        </span>
      );
    }

    if (item.highlight) {
      return (
        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
          NEW
        </span>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-1 ${isCollapsed ? "pt-2.5 mt-2.5" : "pt-3.5 mt-3.5"} border-t border-slate-100 dark:border-slate-800/80 first:border-t-0 first:pt-0 first:mt-0`}>
      {!isCollapsed && (
        group.collapsible === false ? (
          <div className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              {group.icon && (
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center opacity-80 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:flex-shrink-0">
                  {group.icon}
                </span>
              )}
              <span className="truncate">
                {group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className="group w-full flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none rounded-lg hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {group.icon && (
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-200 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:flex-shrink-0">
                  {group.icon}
                </span>
              )}
              <span className="truncate">
                {group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </button>
        )
      )}

      {(isCollapsed || group.collapsible === false || isOpen) && (
        <ul className="space-y-0.5">
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
                    className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all duration-200 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:flex-shrink-0 relative ${item.highlight
                      ? "text-purple-600 dark:text-purple-300"
                      : active
                        ? "text-blue-600 dark:text-blue-400 scale-105"
                        : `${item.color || "text-slate-400 dark:text-slate-500"} opacity-70 group-hover:opacity-100 group-hover:scale-105`
                      }`}
                  >
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1.5 min-w-[13px] h-[13px] px-0.5 p-0 flex items-center justify-center text-[8.5px] font-bold text-center leading-none rounded-full bg-red-500 text-white dark:bg-red-600 border border-white dark:border-slate-900 select-none shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 text-[13px] font-medium transition-colors ${active ? "text-blue-600 dark:text-blue-400 font-semibold" : ""
                        }`}>
                        {displayedLabel}
                      </span>
                      {renderTag(item)}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center gap-2">
                      <span>{displayedLabel}</span>
                      {item.tag && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.tagVariant === "hot"
                            ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white"
                            : item.tagVariant === "pro"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : item.tagVariant === "new"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                        >
                          {item.tag}
                        </span>
                      )}
                      {!item.tag && item.highlight && (
                        <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          NEW
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
