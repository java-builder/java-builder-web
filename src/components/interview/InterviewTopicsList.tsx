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
  const { t, locale } = useI18n();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
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
