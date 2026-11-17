"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CareerMatrixRow, RoadmapLevel } from "./types";

interface RoadmapMatrixProps {
  levels: RoadmapLevel[];
  matrixData: CareerMatrixRow[];
  onSelectLevel: (lvlId: RoadmapLevel["id"]) => void;
}

export default function RoadmapMatrix({
  levels,
  matrixData,
  onSelectLevel,
}: RoadmapMatrixProps) {
  const [selectedCol, setSelectedCol] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center rounded-full border border-[#FFD8C7] bg-[#FFF0E8] dark:border-orange-900/50 dark:bg-orange-950/40 px-2.5 py-0.5 text-xs font-semibold text-[#FF5A1F]">
            <span>Ma trận đánh giá</span>
          </div>
          <h2 className="mt-2 text-lg sm:text-xl font-bold text-[#171717] dark:text-foreground">
            Bảng So Sánh Tiêu Chuẩn Năng Lực 5 Level
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-0.5">
            Đối chiếu sự khác biệt cốt lõi giữa các cấp bậc theo từng khía cạnh kỹ thuật và tư duy thực tế.
          </p>
        </div>

        {/* Quick highlight toggle */}
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <span className="text-[#64748B] dark:text-slate-400 mr-1 text-[11px] font-medium">Highlight:</span>
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedCol(selectedCol === lvl.id ? null : lvl.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                selectedCol === lvl.id
                  ? "border border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400 font-bold"
                  : "border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted text-[#64748B] dark:text-slate-300 hover:text-[#171717] dark:hover:text-foreground"
              }`}
            >
              {lvl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30">
              <th className="p-3.5 font-bold text-[#171717] dark:text-foreground w-1/6">
                Tiêu chí
              </th>
              {levels.map((lvl) => {
                const isHl = selectedCol === lvl.id;
                return (
                  <th
                    key={lvl.id}
                    className={`p-3.5 transition-colors ${
                      isHl ? "bg-[#FFF0E8]/50 dark:bg-orange-950/20" : ""
                    }`}
                  >
                    <div className="font-extrabold text-[#171717] dark:text-foreground text-sm">
                      {lvl.title}
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-slate-400 font-normal">
                      {lvl.vietnameseTitle} ({lvl.experience})
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectLevel(lvl.id)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF5A1F] hover:underline cursor-pointer"
                    >
                      Xem chi tiết <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E8] dark:divide-border">
            {matrixData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-[#F8F8F8]/60 dark:hover:bg-muted/10 transition-colors"
              >
                <td className="p-3.5 align-top">
                  <div className="font-bold text-[#171717] dark:text-foreground">
                    {row.dimension}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
                    {row.description}
                  </div>
                </td>
                <td
                  className={`p-3.5 align-top text-[#64748B] dark:text-slate-300 leading-relaxed ${
                    selectedCol === "intern" ? "bg-[#FFF0E8]/40 dark:bg-orange-950/20 font-medium text-[#171717] dark:text-foreground" : ""
                  }`}
                >
                  {row.intern}
                </td>
                <td
                  className={`p-3.5 align-top text-[#64748B] dark:text-slate-300 leading-relaxed ${
                    selectedCol === "fresher" ? "bg-[#FFF0E8]/40 dark:bg-orange-950/20 font-medium text-[#171717] dark:text-foreground" : ""
                  }`}
                >
                  {row.fresher}
                </td>
                <td
                  className={`p-3.5 align-top text-[#64748B] dark:text-slate-300 leading-relaxed ${
                    selectedCol === "junior" ? "bg-[#FFF0E8]/40 dark:bg-orange-950/20 font-medium text-[#171717] dark:text-foreground" : ""
                  }`}
                >
                  {row.junior}
                </td>
                <td
                  className={`p-3.5 align-top text-[#64748B] dark:text-slate-300 leading-relaxed ${
                    selectedCol === "middle" ? "bg-[#FFF0E8]/40 dark:bg-orange-950/20 font-medium text-[#171717] dark:text-foreground" : ""
                  }`}
                >
                  {row.middle}
                </td>
                <td
                  className={`p-3.5 align-top text-[#64748B] dark:text-slate-300 leading-relaxed ${
                    selectedCol === "senior" ? "bg-[#FFF0E8]/40 dark:bg-orange-950/20 font-medium text-[#171717] dark:text-foreground" : ""
                  }`}
                >
                  {row.senior}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
