"use client";

import { useI18n } from "@/contexts/I18nContext";
import {
  InterviewTopicDetailResponse,
  pickTopicTranslation,
} from "@/types/interview";
import InterviewTopicCard from "./InterviewTopicCard";
import InterviewEmptyStateNew from "./InterviewEmptyStateNew";
import InterviewLoadingState from "./InterviewLoadingState";

interface InterviewTopicsGridProps {
  topics: InterviewTopicDetailResponse[];
  isLoading: boolean;
  questionsLabel: string;
  viewDetailsLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export default function InterviewTopicsGrid({
  topics,
  isLoading,
  questionsLabel,
  viewDetailsLabel,
  emptyTitle,
  emptyDescription,
}: InterviewTopicsGridProps) {
  const { locale } = useI18n();

  if (isLoading) {
    return <InterviewLoadingState />;
  }

  if (topics.length === 0) {
    return (
      <InterviewEmptyStateNew title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => {
        const tr = pickTopicTranslation(topic.translations, locale);
        return (
          <InterviewTopicCard
            key={topic.id}
            slug={topic.slug}
            name={tr?.name || topic.slug}
            iconPath={topic.thumbnailUrl || "/logos/logo-java.png"}
            description={tr?.description || ""}
            totalQuestions={topic.totalQuestions || 0}
            levels={["Junior", "Middle", "Senior"]}
            questionsLabel={questionsLabel}
            viewDetailsLabel={viewDetailsLabel}
          />
        );
      })}
    </div>
  );
}
