"use client";

import React from "react";
import Link from "next/link";
import { ArchitecturePattern } from "./types";
import {
  ArrowRight,
  Shield,
  Zap,
  Network,
  Database,
  GitBranch,
  Radio,
  Cpu,
  Layers,
} from "lucide-react";

interface ArchitectureCardProps {
  pattern: ArchitecturePattern;
  index?: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  security: <Shield className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  resilience: <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  microservices: <Network className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  caching: <Database className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  devops: <GitBranch className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  realtime: <Radio className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
};

const CATEGORY_NAMES: Record<string, string> = {
  security: "Security & Auth",
  resilience: "Resilience & Traffic",
  microservices: "Microservices & Gateway",
  caching: "Caching & Performance",
  devops: "CI/CD & DevOps",
  realtime: "Real-time & Messaging",
};

export const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  pattern,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner":
      case "Cơ bản":
        return "text-emerald-700 bg-emerald-50 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60";
      case "Intermediate":
      case "Trung bình":
        return "text-sky-700 bg-sky-50 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/60";
      case "Advanced":
      case "Nâng cao":
        return "text-amber-700 bg-amber-50 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60";
      case "Expert":
      case "Chuyên sâu":
        return "text-purple-700 bg-purple-50 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const categoryIcon = CATEGORY_ICONS[pattern.category] || <Cpu className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
  const categoryLabel = CATEGORY_NAMES[pattern.category] || pattern.category;

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#262C36] bg-white dark:bg-[#161B22] p-5 sm:p-6 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-1">
      {/* Top Header: Category, Difficulty, Node Count */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#1E242E] border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-foreground">
            {categoryIcon}
            <span className="font-mono text-[11px] uppercase tracking-wider">{categoryLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Level Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                pattern.difficulty
              )}`}
            >
              {pattern.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/architecture/${pattern.id}`} className="block group/title">
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover/title:text-[#FF5A1F] transition-colors">
            {pattern.title}
          </h3>
        </Link>

        {/* Narrative Flow Section with arrow progression */}
        <div className="rounded-xl bg-slate-50/80 dark:bg-[#1C222C]/90 border border-slate-200/60 dark:border-[#2D3542] p-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide font-mono">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Kịch bản luồng xử lý:</span>
          </div>

          {/* Narrative context */}
          <p className="text-xs text-foreground/80 font-medium leading-relaxed italic border-l-2 border-slate-300 dark:border-slate-600 pl-2.5">
            &ldquo;{pattern.flowNarrative}&rdquo;
          </p>

          {/* Step-by-step breakdown with arrows */}
          {pattern.flowSteps && pattern.flowSteps.length > 0 && (
            <div className="space-y-1.5 pt-1 text-[11px] text-muted-foreground border-t border-border/40">
              {pattern.flowSteps.slice(0, 3).map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="line-clamp-1 text-slate-700 dark:text-slate-300">{step.replace(/^\d+\.\s*/, "")}</span>
                </div>
              ))}
              {pattern.flowSteps.length > 3 && (
                <div className="text-[10px] text-muted-foreground/75 font-mono pt-0.5 flex items-center gap-1">
                  <span>→</span>
                  <span>{pattern.flowSteps.length - 3} bước tiếp theo trong sơ đồ</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#232934] flex items-center justify-between gap-3">
        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {pattern.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/40 truncate max-w-[120px]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* View Flow Action */}
        <Link
          href={`/architecture/${pattern.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-[#FF5A1F] transition-colors group-hover:translate-x-0.5 shrink-0"
        >
          <span>Khám phá sơ đồ</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF5A1F]" />
        </Link>
      </div>
    </article>
  );
};
