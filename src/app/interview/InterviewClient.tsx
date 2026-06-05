"use client";

import { useMemo, useState } from "react";
import {
  InterviewHeroNew,
  InterviewTopicsGrid,
} from "@/components/interview/page";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import { useI18n } from "@/contexts/I18nContext";
import { pickTopicTranslation } from "@/types/interview";

export default function InterviewClient() {
  const { t, locale } = useI18n();
  const [searchText, setSearchText] = useState("");
  const { topics, isLoading, totalQuestions } = useInterviewTopics();

  const filteredTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((topic) => {
      const tr = pickTopicTranslation(topic.translations, locale);
      const name = (tr?.name || "").toLowerCase();
      const description = (tr?.description || "").toLowerCase();
      return name.includes(q) || description.includes(q);
    });
  }, [topics, searchText, locale]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <InterviewHeroNew
        badgeLabel={t("interviewPage.heroBadge")}
        titleStart={t("interviewPage.heroTitleStart")}
        titleAccent={t("interviewPage.heroTitleAccent")}
        description={t("interviewPage.heroDesc")}
        searchPlaceholder={t("interviewPage.searchPlaceholder")}
        searchText={searchText}
        onSearchChange={setSearchText}
        totalQuestions={totalQuestions}
        totalCategories={topics.length}
        statQuestionsLabel={t("interviewPage.statQuestions")}
        statTopicsLabel={t("interviewPage.statTopics")}
        statLevelsLabel={t("interviewPage.statLevels")}
      />

      <section className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:px-8">
        <InterviewTopicsGrid
          topics={filteredTopics}
          isLoading={isLoading}
          questionsLabel={t("interviewPage.questionsCount")}
          viewDetailsLabel={t("interviewPage.viewDetails")}
          emptyTitle={t("interviewPage.noTopicsTitle")}
          emptyDescription={t("interviewPage.noTopicsDesc")}
        />
      </section>
    </main>
  );
}
