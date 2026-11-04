"use client";

import Link from "next/link";
import Image from "next/image";
import { Compass, GraduationCap, ArrowRight } from "lucide-react";

interface CoursesHeroProps {
  badgeLabel: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  exploreLabel: string;
}

export default function CoursesHero({
  badgeLabel,
  titleStart,
  titleAccent,
  description,
  exploreLabel,
}: CoursesHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      {/* Soft AWS Orange halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20 shadow-2xs">
              <svg className="w-2.5 h-2.5 fill-current shrink-0" viewBox="0 0 24 24">
                <polygon points="6,3 20,12 6,21" />
              </svg>
              <span>{badgeLabel}</span>
            </span>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
              {titleStart}{" "}
              <span className="text-primary">{titleAccent}</span>
            </h1>

            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-text-muted">
              {description}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
              <Link
                href="#courses-list"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/25 transition active:scale-95 whitespace-nowrap"
              >
                <Compass className="h-4 w-4" />
                <span>{exploreLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-900 shadow-lg">
              <Image
                src="/banners/banner-course.webp"
                alt=""
                width={600}
                height={360}
                className="h-64 w-full object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent" />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-xs border border-border backdrop-blur">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                JavaBuilder
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
