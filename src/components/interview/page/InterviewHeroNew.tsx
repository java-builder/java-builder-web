"use client";

import Image from "next/image";
import {
  BookOpenCheck,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface InterviewHeroNewProps {
  badgeLabel: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  searchPlaceholder: string;
  searchText: string;
  onSearchChange: (v: string) => void;
  totalQuestions: number;
  totalCategories: number;
  statQuestionsLabel: string;
  statTopicsLabel: string;
  statLevelsLabel: string;
}

export default function InterviewHeroNew({
  badgeLabel,
  titleStart,
  titleAccent,
  description,
  searchPlaceholder,
  searchText,
  onSearchChange,
  totalQuestions,
  totalCategories,
  statQuestionsLabel,
  statTopicsLabel,
  statLevelsLabel,
}: InterviewHeroNewProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Accent halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.08),transparent_60%)]"
      />

      {/* Floating tech logos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-4 top-12 animate-float opacity-30 dark:opacity-40 sm:left-8 sm:top-16 md:left-16 lg:left-20">
          <Image
            src="/logos/logo-java.png"
            alt=""
            width={50}
            height={50}
            className="h-12 w-12 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[70px] lg:w-[70px]"
          />
        </div>

        <div
          className="absolute right-4 top-16 animate-float-delayed opacity-30 dark:opacity-40 sm:right-8 sm:top-20 md:right-16 lg:right-24"
          style={{ animationDelay: "1s" }}
        >
          <Image
            src="/logos/logo-docker.png"
            alt=""
            width={55}
            height={55}
            className="h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-[70px] md:w-[70px] lg:h-[75px] lg:w-[75px]"
          />
        </div>

        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 animate-float opacity-30 dark:opacity-40 sm:left-6 md:left-12 lg:left-16"
          style={{ animationDelay: "2s" }}
        >
          <Image
            src="/logos/logo-springboot.png"
            alt=""
            width={50}
            height={50}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[65px] lg:w-[65px]"
          />
        </div>

        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 animate-float-delayed opacity-30 dark:opacity-40 sm:right-6 md:right-14 lg:right-20"
          style={{ animationDelay: "0.5s" }}
        >
          <Image
            src="/logos/logo-microservices.png"
            alt=""
            width={55}
            height={55}
            className="h-12 w-12 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[70px] lg:w-[70px]"
          />
        </div>

        <div
          className="absolute bottom-16 left-6 animate-float opacity-30 dark:opacity-40 sm:bottom-20 sm:left-12 md:left-20 lg:left-28"
          style={{ animationDelay: "1.5s" }}
        >
          <Image
            src="/logos/logo-posgtres.png"
            alt=""
            width={50}
            height={50}
            className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[60px] lg:w-[60px]"
          />
        </div>

        <div
          className="absolute bottom-20 right-6 animate-float-delayed opacity-30 dark:opacity-40 sm:bottom-24 sm:right-12 md:right-24 lg:right-32"
          style={{ animationDelay: "2.5s" }}
        >
          <Image
            src="/logos/aws-logo.png"
            alt=""
            width={50}
            height={50}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-[65px] lg:w-[65px]"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/20">
          <Sparkles className="h-3 w-3" />
          {badgeLabel}
        </span>

        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
          {titleStart}{" "}
          <span className="bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-purple-400">
            {titleAccent}
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
          {description}
        </p>

        {/* Stats strip */}
        <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-6 rounded-2xl border border-gray-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
              <BookOpenCheck className="h-3.5 w-3.5" />
            </span>
            <div className="text-left">
              <div className="text-base font-bold tabular-nums text-gray-900 dark:text-white">
                {totalQuestions.toLocaleString("vi-VN")}+
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {statQuestionsLabel}
              </div>
            </div>
          </div>
          <div className="h-7 w-px bg-gray-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <div className="text-left">
              <div className="text-base font-bold tabular-nums text-gray-900 dark:text-white">
                {totalCategories.toLocaleString("vi-VN")}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {statTopicsLabel}
              </div>
            </div>
          </div>
          <div className="h-7 w-px bg-gray-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <div className="text-left">
              <div className="text-base font-bold tabular-nums text-gray-900 dark:text-white">
                3
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {statLevelsLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mx-auto mt-6 max-w-xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
