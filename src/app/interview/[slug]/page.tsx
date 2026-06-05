"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import {
  InterviewTopicDetailResponse,
  pickQuestionSetTranslation,
  pickTopicTranslation,
} from "@/types/interview";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import { useQuestionSets } from "@/hooks/useQuestionSets";
import { useI18n } from "@/contexts/I18nContext";
import {
  LevelFilterBar,
  QuestionSetEmptyState,
  QuestionSetItem,
  QuestionSetLoadingState,
  TopicHeaderCard,
  type LevelOption,
} from "@/components/interview/detail";

export default function InterviewCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useI18n();

  const { topics: allTopics, isLoading: isLoadingTopics } = useInterviewTopics();
  const { questionSets, isLoading: isLoadingSets } = useQuestionSets(slug);

  const [topic, setTopic] = useState<InterviewTopicDetailResponse | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelOption>("all");

  useEffect(() => {
    if (!isLoadingTopics && allTopics.length > 0) {
      const found = allTopics.find((tp) => tp.slug === slug);
      if (found) {
        setTopic(found);
      } else {
        toast.error(t("interviewPage.noTopicFound"));
      }
    }
  }, [slug, allTopics, isLoadingTopics, t]);

  const topicDisplay = useMemo(() => {
    if (!topic) return null;
    const tr = pickTopicTranslation(topic.translations, locale);
    return {
      name: tr?.name || topic.slug,
      description: tr?.description || "",
    };
  }, [topic, locale]);

  const filteredSets = useMemo(() => {
    if (selectedLevel === "all") return questionSets;
    return questionSets.filter((set) => set.level === selectedLevel);
  }, [questionSets, selectedLevel]);

  const totalQuestions = useMemo(
    () => questionSets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0),
    [questionSets]
  );

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case "EASY":
        return t("exercisesPage.filterEasy");
      case "MEDIUM":
        return t("exercisesPage.filterMedium");
      case "HARD":
        return t("exercisesPage.filterHard");
      default:
        return difficulty || "";
    }
  };

  const isLoading = isLoadingTopics || isLoadingSets;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <QuestionSetLoadingState />
        </div>
      </main>
    );
  }

  if (!topic || !topicDisplay) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-14">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("interviewPage.noTopicFound")}
            </h1>
            <Link
              href="/interview"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("interviewPage.back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:px-8">
        <TopicHeaderCard
          topicId={topic.id}
          topicName={topicDisplay.name}
          topicDescription={topicDisplay.description}
          thumbnailUrl={topic.thumbnailUrl}
          totalQuestionSets={questionSets.length}
          totalQuestions={totalQuestions}
          backLabel={t("interviewPage.back")}
          contributeLabel={t("interviewPage.contributeQuestion")}
          questionSetsLabel={t("interviewPage.questionSetsLabel")}
          questionsLabel={t("interviewPage.questionsCount")}
        />

        <LevelFilterBar
          selected={selectedLevel}
          onChange={setSelectedLevel}
          filterLabel={t("coursesPage.filterLabel") || "Bộ lọc"}
          allLabel={t("coursesPage.filterAll")}
          totalCount={filteredSets.length}
          countLabel={t("interviewPage.questionSetsLabel")}
        />

        {filteredSets.length === 0 ? (
          <QuestionSetEmptyState
            title={t("interviewPage.noQuestionSetsForLevel")}
            description={t("interviewPage.tryChooseAnotherLevel")}
          />
        ) : (
          <div className="space-y-3">
            {filteredSets.map((set) => {
              const setTr = pickQuestionSetTranslation(set.translations, locale);
              return (
                <QuestionSetItem
                  key={set.id}
                  topicSlug={slug}
                  set={set}
                  title={setTr?.title || set.slug || set.id}
                  description={setTr?.description}
                  difficultyLabel={getDifficultyText(set.difficulty)}
                  questionsLabel={t("interviewPage.questionsCount")}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
