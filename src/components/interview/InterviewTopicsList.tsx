"use client";

import { InterviewTopicDetailResponse } from "@/types/interview";
import InterviewCategoryCard from "./InterviewCategoryCard";
import InterviewEmptyState from "./InterviewEmptyState";

interface InterviewTopicsListProps {
  topics: InterviewTopicDetailResponse[];
  isLoading: boolean;
}

export default function InterviewTopicsList({
  topics,
  isLoading,
}: InterviewTopicsListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return <InterviewEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => {
        const totalQuestionsInTopic =
          topic.questionSets?.reduce(
            (sum, set) => sum + (set.questions?.length || 0),
            0
          ) || 0;

        return (
          <InterviewCategoryCard
            key={topic.id}
            slug={topic.slug}
            name={topic.name}
            iconPath={topic.thumbnailUrl || "/logos/logo-java.png"}
            description={topic.description || ""}
            totalQuestions={totalQuestionsInTopic}
            levels={["Junior", "Middle", "Senior"]}
            color="text-orange-600 dark:text-orange-400"
          />
        );
      })}
    </div>
  );
}
