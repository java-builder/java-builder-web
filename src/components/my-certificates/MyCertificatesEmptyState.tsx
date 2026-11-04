"use client";

import Link from "next/link";
import { Award, Compass, ShieldCheck } from "lucide-react";

interface MyCertificatesEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
}

export default function MyCertificatesEmptyState({
  title,
  description,
  actionLabel,
}: MyCertificatesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-8 sm:p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0E8] text-[#FF5A1F] border border-[#FF5A1F]/20 dark:bg-orange-950/40 dark:text-orange-400 font-mono">
        <Award className="h-8 w-8" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-5 py-2.5 text-sm font-semibold text-white transition shadow-sm active:scale-95 shadow-[#FF5A1F]/25 cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          {actionLabel}
        </Link>

        <Link
          href="/verify-certificate"
          className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted shadow-xs cursor-pointer"
        >
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Tra Cứu Mã Chứng Chỉ</span>
        </Link>
      </div>
    </div>
  );
}
