"use client";

import Link from "next/link";
import { ArrowRight, Hash } from "lucide-react";
import { QuestionSetResponse } from "@/types/interview";
import { getDifficultyTone, getLevelTone, LEVEL_LABELS } from "./helpers";

interface QuestionSetItemProps {
  topicSlug: string;
  set: QuestionSetResponse;
  title: string;
  description?: string;
  difficultyLabel: string;
  questionsLabel: string;
}

export default function QuestionSetItem({
  topicSlug,
  set,
  title,
  description,
  difficultyLabel,
  questionsLabel,
}: QuestionSetItemProps) {
  const levelTone = getLevelTone(set.level);
  const difficultyTone = getDifficultyTone(set.difficulty);
  const levelLabel = set.level ? LEVEL_LABELS[set.level] || set.level : null;

  const topicTags = set.topics
    ? set.topics.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/interview/${topicSlug}/${set.slug ?? set.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-accent/40 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {levelLabel && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${levelTone.pill}`}
              >
                {levelLabel}
              </span>
            )}
            {set.difficulty && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${difficultyTone.pill}`}
              >
                {difficultyLabel}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold leading-snug text-gray-900 transition group-hover:text-accent dark:text-white sm:text-lg">
            {title}
          </h3>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}

          {topicTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topicTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                >
                  <Hash className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right stats */}
        <div className="flex flex-shrink-0 flex-col items-end justify-between">
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums text-accent">
              {set.totalQuestions || 0}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {questionsLabel}
            </div>
          </div>
          <ArrowRight className="mt-3 h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
