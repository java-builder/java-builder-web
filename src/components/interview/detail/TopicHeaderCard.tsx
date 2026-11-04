"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpenCheck, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicHeaderCardProps {
  topicName: string;
  topicDescription?: string;
  thumbnailUrl?: string;
  topicId: string;
  totalQuestionSets: number;
  totalQuestions: number;
  backLabel?: string;
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
  contributeLabel,
  questionSetsLabel,
  questionsLabel,
}: TopicHeaderCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      {/* Body */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start min-w-0 flex-1">
            {thumbnailUrl && (
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2">
                <Image
                  src={thumbnailUrl}
                  alt={topicName}
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {topicName}
              </h1>
              {topicDescription && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
                  {topicDescription}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Button asChild size="sm">
              <Link
                href={`/interview/contribute?topicId=${topicId}&topicName=${encodeURIComponent(topicName)}`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{contributeLabel}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex flex-col divide-y divide-border border-t border-border bg-muted/20 sm:flex-row sm:divide-x sm:divide-y-0">
        <KpiCell
          icon={<Layers className="h-4 w-4 text-primary" />}
          label={questionSetsLabel}
          value={totalQuestionSets}
        />
        <KpiCell
          icon={<BookOpenCheck className="h-4 w-4 text-primary" />}
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
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
        {value.toLocaleString("vi-VN")}
      </p>
    </div>
  );
}
