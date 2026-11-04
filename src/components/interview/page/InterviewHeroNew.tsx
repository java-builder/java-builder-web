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
    <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
      {/* Accent halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
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

      <div className="relative mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 sm:py-14 lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {badgeLabel}
        </span>

        <h1 className="mx-auto mt-3.5 sm:mt-4 max-w-3xl text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
          {titleStart}{" "}
          <span className="text-primary">{titleAccent}</span>
        </h1>

        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-text-muted">
          {description}
        </p>

        {/* Stats strip - Sleek 3-col on all screen sizes */}
        <div className="mx-auto mt-5 sm:mt-6 grid max-w-md grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-background py-3 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-2 sm:px-4">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-primary-soft text-primary shrink-0">
              <BookOpenCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <div className="text-center sm:text-left">
              <div className="text-sm sm:text-base font-black tabular-nums text-foreground">
                {totalQuestions.toLocaleString("vi-VN")}+
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {statQuestionsLabel}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-2 sm:px-4">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-primary-soft text-primary shrink-0">
              <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <div className="text-center sm:text-left">
              <div className="text-sm sm:text-base font-black tabular-nums text-foreground">
                {totalCategories.toLocaleString("vi-VN")}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {statTopicsLabel}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-2 sm:px-4">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-primary-soft text-primary shrink-0">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <div className="text-center sm:text-left">
              <div className="text-sm sm:text-base font-black tabular-nums text-foreground">
                3
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {statLevelsLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mx-auto mt-5 sm:mt-6 max-w-xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
