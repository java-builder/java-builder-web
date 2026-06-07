"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSubmissionById } from "@/hooks/useExerciseSubmissions";
import { chatbotApi } from "@/services/chatbot.service";
import type { QuizAnalysisRequest, QuizAnalysisResponse } from "@/types/chatbot";
import {
  AiCoachPanel,
  QuizAnalysisModal,
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

  const [activeFilter, setActiveFilter] = useState<QuestionFilter>("all");
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState<AiAnalysisStatus>("idle");
  const [analysis, setAnalysis] = useState<QuizAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

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

  const handleSelectQuestion = (questionId: string) => {
    setActiveFilter("all");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`question-${questionId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const handleRunAiAnalysis = useCallback(async () => {
    if (!result) return;
    if (aiAnalysisStatus === "loading") return;

    const wrongCount = result.results.filter((q) => !q.isCorrect).length;
    const answers: QuizAnalysisRequest["answers"] = result.results.map((q) => {
      const sortedOptions = [...q.options].sort(
        (a, b) => a.orderIndex - b.orderIndex,
      );
      const letterById = new Map<string, string>();
      sortedOptions.forEach((opt, idx) => {
        letterById.set(opt.id, String.fromCharCode(65 + idx));
      });
      const userSelectedIds = q.userSelectedOptionIds || [];
      return {
        questionContent: q.content,
        userAnswers: sortedOptions
          .filter((o) => userSelectedIds.includes(o.id))
          .map((o) => letterById.get(o.id) || ""),
        correctAnswers: sortedOptions
          .filter((o) => o.isCorrect)
          .map((o) => letterById.get(o.id) || ""),
      };
    });

    const payload: QuizAnalysisRequest = {
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      wrongCount,
      answers,
    };

    setAiAnalysisStatus("loading");
    setAnalysisError(null);
    try {
      const res = await chatbotApi.analysisQuiz(payload);
      if (res.data) {
        setAnalysis(res.data);
        setAiAnalysisStatus("done");
      } else {
        throw new Error("Không nhận được dữ liệu phân tích.");
      }
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Có lỗi xảy ra khi gọi AI. Vui lòng thử lại.";
      setAnalysisError(message);
      setAiAnalysisStatus("error");
    }
  }, [result, aiAnalysisStatus]);

  const handleOpenAnalysisModal = () => {
    setIsAnalysisModalOpen(true);
    // Auto-start analysis if idle
    if (aiAnalysisStatus === "idle") {
      handleRunAiAnalysis();
    }
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
          onChangeFilter={setActiveFilter}
        />

        <AiCoachPanel
          status={aiAnalysisStatus}
          onOpen={handleOpenAnalysisModal}
        />

        <QuizAnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          status={aiAnalysisStatus}
          analysis={analysis}
          errorMessage={analysisError}
          scorePercentage={scorePercentage}
          counts={counts}
          tone={tone}
          onRunAnalysis={handleRunAiAnalysis}
          onJumpToFilter={setActiveFilter}
        />
      </div>
    </div>
  );
}
