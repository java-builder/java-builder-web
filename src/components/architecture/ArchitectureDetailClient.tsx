"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArchitecturePattern } from "./types";
import { FlowCanvas } from "./FlowCanvas";
import { ArchitectureCard } from "./ArchitectureCard";
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  Compass,
} from "lucide-react";

interface ArchitectureDetailClientProps {
  pattern: ArchitecturePattern;
  relatedPatterns: ArchitecturePattern[];
}

export const ArchitectureDetailClient: React.FC<ArchitectureDetailClientProps> = ({
  pattern,
  relatedPatterns,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    pattern.initialNodes[0]?.id || ""
  );

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner":
      case "Cơ bản":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "Intermediate":
      case "Trung bình":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400";
      case "Advanced":
      case "Nâng cao":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400";
      case "Expert":
      case "Chuyên sâu":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/architecture"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-[#FF5A1F] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Tất cả luồng kiến trúc (Architecture Catalog)</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
              pattern.difficulty
            )}`}
          >
            {pattern.difficulty}
          </span>
        </div>
      </div>

      {/* Pattern Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface border border-[#E8E8E8] dark:border-border shadow-xs space-y-5">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {pattern.title}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {pattern.summary}
          </p>
        </div>

        {/* Step-by-Step Execution Sequence (Compact, professional pipeline) */}
        {pattern.flowSteps && pattern.flowSteps.length > 0 && (
          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Kịch bản luồng xử lý từng bước:</span>
              </span>
              {pattern.flowNarrative && (
                <span className="text-[11px] text-muted-foreground italic">
                  &ldquo;{pattern.flowNarrative}&rdquo;
                </span>
              )}
            </div>

            {/* Compact, neatly structured pipeline grid with clear bold action titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {pattern.flowSteps.map((step, idx) => {
                const cleanStep = step.replace(/^\d+\.\s*/, "");
                const colonIdx = cleanStep.indexOf(":");
                const hasColon = colonIdx > -1 && colonIdx < 40;
                const title = hasColon ? cleanStep.slice(0, colonIdx).trim() : `Bước ${idx + 1}`;
                const desc = hasColon ? cleanStep.slice(colonIdx + 1).trim() : cleanStep;

                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#161B22]/80 border border-slate-200/80 dark:border-slate-800 hover:border-[#FF5A1F]/50 hover:bg-white dark:hover:bg-[#1C222C] transition-all shadow-2xs"
                  >
                    <div>
                      {/* Step Header: Number Tag + Action Title + Flow Arrow */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-[#FFF0E8] dark:bg-orange-950/60 text-[#FF5A1F] border border-[#FFD8C7] dark:border-orange-900/50 text-[10px] font-bold font-mono">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                          <span className="text-xs font-bold text-foreground truncate">
                            {title}
                          </span>
                        </div>
                        {idx < pattern.flowSteps.length - 1 && (
                          <span className="hidden lg:inline-block text-slate-300 dark:text-slate-600 font-mono text-xs shrink-0">
                            →
                          </span>
                        )}
                      </div>

                      {/* Step Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Architectural Highlights / Benefit */}
        <div className="pt-3 border-t border-border/60 flex items-start gap-3 bg-slate-50 dark:bg-[#161B22] p-3.5 rounded-2xl border border-border text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground font-bold">Lợi ích kiến trúc: </strong>
            <span className="text-muted-foreground font-medium">{pattern.keyBenefit}</span>
          </div>
        </div>
      </div>

      {/* Interactive React Flow Canvas (Compact scale as Image 3) */}
      <FlowCanvas
        pattern={pattern}
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
      />

      {/* Recommended / Other Architecture Patterns Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg font-bold text-foreground">
              Gợi ý các kiến trúc khác (Recommended Architectures)
            </h2>
          </div>
          <Link
            href="/architecture"
            className="text-xs font-bold text-[#FF5A1F] hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPatterns.map((relPattern, idx) => (
            <ArchitectureCard
              key={relPattern.id}
              pattern={relPattern}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
