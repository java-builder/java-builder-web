"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSubmissionById } from "@/hooks/useExerciseSubmissions";
import {
  AiCoachPanel,
  QuestionListSection,
  QuestionNavigator,
  ReviewHeader,
  ReviewLoadingState,
  ReviewNotFoundState,
  SubmissionScoreCard,
  getScoreTone,
} from "@/components/my-exercises/review";
import type {
  AiAnalysisStatus,
  QuestionFilter,
} from "@/components/my-exercises/review";

export default function SubmissionReviewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;
  const { data: result, isLoading } = useSubmissionById(submissionId);

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<QuestionFilter>("all");
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState<AiAnalysisStatus>("idle");

  // Auto-expand all questions when data loads
  useEffect(() => {
    if (result) {
      setExpandedQuestions(new Set(result.results.map((q) => q.questionId)));
    }
  }, [result]);

  const counts = useMemo(() => {
    if (!result) return { all: 0, correct: 0, incorrect: 0, skipped: 0 };
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    for (const q of result.results) {
      const hasAnswer = (q.userSelectedOptionIds || []).length > 0;
      if (q.isCorrect) correct += 1;
      else if (hasAnswer) incorrect += 1;
      else skipped += 1;
    }
    return { all: result.results.length, correct, incorrect, skipped };
  }, [result]);

  const filteredQuestions = useMemo(() => {
    if (!result) return [];
    return result.results.filter((q) => {
      const hasAnswer = (q.userSelectedOptionIds || []).length > 0;
      if (activeFilter === "correct") return q.isCorrect;
      if (activeFilter === "incorrect") return !q.isCorrect && hasAnswer;
      if (activeFilter === "skipped") return !hasAnswer;
      return true;
    });
  }, [result, activeFilter]);

  const handleToggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleExpandAll = () => {
    if (!result) return;
    setExpandedQuestions(new Set(result.results.map((q) => q.questionId)));
  };

  const handleCollapseAll = () => setExpandedQuestions(new Set());

  const handleSelectQuestion = (questionId: string) => {
    setActiveFilter("all");
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`question-${questionId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const handleRunAiAnalysis = () => {
    if (aiAnalysisStatus === "loading") return;
    setAiAnalysisStatus("loading");
    // TODO: replace with real API call
    setTimeout(() => setAiAnalysisStatus("done"), 1600);
  };

  const handleRetry = () => {
    if (!result) return;
    router.push(`/exercises/${result.exerciseSlug}`);
  };

  if (isLoading) return <ReviewLoadingState />;
  if (!result) return <ReviewNotFoundState />;

  const scorePercentage = Math.round((result.totalScore / result.maxScore) * 100);
  const accuracyPercentage = Math.round(
    (result.correctCount / result.totalQuestions) * 100
  );
  const tone = getScoreTone(scorePercentage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-4 px-3 sm:space-y-6 sm:px-4 lg:px-8">
        <ReviewHeader onRetry={handleRetry} />

        <SubmissionScoreCard
          scorePercentage={scorePercentage}
          accuracyPercentage={accuracyPercentage}
          totalScore={result.totalScore}
          maxScore={result.maxScore}
          submittedAt={result.submittedAt}
          counts={counts}
          tone={tone}
        />

        <QuestionNavigator
          questions={result.results}
          onSelectQuestion={handleSelectQuestion}
        />

        <QuestionListSection
          questions={result.results}
          filteredQuestions={filteredQuestions}
          counts={counts}
          activeFilter={activeFilter}
          expandedQuestions={expandedQuestions}
          onChangeFilter={setActiveFilter}
          onToggleQuestion={handleToggleQuestion}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        <AiCoachPanel
          status={aiAnalysisStatus}
          scorePercentage={scorePercentage}
          accuracyPercentage={accuracyPercentage}
          counts={counts}
          tone={tone}
          onRunAnalysis={handleRunAiAnalysis}
          onJumpToFilter={setActiveFilter}
        />
      </div>
    </div>
  );
}
