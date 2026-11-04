"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ViewAllLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<ViewAllLinkProps["variant"]>, string> = {
  primary:
    "bg-[#FF5A1F] text-white hover:bg-[#e04b16] shadow-xs active:scale-[0.98]",
  ghost:
    "bg-white dark:bg-[#181d28] text-[#171717] dark:text-slate-100 border border-[#E8E8E8] dark:border-[#262d3d] hover:bg-[#FFF0E8] hover:text-[#FF5A1F] hover:border-[#FF5A1F]/30 dark:hover:bg-slate-800 shadow-xs",
};

export default function ViewAllLink({
  href,
  children,
  variant = "ghost",
  className = "",
}: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <span>{children}</span>
      <span className="flex h-3.5 w-3.5 items-center justify-center transition-transform group-hover:translate-x-1">
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>
    </Link>
  );
}
