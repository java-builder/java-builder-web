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
    "bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-white/80 dark:bg-slate-800/80 backdrop-blur text-gray-700 dark:text-slate-200 border border-gray-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-accent dark:hover:border-accent hover:-translate-y-0.5 active:translate-y-0",
};

export default function ViewAllLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <span>{children}</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/30">
        <svg
          className="h-3.5 w-3.5"
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
