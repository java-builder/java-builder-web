"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Compass, Sparkles } from "lucide-react";

interface BlogsHeroProps {
  badgeLabel: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  exploreLabel: string;
  tagLabels: string[];
}

export default function BlogsHero({
  badgeLabel,
  titleStart,
  titleAccent,
  description,
  exploreLabel,
  tagLabels,
}: BlogsHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/20">
              <Sparkles className="h-3 w-3" />
              {badgeLabel}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {titleStart}{" "}
              <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-purple-400">
                {titleAccent}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#blogs-list"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
              >
                <Compass className="h-4 w-4" />
                {exploreLabel}
              </Link>
            </div>

            {tagLabels.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {tagLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-gray-200"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900/40">
              <Image
                src="/banners/banner-blog.jpg"
                alt=""
                width={600}
                height={360}
                className="h-64 w-full object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent" />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur dark:bg-slate-900/80 dark:text-gray-200 dark:ring-slate-700">
                <BookOpen className="h-3 w-3 text-accent" />
                JavaBuilder
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
