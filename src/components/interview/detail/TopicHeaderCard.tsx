"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpenCheck, Layers, Plus } from "lucide-react";

interface TopicHeaderCardProps {
  topicName: string;
  topicDescription?: string;
  thumbnailUrl?: string;
  topicId: string;
  totalQuestionSets: number;
  totalQuestions: number;
  backLabel: string;
  contributeLabel: string;
  questionSetsLabel: string;
  questionsLabel: string;
}

export default function TopicHeaderCard({
  topicName,
  topicDescription,
  thumbnailUrl,
  topicId,
  totalQuestionSets,
  totalQuestions,
  backLabel,
  contributeLabel,
  questionSetsLabel,
  questionsLabel,
}: TopicHeaderCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Top row: back + contribute */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>

        <Link
          href={`/interview/contribute?topicId=${topicId}&topicName=${encodeURIComponent(topicName)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-accent-600"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{contributeLabel}</span>
        </Link>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {thumbnailUrl && (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-600 dark:bg-slate-700">
              <Image
                src={thumbnailUrl}
                alt={topicName}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {topicName}
            </h1>
            {topicDescription && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                {topicDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex flex-col divide-y divide-gray-200 border-t border-gray-200 dark:divide-slate-700 dark:border-slate-700 sm:flex-row sm:divide-x sm:divide-y-0">
        <KpiCell
          icon={<Layers className="h-4 w-4 text-accent" />}
          label={questionSetsLabel}
          value={totalQuestionSets}
        />
        <KpiCell
          icon={<BookOpenCheck className="h-4 w-4 text-accent" />}
          label={questionsLabel}
          value={totalQuestions}
        />
      </div>
    </div>
  );
}

interface KpiCellProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function KpiCell({ icon, label, value }: KpiCellProps) {
  return (
    <div className="flex-1 px-5 py-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
        {value.toLocaleString("vi-VN")}
      </p>
    </div>
  );
}
