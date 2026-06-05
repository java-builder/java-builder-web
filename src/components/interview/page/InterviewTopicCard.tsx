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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-accent/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-600 dark:bg-slate-700">
            <Image
              src={iconPath}
              alt={name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold tabular-nums text-accent">
              {totalQuestions}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {questionsLabel}
            </span>
          </div>
        </div>

        <h3 className="mt-4 text-base font-semibold leading-snug text-gray-900 transition group-hover:text-accent dark:text-white">
          {name}
        </h3>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {levels.map((level) => (
              <span
                key={level}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200"
              >
                <Layers className="h-2.5 w-2.5" />
                {level}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-700">
            <span className="text-sm font-semibold text-accent">
              {viewDetailsLabel}
            </span>
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
