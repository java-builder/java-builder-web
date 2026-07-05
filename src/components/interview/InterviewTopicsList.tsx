"use client";

import { InterviewTopicDetailResponse, pickTopicTranslation } from "@/types/interview";
import InterviewCategoryCard from "./InterviewCategoryCard";
import InterviewEmptyState from "./InterviewEmptyState";
import { useI18n } from "@/contexts/I18nContext";

interface InterviewTopicsListProps {
  topics: InterviewTopicDetailResponse[];
  isLoading: boolean;
}

export default function InterviewTopicsList({
  topics,
  isLoading,
}: InterviewTopicsListProps) {
  const { locale } = useI18n();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-3.5 bg-muted rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
            <div className="h-5 bg-muted rounded w-24 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return <InterviewEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => {
        const tr = pickTopicTranslation(topic.translations, locale);
        return (
          <InterviewCategoryCard
            key={topic.id}
            slug={topic.slug}
            name={tr?.name || topic.slug}
            iconPath={topic.thumbnailUrl || "/logos/logo-java.png"}
            description={tr?.description || ""}
            totalQuestions={topic.totalQuestions || 0}
            levels={["Junior", "Middle", "Senior"]}
            color="text-orange-600 dark:text-orange-400"
          />
        );
      })}
    </div>
  );
}
