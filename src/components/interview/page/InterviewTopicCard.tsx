"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

interface InterviewTopicCardProps {
  slug: string;
  name: string;
  iconPath: string;
  description: string;
  totalQuestions: number;
  levels: string[];
  questionsLabel: string;
  viewDetailsLabel: string;
}

export default function InterviewTopicCard({
  slug,
  name,
  iconPath,
  description,
  totalQuestions,
  levels,
  questionsLabel,
  viewDetailsLabel,
}: InterviewTopicCardProps) {
  return (
    <Link
      href={`/interview/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5 cursor-pointer"
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-background p-2">
            <Image
              src={iconPath}
              alt={name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black tabular-nums text-[#FF5A1F]">
              {totalQuestions}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
              {questionsLabel}
            </span>
          </div>
        </div>

        <h3 className="mt-4 text-base font-bold leading-snug text-[#171717] transition group-hover:text-[#FF5A1F] dark:text-white">
          {name}
        </h3>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {levels.map((level) => (
              <span
                key={level}
                className="inline-flex items-center gap-1 rounded-full border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-background px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B] dark:text-slate-300"
              >
                <Layers className="h-2.5 w-2.5 text-[#FF5A1F]" />
                {level}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#E8E8E8] dark:border-border pt-3">
            <span className="text-xs sm:text-sm font-semibold text-[#FF5A1F]">
              {viewDetailsLabel}
            </span>
            <ArrowRight className="h-4 w-4 text-[#FF5A1F] transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
