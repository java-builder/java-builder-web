"use client";

import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface SectionCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}

export default function SectionCard({
  title,
  subtitle,
  action,
  children,
  bodyClassName = "",
}: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      <div className="flex flex-col gap-3 border-b border-[#E8E8E8] dark:border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-[#171717] dark:text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className={bodyClassName || "p-6"}>{children}</div>
    </div>
  );
}
