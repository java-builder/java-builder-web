"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  BookOpen,
  Briefcase,
  PenSquare,
  ArrowRight,
} from "lucide-react";
import RoadmapHero from "./RoadmapHero";
import RoadmapLevelCard from "./RoadmapLevelCard";
import RoadmapMatrix from "./RoadmapMatrix";
import { ROADMAP_LEVELS, CAREER_MATRIX_DATA } from "./data/roadmapData";
import { LevelId } from "./types";

export default function RoadmapClient() {
  const [activeLevel, setActiveLevel] = useState<LevelId>("intern");
  const [activeView, setActiveView] = useState<"roadmap" | "matrix">("roadmap");

  const currentLevel = useMemo(() => {
    return ROADMAP_LEVELS.find((l) => l.id === activeLevel) || ROADMAP_LEVELS[0];
  }, [activeLevel]);

  return (
    <main className="min-h-screen bg-[#F8F8F8] dark:bg-background transition-colors pb-16">
      {/* Clean Hero with View Switcher and Underline Level Tabs */}
      <RoadmapHero
        levels={ROADMAP_LEVELS}
        activeLevel={activeLevel}
        onSelectLevel={setActiveLevel}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      <section className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Render ONLY Career Matrix if matrix view is active */}
        {activeView === "matrix" && (
          <RoadmapMatrix
            levels={ROADMAP_LEVELS}
            matrixData={CAREER_MATRIX_DATA}
            onSelectLevel={(lvlId) => {
              setActiveLevel(lvlId);
              setActiveView("roadmap");
            }}
          />
        )}

        {/* Render ONLY the selected Level Card if roadmap view is active */}
        {activeView === "roadmap" && currentLevel && (
          <RoadmapLevelCard
            key={currentLevel.id}
            level={currentLevel}
          />
        )}

        {/* Bottom Platform Resource Links */}
        <div className="pt-8 border-t border-[#E8E8E8] dark:border-border">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Tài nguyên luyện tập trên JavaBuilder:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/challenges"
              className="group flex items-center justify-between rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-3.5 transition hover:border-[#FF5A1F]/40"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-semibold text-foreground group-hover:text-[#FF5A1F] transition">
                  Thử thách 60 ngày
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#FF5A1F] transition" />
            </Link>

            <Link
              href="/courses"
              className="group flex items-center justify-between rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-3.5 transition hover:border-[#FF5A1F]/40"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-semibold text-foreground group-hover:text-[#FF5A1F] transition">
                  Khóa học chuyên sâu
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#FF5A1F] transition" />
            </Link>

            <Link
              href="/interview"
              className="group flex items-center justify-between rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-3.5 transition hover:border-[#FF5A1F]/40"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4 text-teal-500" />
                <span className="text-xs font-semibold text-foreground group-hover:text-[#FF5A1F] transition">
                  Ôn tập phỏng vấn
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#FF5A1F] transition" />
            </Link>

            <Link
              href="/exercises"
              className="group flex items-center justify-between rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-3.5 transition hover:border-[#FF5A1F]/40"
            >
              <div className="flex items-center gap-2.5">
                <PenSquare className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-semibold text-foreground group-hover:text-[#FF5A1F] transition">
                  Bài tập tự động
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#FF5A1F] transition" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
