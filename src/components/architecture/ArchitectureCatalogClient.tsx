"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ARCHITECTURE_PATTERNS } from "@/components/architecture/data/patternsData";
import { PatternCategory } from "@/components/architecture/types";
import { ArchitectureCard } from "@/components/architecture/ArchitectureCard";
import { ArchitectureHeroFlow } from "@/components/architecture/ArchitectureHeroFlow";
import { FilterSelect } from "@/components/ui/select";
import {
  Layers,
  Shield,
  Zap,
  Network,
  Database,
  GitBranch,
  Radio,
  SlidersHorizontal,
  Sparkles,
  BookOpenCheck,
  TrendingUp,
} from "lucide-react";

export const ArchitectureCatalogClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories: { id: PatternCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "Tất cả kiến trúc", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "caching", label: "Caching & DB", icon: <Database className="w-3.5 h-3.5" /> },
    { id: "resilience", label: "Resilience & Traffic", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "security", label: "Security & Auth", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "realtime", label: "Messaging & Real-time", icon: <Radio className="w-3.5 h-3.5" /> },
    { id: "microservices", label: "Microservices & Gateway", icon: <Network className="w-3.5 h-3.5" /> },
    { id: "devops", label: "CI/CD & DevOps", icon: <GitBranch className="w-3.5 h-3.5" /> },
  ];

  const difficultyOptions = [
    { value: "all", label: "Tất cả độ khó" },
    { value: "Beginner", label: "1. Cơ bản (Beginner)" },
    { value: "Intermediate", label: "2. Trung bình (Intermediate)" },
    { value: "Advanced", label: "3. Nâng cao (Advanced)" },
  ];

  // Already ordered Beginner -> Intermediate -> Advanced in ARCHITECTURE_PATTERNS
  const filteredPatterns = ARCHITECTURE_PATTERNS.filter((pattern) => {
    const matchesCategory =
      selectedCategory === "all" || pattern.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || pattern.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="w-full pb-20">
      {/* Edge-to-Edge Full Width Hero Section (System Style matching Interview & Challenges) */}
      <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
        {/* Accent Halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
        />

        {/* Floating tech logos - consistent with other system pages */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-4 top-10 animate-float opacity-25 dark:opacity-35 sm:left-8 sm:top-14 md:left-14">
            <Image
              src="/logos/logo-java.png"
              alt=""
              width={50}
              height={50}
              className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
            />
          </div>

          <div
            className="absolute right-4 top-12 animate-float-delayed opacity-25 dark:opacity-35 sm:right-8 sm:top-16 md:right-16"
            style={{ animationDelay: "1s" }}
          >
            <Image
              src="/logos/logo-docker.png"
              alt=""
              width={50}
              height={50}
              className="h-11 w-11 object-contain sm:h-13 sm:w-13 md:h-15 md:w-15"
            />
          </div>

          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 animate-float opacity-20 dark:opacity-30 sm:left-6 md:left-10"
            style={{ animationDelay: "2s" }}
          >
            <Image
              src="/logos/logo-springboot.png"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
          </div>

          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-float-delayed opacity-20 dark:opacity-30 sm:right-6 md:right-12"
            style={{ animationDelay: "0.5s" }}
          >
            <Image
              src="/logos/logo-microservices.png"
              alt=""
              width={50}
              height={50}
              className="h-11 w-11 object-contain sm:h-13 sm:w-13"
            />
          </div>

          <div
            className="absolute bottom-8 left-8 animate-float opacity-20 dark:opacity-30 sm:bottom-12 sm:left-14 md:left-20"
            style={{ animationDelay: "1.5s" }}
          >
            <Image
              src="/logos/logo-posgtres.png"
              alt=""
              width={45}
              height={45}
              className="h-9 w-9 object-contain sm:h-11 sm:w-11"
            />
          </div>

          <div
            className="absolute bottom-10 right-8 animate-float-delayed opacity-20 dark:opacity-30 sm:bottom-14 sm:right-14 md:right-22"
            style={{ animationDelay: "2.5s" }}
          >
            <Image
              src="/logos/aws-logo.png"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
          </div>
        </div>

        {/* Center Content Container */}
        <div className="relative mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-8 space-y-4 sm:space-y-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 text-xs font-semibold text-[#FF5A1F] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FF5A1F]" />
            <span>Mô Phỏng Kiến Trúc Thực Chiến (System Design)</span>
          </span>

          {/* Heading */}
          <h1 className="mx-auto max-w-3xl text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            System Design & <span className="text-[#FF5A1F]">Architecture Flows</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Mô phỏng trực quan tương tác các luồng dữ liệu kiến trúc hệ thống backend chuẩn Enterprise: Caching, Load Balancing, Rate Limiting, Spring Security, Real-time WebSocket, Kafka Event Bus, Circuit Breaker, Gateway và Sharding. Được sắp xếp theo lộ trình từ cơ bản tới nâng cao.
          </p>

          {/* Clean, Horizontal Architecture Pipeline (No bulky cards, seamlessly integrated) */}
          <div className="pt-2">
            <ArchitectureHeroFlow />
          </div>

          {/* Stats strip - Sleek 3-col on all screen sizes (System Style) */}
          <div className="mx-auto mt-4 grid max-w-md grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-background py-2.5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#FF5A1F] shrink-0">
                <Layers className="h-3.5 w-3.5" />
              </span>
              <div className="text-center sm:text-left">
                <div className="text-xs sm:text-sm font-black tabular-nums text-foreground">
                  10 Luồng
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Kiến Trúc Chuẩn
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#FF5A1F] shrink-0">
                <BookOpenCheck className="h-3.5 w-3.5" />
              </span>
              <div className="text-center sm:text-left">
                <div className="text-xs sm:text-sm font-black tabular-nums text-foreground">
                  01 → 10
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Lộ Trình Độ Khó
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#FF5A1F] shrink-0">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <div className="text-center sm:text-left">
                <div className="text-xs sm:text-sm font-black tabular-nums text-foreground">
                  Thời Gian Thực
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mô Phỏng Động
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container: Category Filter & Patterns Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          {/* Category Tabs - completely hidden scrollbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs"
                      : "bg-surface text-muted-foreground hover:text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty Filter Dropdown (System FilterSelect) */}
          <div className="w-56 shrink-0">
            <FilterSelect
              value={selectedDifficulty}
              onChange={(val) => setSelectedDifficulty(String(val))}
              options={difficultyOptions}
              placeholder="Tất cả độ khó"
              size="sm"
              icon={<SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />}
              triggerClassName="!h-9 rounded-xl text-xs bg-surface border-border"
            />
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-mono">
          <span>
            Hiển thị <strong>{filteredPatterns.length}</strong> / {ARCHITECTURE_PATTERNS.length} bài kiến trúc (Đã sắp xếp thứ tự 1 → 10 từ Dễ đến Khó)
          </span>
        </div>

        {/* Patterns Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatterns.map((pattern, index) => (
            <ArchitectureCard
              key={pattern.id}
              pattern={pattern}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
