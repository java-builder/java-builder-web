"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  FolderGit2,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react";
import { RoadmapLevel, Importance } from "./types";

interface RoadmapLevelCardProps {
  level: RoadmapLevel;
}

export default function RoadmapLevelCard({ level }: RoadmapLevelCardProps) {
  const [expandedCheckpoints, setExpandedCheckpoints] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedCheckpoints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllInPillar = (pillarCheckpoints: { id: string }[]) => {
    setExpandedCheckpoints((prev) => {
      const next = new Set(prev);
      const allExpanded = pillarCheckpoints.every((cp) => next.has(cp.id));
      if (allExpanded) {
        pillarCheckpoints.forEach((cp) => next.delete(cp.id));
      } else {
        pillarCheckpoints.forEach((cp) => next.add(cp.id));
      }
      return next;
    });
  };

  const getImportanceBadge = (importance: Importance) => {
    switch (importance) {
      case "must-have":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold border border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400">
            Bắt buộc
          </span>
        );
      case "recommended":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-300">
            Khuyên dùng
          </span>
        );
      case "bonus":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold border border-[#E8E8E8] bg-[#F8F8F8] text-[#64748B] dark:border-border dark:bg-muted dark:text-slate-300">
            Điểm cộng
          </span>
        );
    }
  };

  return (
    <div id={`roadmap-level-${level.id}`} className="space-y-4 sm:space-y-6">
      {/* 1. Level Overview Card */}
      <section className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Header Row: Title, Experience */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center rounded-lg border border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400 px-2.5 py-1 text-xs sm:text-sm font-bold tracking-wide">
              {level.title}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#171717] dark:text-foreground">
              {level.vietnameseTitle}
            </span>
            <span className="inline-flex items-center rounded-full border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/40 px-2.5 py-0.5 text-[11px] sm:text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {level.experience}
            </span>
          </div>

          {/* Level Summary */}
          <p className="text-xs sm:text-sm lg:text-base text-[#171717]/85 dark:text-foreground/90 leading-relaxed max-w-4xl">
            {level.summary}
          </p>

          {/* Key Competencies (4 Thẻ Chuẩn Năng Lực) */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
              Chuẩn năng lực đầu ra trong dự án thực tế:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {level.responsibilities.map((resp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/60 dark:bg-muted/20 p-3 sm:p-3.5 hover:border-[#FF5A1F]/40 transition group"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF0E8] dark:bg-orange-950/50 text-[#FF5A1F] border border-[#FFD8C7] dark:border-orange-900/50 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#171717]/90 dark:text-foreground/90 leading-snug">
                    {resp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pillars & Checkpoints List (Trực tiếp vào nội dung các phần) */}
      <section className="space-y-4 sm:space-y-6">
        {level.pillars.map((pillar, pIdx) => {
          const cleanTitle = pillar.title.replace(/^\d+\.\s*/, "");
          const hasInterviewOrPitfall = pillar.checkpoints.some(
            (cp) => (cp.interviewQuestions?.length ?? 0) > 0 || (cp.pitfalls?.length ?? 0) > 0
          );

          return (
            <article
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              className="scroll-mt-24 rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface overflow-hidden shadow-xs hover:shadow-md hover:shadow-[#FF5A1F]/5 transition-all"
            >
              {/* Pillar Header */}
              <div className="border-b border-[#E8E8E8] dark:border-border p-4 sm:p-5 lg:p-6 bg-[#F8F8F8]/70 dark:bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[#FFD8C7] bg-[#FFF0E8] text-[#FF5A1F] dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400 text-xs sm:text-sm font-black flex-shrink-0">
                    {pIdx + 1 < 10 ? `0${pIdx + 1}` : pIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#171717] dark:text-foreground">
                      {cleanTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-0.5 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0 pt-1 sm:pt-0">
                  <span className="rounded-full border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#64748B] dark:text-slate-300">
                    {pillar.checkpoints.length} chuyên đề
                  </span>
                  {hasInterviewOrPitfall && (
                    <button
                      type="button"
                      onClick={() => expandAllInPillar(pillar.checkpoints)}
                      className="rounded-lg border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#64748B] hover:text-[#FF5A1F] hover:border-[#FF5A1F]/40 dark:text-slate-300 dark:hover:text-[#FF5A1F] transition cursor-pointer"
                    >
                      Bật/Tắt chi tiết
                    </button>
                  )}
                </div>
              </div>

              {/* Checkpoints List */}
              <div className="p-3.5 sm:p-5 lg:p-6 space-y-3 sm:space-y-3.5">
                {pillar.checkpoints.map((cp) => {
                  const isExpanded = expandedCheckpoints.has(cp.id);
                  const hasDetails =
                    (cp.interviewQuestions && cp.interviewQuestions.length > 0) ||
                    (cp.pitfalls && cp.pitfalls.length > 0) ||
                    Boolean(cp.resourceLink);

                  return (
                    <div
                      key={cp.id}
                      className="rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-3.5 sm:p-4 transition-all hover:border-[#FF5A1F]/40"
                    >
                      <div className="space-y-2.5 sm:space-y-3">
                        {/* Checkpoint Title & Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FF5A1F] flex-shrink-0" />
                            <h4 className="text-xs sm:text-sm lg:text-base font-bold text-[#171717] dark:text-foreground">
                              {cp.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 pl-3.5 sm:pl-0">
                            {getImportanceBadge(cp.importance)}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
                          {cp.desc}
                        </p>

                        {/* Skills and Expand Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {cp.skills.map((skill, si) => (
                              <span
                                key={si}
                                className="rounded-md border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/40 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {hasDetails && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(cp.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A1F] hover:underline self-start sm:self-auto flex-shrink-0 cursor-pointer pt-1 sm:pt-0"
                            >
                              <span>
                                {isExpanded
                                  ? "Thu gọn chi tiết"
                                  : `Xem lưu ý & phỏng vấn (${(cp.interviewQuestions?.length || 0) +
                                  (cp.pitfalls?.length || 0)
                                  })`}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Expanded details (Interview questions, pitfalls, link) */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#E8E8E8] dark:border-border space-y-2.5 sm:space-y-3 text-xs animate-in fade-in duration-150">
                            {cp.interviewQuestions && cp.interviewQuestions.length > 0 && (
                              <div className="rounded-xl border border-[#FFD8C7] bg-[#FFF0E8]/50 dark:border-orange-900/40 dark:bg-orange-950/20 p-3 sm:p-3.5">
                                <div className="font-bold text-[#171717] dark:text-foreground flex items-center gap-1.5 sm:gap-2 mb-2 text-xs">
                                  <HelpCircle className="h-4 w-4 text-[#FF5A1F] flex-shrink-0" />
                                  <span>Câu hỏi phỏng vấn trọng tâm:</span>
                                </div>
                                <ul className="space-y-1.5 text-[#171717]/85 dark:text-slate-300 text-xs">
                                  {cp.interviewQuestions.map((q, qi) => (
                                    <li key={qi} className="flex items-start gap-1.5 sm:gap-2">
                                      <span className="font-bold text-[#FF5A1F] flex-shrink-0">Q{qi + 1}:</span>
                                      <span className="leading-relaxed">{q}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {cp.pitfalls && cp.pitfalls.length > 0 && (
                              <div className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 p-3 sm:p-3.5">
                                <div className="font-bold text-[#171717] dark:text-foreground flex items-center gap-1.5 sm:gap-2 mb-2 text-xs">
                                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                  <span>Lỗi thường gặp cần tránh:</span>
                                </div>
                                <ul className="space-y-1.5 text-[#64748B] dark:text-slate-300 text-xs">
                                  {cp.pitfalls.map((pf, pfi) => (
                                    <li key={pfi} className="flex items-start gap-1.5 sm:gap-2">
                                      <span className="font-bold text-amber-500 flex-shrink-0">⚠</span>
                                      <span className="leading-relaxed">{pf}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {cp.resourceLink && (
                              <div className="flex justify-end pt-1">
                                <Link
                                  href={cp.resourceLink.href}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5A1F] hover:underline"
                                >
                                  <span>{cp.resourceLink.label}</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      {/* 3. Project Recommendation Footer */}
      {level.projects && level.projects.length > 0 && (
        <section className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-4 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#171717] dark:text-foreground mb-3">
            <FolderGit2 className="h-4.5 w-4.5 text-[#FF5A1F]" />
            <span>Dự án thực chiến đề xuất cho Level {level.title}:</span>
          </div>

          <div className="space-y-3">
            {level.projects.map((proj, pji) => (
              <div
                key={pji}
                className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/70 dark:bg-muted/20 p-3.5 sm:p-4 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-[#171717] dark:text-foreground">
                    {proj.title}
                  </h4>
                  <span className="inline-flex items-center rounded-md border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-2.5 py-0.5 text-xs font-semibold text-[#64748B] dark:text-slate-300 self-start sm:self-auto">
                    Độ khó: {proj.difficulty}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                <div className="text-xs pt-0.5">
                  <span className="font-semibold text-[#171717] dark:text-foreground">Kiến trúc nổi bật: </span>
                  <span className="text-[#64748B] dark:text-slate-400">{proj.architectureHighlight}</span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1.5">
                  {proj.techStack.map((tech, ti) => (
                    <span
                      key={ti}
                      className="rounded border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#171717] dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Typical Interview Topics Footer */}
      {level.typicalInterviewTopics && (
        <section className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-4 sm:p-6 shadow-xs">
          <div className="text-sm font-bold text-[#171717] dark:text-foreground mb-3 flex items-center gap-2">
            <BookmarkCheck className="h-4.5 w-4.5 text-[#FF5A1F]" />
            <span>Chủ đề trọng tâm khi phỏng vấn Level {level.title}:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {level.typicalInterviewTopics.map((top, ti) => (
              <div
                key={ti}
                className="flex items-start gap-2 rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 p-2.5 sm:p-3 text-xs text-[#171717]/85 dark:text-slate-300"
              >
                <span className="text-[#FF5A1F] font-bold mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{top}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
