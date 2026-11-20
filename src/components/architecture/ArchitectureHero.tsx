"use client";

import React from "react";
import {
  Shield,
  Zap,
  Network,
  Database,
  Layers,
  Sparkles,
  GitBranch,
  Radio,
} from "lucide-react";
import { ArchitecturePattern, PatternCategory } from "./types";

interface ArchitectureHeroProps {
  patterns: ArchitecturePattern[];
  selectedCategory: PatternCategory;
  onSelectCategory: (category: PatternCategory) => void;
  activePattern: ArchitecturePattern;
  onSelectPattern: (patternId: string) => void;
}

export const ArchitectureHero: React.FC<ArchitectureHeroProps> = ({
  patterns,
  selectedCategory,
  onSelectCategory,
  activePattern,
  onSelectPattern,
}) => {
  const categories: { id: PatternCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Flows", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "security", label: "Security & Auth", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "resilience", label: "Resilience & Traffic", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "microservices", label: "Microservices & Gateway", icon: <Network className="w-3.5 h-3.5" /> },
    { id: "caching", label: "Caching & DB", icon: <Database className="w-3.5 h-3.5" /> },
    { id: "devops", label: "CI/CD & DevOps", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "realtime", label: "WebSocket & Real-time", icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  const filteredPatterns =
    selectedCategory === "all"
      ? patterns
      : patterns.filter((p) => p.category === selectedCategory);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Cơ bản":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "Trung bình":
        return "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400";
      case "Nâng cao":
        return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400";
      case "Chuyên sâu":
        return "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-surface border border-[#E8E8E8] dark:border-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0E8] dark:bg-orange-950/40 border border-[#FFD8C7] dark:border-orange-900/50 text-[#FF5A1F] text-[11px] font-bold">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>INTERACTIVE SYSTEM ARCHITECTURE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            System Design & Architecture Flows
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Mô phỏng trực quan luồng kiến trúc hệ thống chuẩn Enterprise: Spring Security, Circuit Breaker, API Gateway, Rate Limiting, CI/CD Pipeline, WebSocket.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs"
                    : "bg-surface-elevated text-muted-foreground hover:text-foreground border-border hover:bg-muted"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Selection Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-2.5">
        {filteredPatterns.map((pat) => {
          const isSelected = pat.id === activePattern.id;
          return (
            <button
              key={pat.id}
              onClick={() => onSelectPattern(pat.id)}
              className={`text-left rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FFF0E8]/70 dark:bg-orange-950/40 border-[#FF5A1F] shadow-xs ring-1 ring-[#FF5A1F]"
                  : "bg-white dark:bg-surface border-border hover:border-border/80 hover:bg-muted/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                      pat.difficulty
                    )}`}
                  >
                    {pat.difficulty}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                  )}
                </div>

                <h3
                  className={`text-xs font-bold leading-snug line-clamp-2 ${
                    isSelected ? "text-[#FF5A1F]" : "text-foreground"
                  }`}
                >
                  {pat.title}
                </h3>
              </div>

              <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="capitalize">{pat.category}</span>
                <span className="font-semibold text-primary">{pat.difficulty}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
