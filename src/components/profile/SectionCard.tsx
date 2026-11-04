"use client";

import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}

export default function SectionCard({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
  bodyClassName = "",
}: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      <div className="flex flex-col gap-2 border-b border-[#E8E8E8] dark:border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#FF5A1F]/10">
            <Icon className="h-3.5 w-3.5 text-[#FF5A1F]" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className={bodyClassName || "p-5"}>{children}</div>
    </div>
  );
}
