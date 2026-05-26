"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { InterviewQuestionResponse } from "@/services/interview-question.service";
import { useInterviewQuestions } from "@/hooks/useInterviewQuestions";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { useI18n } from "@/contexts/I18nContext";

export default function InterviewSetPage() {
  const params = useParams();
  const router = useRouter();
  const setSlug = params.setSlug as string;
  const { t } = useI18n();

  const { questionSet, questions, isLoading } = useInterviewQuestions(setSlug);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestionResponse | null>(null);

  useEffect(() => {
    if (questions.length > 0 && !selectedQuestion) {
      setSelectedQuestion(questions[0]);
    }
  }, [questions, selectedQuestion]);

  const handleQuestionClick = (question: InterviewQuestionResponse) => {
    setSelectedQuestion(question);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "MEDIUM": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "HARD": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return t("exercisesPage.filterEasy");
      case "MEDIUM": return t("exercisesPage.filterMedium");
      case "HARD": return t("exercisesPage.filterHard");
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-20 text-center">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{t("common.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("interviewPage.noQuestionSetTitle")}
          </h1>
          <button
            onClick={() => router.back()}
            className="text-accent hover:underline"
          >
            {t("interviewPage.back")}
          </button>
        </div>
      </div>
    );
  }

  const selectedQuestionIndex = selectedQuestion
    ? questions.findIndex((question) => question.id === selectedQuestion.id)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 md:py-8">
        <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent mb-5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("interviewPage.back")}
          </button>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-accent to-accent-600 p-6 md:p-8 text-white mb-8 shadow-xl shadow-accent/10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1 max-w-3xl">
                <span className="inline-flex items-center px-3 py-1 bg-white/15 border border-white/20 rounded-full text-sm font-semibold mb-3 backdrop-blur">
                  {questionSet.level}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">{questionSet.title}</h1>
                <p className="text-white/85 text-sm md:text-base leading-relaxed">
                  {t("interviewPage.setSubtitle")}
                </p>
              </div>
              <div className="flex w-full sm:w-auto flex-col sm:flex-row lg:flex-col gap-3">
                <div className="rounded-xl bg-white/15 border border-white/20 px-5 py-3 backdrop-blur">
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-xs text-white/80">{t("interviewPage.questionsCountLabel")}</div>
                </div>
                <Link
                  href={`/interview/contribute?questionSetId=${questionSet.id}&questionSetTitle=${encodeURIComponent(questionSet.title)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-accent hover:bg-gray-50 rounded-xl font-semibold transition-colors text-sm shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{t("interviewPage.addQuestion")}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 overflow-hidden sticky top-4 shadow-sm backdrop-blur">
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                      {t("interviewPage.questionList")}
                    </h2>
                    <span className="rounded-full bg-white dark:bg-slate-700 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-slate-600">
                      {questions.length}
                    </span>
                  </div>
                </div>

                <div className="p-3 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {questions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                      Chưa có câu hỏi nào
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {questions.map((question, index) => {
                        const isActive = selectedQuestion?.id === question.id;

                        return (
                          <button
                            key={question.id}
                            onClick={() => handleQuestionClick(question)}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 border ${
                              isActive
                                ? "bg-slate-50 text-gray-950 border-gray-200 shadow-sm dark:bg-slate-700/60 dark:text-white dark:border-slate-600"
                                : "text-gray-600 dark:text-gray-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isActive
                                  ? "bg-accent text-white shadow-sm"
                                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300"
                              }`}>
                                {index + 1}
                              </span>
                              <span className="line-clamp-2 flex-1 leading-relaxed font-medium">{question.question}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9">
              {selectedQuestion ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="p-5 md:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/70">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                        {getDifficultyLabel(selectedQuestion.difficulty)}
                      </span>
                      {selectedQuestionIndex >= 0 && (
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {t("interviewPage.questionNumber").replace("{index}", String(selectedQuestionIndex + 1)).replace("{total}", String(questions.length))}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-white leading-relaxed">
                      {selectedQuestion.question}
                    </h2>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-gray-200 bg-accent/5 dark:bg-slate-900/40 dark:border-slate-700 p-5 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                          <h3 className="font-bold text-gray-950 dark:text-white">
                            {t("interviewPage.sampleAnswer")}
                          </h3>
                        </div>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
                          <PublicMarkdownRenderer
                            content={selectedQuestion.answer}
                            className="prose-hr:border-gray-200 dark:prose-hr:border-slate-700 prose-hr:my-6"
                          />
                        </div>
                      </div>

                      {selectedQuestion.tips && (
                        <div className="rounded-2xl border border-gray-200 bg-white dark:bg-slate-900/40 dark:border-slate-700 p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </span>
                            <h3 className="font-bold text-gray-950 dark:text-white">
                              {t("interviewPage.goodTips")}
                            </h3>
                          </div>
                          <div className="text-[15px] text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                            {selectedQuestion.tips}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-10 md:p-16 text-center shadow-sm">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {t("interviewPage.noQuestions")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("interviewPage.emptySetDesc")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MotionWrapper>
      </div>

    </div>
  );
}
