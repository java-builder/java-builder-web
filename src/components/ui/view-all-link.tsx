"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ViewAllLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<ViewAllLinkProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs active:scale-[0.98]",
  ghost:
    "bg-primary-soft dark:bg-primary/15 text-primary border border-primary/25 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-2xs active:scale-[0.98]",
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
      className={`group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
    </Link>
  );
}
