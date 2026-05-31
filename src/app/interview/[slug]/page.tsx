"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import Link from "next/link";
import {
  InterviewTopicDetailResponse,
  pickTopicTranslation,
  pickQuestionSetTranslation,
} from "@/types/interview";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";
import { useQuestionSets } from "@/hooks/useQuestionSets";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

export default function InterviewCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useI18n();

  const { topics: allTopics, isLoading: isLoadingTopics } = useInterviewTopics();
  const { questionSets, isLoading: isLoadingSets } = useQuestionSets(slug);
  const [topic, setTopic] = useState<InterviewTopicDetailResponse | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    if (!isLoadingTopics && allTopics.length > 0) {
      const foundTopic = allTopics.find((t) => t.slug === slug);
      if (foundTopic) {
        setTopic(foundTopic);
      } else {
        toast.error(t("interviewPage.noTopicFound"));
      }
    }
  }, [slug, allTopics, isLoadingTopics, t]);

  // Topic display data theo locale
  const topicDisplay = useMemo(() => {
    if (!topic) return null;
    const tr = pickTopicTranslation(topic.translations, locale);
    return {
      name: tr?.name || topic.slug,
      description: tr?.description || "",
    };
  }, [topic, locale]);

  const isLoading = isLoadingTopics || isLoadingSets;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{t("common.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!topic || !topicDisplay) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("interviewPage.noTopicFound")}
          </h1>
          <Link href="/interview" className="text-accent hover:underline">
            {t("interviewPage.back")}
          </Link>
        </div>
      </div>
    );
  }

  const filteredSets =
    selectedLevel === "all" ? questionSets : questionSets.filter((set) => set.level === selectedLevel);

  const totalQuestions = questionSets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "MEDIUM":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "HARD":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return t("exercisesPage.filterEasy");
      case "MEDIUM":
        return t("exercisesPage.filterMedium");
      case "HARD":
        return t("exercisesPage.filterHard");
      default:
        return difficulty;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INTERN":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      case "FRESHER":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "JUNIOR":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "MIDDLE":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "SENIOR":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "INTERN":
        return "Intern";
      case "FRESHER":
        return "Fresher";
      case "JUNIOR":
        return "Junior";
      case "MIDDLE":
        return "Middle";
      case "SENIOR":
        return "Senior";
      default:
        return level;
    }
  };

  const LEVELS = ["all", "INTERN", "FRESHER", "JUNIOR", "MIDDLE", "SENIOR"];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-accent to-accent-600 py-12 md:py-16">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="flex items-start justify-between gap-4 mb-4">
              <Link href="/interview" className="inline-flex items-center text-white/90 hover:text-white text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("interviewPage.back")}
              </Link>

              <Link
                href={`/interview/contribute?topicId=${topic.id}&topicName=${encodeURIComponent(topicDisplay.name)}`}
                className="flex items-center gap-2 px-4 py-2 bg-white text-accent hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{t("interviewPage.contributeQuestion")}</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {topic.thumbnailUrl && (
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden relative">
                  <Image src={topic.thumbnailUrl} alt={topicDisplay.name} width={48} height={48} className="object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{topicDisplay.name}</h1>
                <p className="text-white/90 mt-2">
                  {questionSets.length} {t("interviewPage.questionSetsLabel")} • {totalQuestions} {t("interviewPage.questionsCount")}
                </p>
              </div>
            </div>

            {topicDisplay.description && (
              <p className="text-white/80 text-sm sm:text-base max-w-3xl">{topicDisplay.description}</p>
            )}
          </MotionWrapper>
        </div>
      </section>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLevel === level
                  ? "bg-accent text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              {level === "all" ? t("coursesPage.filterAll") : getLevelText(level)}
            </button>
          ))}
        </div>

        {/* Question Sets Grid */}
        <div className="space-y-4">
          {filteredSets.map((set) => {
            const setTr = pickQuestionSetTranslation(set.translations, locale);
            const setTitle = setTr?.title || set.slug;

            return (
              <Link key={set.id} href={`/interview/${slug}/${set.slug}`} className="block group">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                          {setTitle}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(set.level)}`}>
                          {getLevelText(set.level)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(set.difficulty)}`}>
                          {getDifficultyText(set.difficulty)}
                        </span>
                      </div>

                      {/* Topics */}
                      {set.topics && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {set.topics.split(",").map((topicTag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {topicTag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Stats */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{set.totalQuestions || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("interviewPage.questionsCount")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">{t("interviewPage.noQuestionSetsForLevel")}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("interviewPage.tryChooseAnotherLevel")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
