"use client";

import { Layers, TableProperties } from "lucide-react";
import { LevelId, RoadmapLevel } from "./types";

interface RoadmapHeroProps {
  levels: RoadmapLevel[];
  activeLevel: LevelId;
  onSelectLevel: (lvl: LevelId) => void;
  activeView: "roadmap" | "matrix";
  onSelectView: (v: "roadmap" | "matrix") => void;
}

export default function RoadmapHero({
  levels,
  activeLevel,
  onSelectLevel,
  activeView,
  onSelectView,
}: RoadmapHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
      {/* Subtle brand orange halo like on other JavaBuilder hero sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,31,0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {/* Top Header & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6">
          <div className="max-w-2xl space-y-2 sm:space-y-2.5">
            <div className="inline-flex items-center rounded-full border border-[#FFD8C7] bg-[#FFF0E8] dark:border-orange-900/50 dark:bg-orange-950/40 px-3 py-1 text-xs font-semibold text-[#FF5A1F]">
              <span>Khung năng lực kỹ sư phần mềm</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#171717] dark:text-foreground">
              Lộ Trình Sự Nghiệp{" "}
              <span className="text-[#FF5A1F]">Java Backend</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
              Khung tiêu chuẩn kỹ thuật phân cấp từ Intern đến Senior. Định hướng kỹ năng cần học, dự án thực chiến và tiêu chí phỏng vấn cho từng giai đoạn.
            </p>
          </div>

          {/* View Switcher Toggle - Chuẩn style hệ thống */}
          <div className="inline-flex rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/40 p-1 flex-shrink-0 self-start md:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => onSelectView("roadmap")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${activeView === "roadmap"
                ? "bg-[#FF5A1F] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#171717] dark:text-slate-400 dark:hover:text-foreground"
                }`}
            >
              <Layers className="h-4 w-4" />
              Lộ trình chi tiết
            </button>
            <button
              type="button"
              onClick={() => onSelectView("matrix")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${activeView === "matrix"
                ? "bg-[#FF5A1F] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#171717] dark:text-slate-400 dark:hover:text-foreground"
                }`}
            >
              <TableProperties className="h-4 w-4" />
              So sánh 5 Level
            </button>
          </div>
        </div>

        {/* Level Underline Tabs (Scroll mượt edge-to-edge trên mobile) */}
        {activeView === "roadmap" && (
          <div className="flex space-x-3 sm:space-x-8 overflow-x-auto scrollbar-none border-t border-[#E8E8E8] dark:border-border -mx-4 px-4 sm:mx-0 sm:px-0">
            {levels.map((lvl) => {
              const isActive = activeLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 px-1 border-b-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "border-[#FF5A1F] text-[#FF5A1F] font-bold"
                    : "border-transparent text-[#64748B] hover:text-[#171717] dark:text-slate-400 dark:hover:text-foreground hover:border-[#E8E8E8]"
                    }`}
                >
                  <span>{lvl.title}</span>
                  <span
                    className={`text-[10px] sm:text-[11px] font-normal transition ${isActive ? "text-[#FF5A1F]/80" : "text-[#64748B]/80 dark:text-slate-500"
                      }`}
                  >
                    ({lvl.vietnameseTitle})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
