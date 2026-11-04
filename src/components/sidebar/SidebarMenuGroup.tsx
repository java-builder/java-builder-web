import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary text-primary-foreground uppercase leading-none shadow-xs">
            {item.tag}
          </span>
        );
      }
      if (item.tagVariant === "pro") {
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-secondary-soft text-secondary border border-secondary-soft-border uppercase leading-none">
            {item.tag}
          </span>
        );
      }
      if (item.tagVariant === "new") {
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-warning-soft text-warning border border-warning-border uppercase leading-none">
            {item.tag}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary-soft text-primary border border-primary-soft-border uppercase leading-none">
          {item.tag}
        </span>
      );
    }

    if (item.highlight) {
      return (
        <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-warning-soft text-warning border border-warning-border uppercase leading-none">
          NEW
        </span>
      );
    }

    return null;
  };

  return (
    <div className={`space-y-1 ${isCollapsed ? "pt-2.5 mt-2.5" : "pt-3.5 mt-3.5"} border-t border-border first:border-t-0 first:pt-0 first:mt-0`}>
      {!isCollapsed && (
        group.collapsible === false ? (
          <div className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-extrabold tracking-wider text-slate-900 dark:text-slate-100 uppercase select-none">
            <div className="flex items-center gap-2 min-w-0">
              {group.icon && (
                <span className="w-5 h-5 rounded-md bg-primary-soft dark:bg-primary/15 text-primary shrink-0 flex items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:shrink-0 [&_svg]:!text-primary">
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
            className="group w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-extrabold tracking-wider text-slate-900 dark:text-slate-100 uppercase select-none rounded-xl hover:text-primary hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              {group.icon && (
                <span className="w-5 h-5 rounded-md bg-primary-soft dark:bg-primary/15 text-primary shrink-0 flex items-center justify-center transition-all duration-200 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:shrink-0 [&_svg]:!text-primary">
                  {group.icon}
                </span>
              )}
              <span className="truncate">
                {group.titleKey ? t(group.titleKey as Parameters<typeof t>[0]) : group.title}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )
      )}

      {(isCollapsed || group.collapsible === false || isOpen) && (
        <ul className="space-y-1">
          {group.items.map((item) => {
            if (!shouldShowItem(item)) return null;

            const active = isActive(item.href);
            const displayedLabel = item.labelKey ? t(item.labelKey as Parameters<typeof t>[0]) : item.label;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                    isCollapsed ? "justify-center py-2.5" : ""
                  } ${
                    item.highlight || active
                      ? "bg-primary-soft dark:bg-primary/15 text-primary font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:rounded-r-full before:bg-primary"
                      : "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium"
                  } ${isCollapsed && (item.highlight || active) ? "before:hidden" : ""}`}
                  title={isCollapsed ? displayedLabel : undefined}
                >
                  <span
                    className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center transition-colors [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:stroke-[2] [&_svg]:shrink-0 relative ${
                      active || item.highlight
                        ? "text-primary"
                        : "text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center text-[8.5px] font-bold text-center leading-none rounded-full bg-primary text-primary-foreground border border-surface select-none shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span
                        className={`flex-1 text-[14px] leading-snug transition-colors truncate ${
                          active || item.highlight
                            ? "text-primary font-semibold"
                            : "text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-950 dark:group-hover:text-white"
                        }`}
                      >
                        {displayedLabel}
                      </span>
                      {renderTag(item)}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg flex items-center gap-2">
                      <span>{displayedLabel}</span>
                      {item.tag && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                          {item.tag}
                        </span>
                      )}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800"></div>
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
