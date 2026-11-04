'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exerciseApi } from '@/services/exercise.service';
import { ExerciseDetailResponse, Difficulty, ExerciseType } from '@/types/exercise';
import ConfirmModal from '@/components/ui/confirm-modal';
import ExerciseStartScreen from '@/components/exercises/ExerciseStartScreen';
import QuestionCard from '@/components/exercises/QuestionCard';
import ExerciseFooter from '@/components/exercises/ExerciseFooter';
import ExerciseResultScreen from '@/components/exercises/ExerciseResultScreen';
import QuestionNavigator from '@/components/exercises/QuestionNavigator';
import MobileQuestionNav from '@/components/exercises/MobileQuestionNav';
import SubmittingOverlay from '@/components/exercises/SubmittingOverlay';
import { useExerciseSubmission } from '@/hooks/useExerciseSubmission';
import { useExerciseTimer } from '@/hooks/useExerciseTimer';
import { useExerciseAnswers } from '@/hooks/useExerciseAnswers';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { toast } from 'react-hot-toast';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [exercise, setExercise] = useState<ExerciseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    submission,
    submissionResult,
    submitting,
    isStarted,
    isSubmitted,
    startExercise,
    submitExercise: submitExerciseApi,
  } = useExerciseSubmission();

  const {
    userAnswers,
    handleAnswerChange,
    getAnswersArray,
    getAnsweredCount,
  } = useExerciseAnswers();

  const submitExercise = useCallback(async () => {
    if (!submission) return;

    setShowSubmitConfirm(false);
    const answers = getAnswersArray();
    await submitExerciseApi(submission.submissionId, answers);
  }, [submission, getAnswersArray, submitExerciseApi]);

  const handleToggleMark = useCallback((questionId: string) => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const handleQuestionClick = useCallback((index: number) => {
    setCurrentQuestion(index);
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const getAnsweredQuestionsSet = useCallback(() => {
    const set = new Set<string>();
    if (exercise) {
      exercise.questions.forEach((q, idx) => {
        const answers = userAnswers.get(q.id);
        if (answers && answers.length > 0) {
          set.add(`q-${idx}`);
        }
      });
    }
    return set;
  }, [exercise, userAnswers]);

  const { timeRemaining, formatTime } = useExerciseTimer({
    initialTime: exercise?.timeLimit ? exercise.timeLimit * 60 : 0,
    isStarted,
    isSubmitted,
    onTimeUp: submitExercise,
  });

  useBeforeUnload({
    enabled: isStarted && !isSubmitted,
    message: 'Bạn đang làm bài tập. Nếu tải lại trang, bài làm sẽ bị mất!',
  });

  const fetchExerciseDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await exerciseApi.getExerciseBySlug(slug);
      if (response.data) {
        setExercise(response.data);
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể tải bài tập');
      router.push('/exercises');
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchExerciseDetail();
  }, [fetchExerciseDetail]);

  const handleStartExercise = async () => {
    if (!exercise) return;
    await startExercise(exercise.id);
  };

  const handleExit = () => {
    if (isStarted && !isSubmitted) {
      setShowExitConfirm(true);
    } else {
      router.push('/exercises');
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    router.push('/exercises');
  };

  const handleSubmit = async () => {
    if (!exercise) return;

    const unansweredCount = exercise.questions.length - getAnsweredCount();
    if (unansweredCount > 0 && !isSubmitted) {
      setShowSubmitConfirm(true);
      return;
    }

    await submitExercise();
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-success-soft text-success border-success/20';
      case 'MEDIUM':
        return 'bg-warning-soft text-warning border-warning/20';
      case 'HARD':
        return 'bg-error-soft text-error border-error/20';
      default:
        return 'bg-muted text-text-secondary border-border';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'EASY':
        return 'Dễ';
      case 'MEDIUM':
        return 'Trung bình';
      case 'HARD':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const getExerciseTypeLabel = (type: ExerciseType): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'Trắc nghiệm';
      case 'ESSAY':
        return 'Tự luận';
      case 'CODING':
        return 'Lập trình';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-border space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="h-8 bg-muted rounded-lg w-2/3 animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 divide-x divide-border bg-muted/25">
                <div className="h-24 p-5 animate-pulse" />
                <div className="h-24 p-5 animate-pulse" />
                <div className="h-24 p-5 animate-pulse" />
              </div>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 h-64 animate-pulse" />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6 h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return null;
  }

  if (isSubmitted && submissionResult) {
    return (
      <ExerciseResultScreen
        exercise={exercise}
        result={submissionResult}
        onExit={handleExit}
      />
    );
  }

  if (!isStarted) {
    return (
      <ExerciseStartScreen
        exercise={exercise}
        onStart={handleStartExercise}
        onExit={handleExit}
        getDifficultyColor={getDifficultyColor}
        getDifficultyLabel={getDifficultyLabel}
        getExerciseTypeLabel={getExerciseTypeLabel}
      />
    );
  }

  return (
    <>
      {submitting && <SubmittingOverlay />}

      <MobileQuestionNav
        title={exercise.title}
        difficulty={exercise.difficulty}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColor}
        getDifficultyLabel={getDifficultyLabel}
        totalQuestions={exercise.questions.length}
        currentQuestion={currentQuestion}
        answeredQuestions={getAnsweredQuestionsSet()}
        markedQuestions={markedQuestions}
        questionIds={exercise.questions.map((q) => q.id)}
        onQuestionClick={handleQuestionClick}
        onExit={handleExit}
      />

      <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="space-y-4 mb-20 md:mb-4">
              {exercise.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  isCurrent={currentQuestion === index}
                  selectedOptions={userAnswers.get(question.id) || []}
                  isSubmitted={isSubmitted}
                  isMarked={markedQuestions.has(question.id)}
                  onAnswerChange={handleAnswerChange}
                  onToggleMark={handleToggleMark}
                  onFocusQuestion={setCurrentQuestion}
                />
              ))}
            </div>

            <ExerciseFooter
              answeredCount={getAnsweredCount()}
              totalQuestions={exercise.questions.length}
              isSubmitting={submitting}
              isSubmitted={isSubmitted}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Question Navigator Sidebar - Desktop */}
          <div className="hidden lg:block w-80 xl:w-88 shrink-0 sticky top-20">
            <QuestionNavigator
              title={exercise.title}
              difficulty={exercise.difficulty}
              timeRemaining={timeRemaining}
              formatTime={formatTime}
              getDifficultyColor={getDifficultyColor}
              getDifficultyLabel={getDifficultyLabel}
              totalQuestions={exercise.questions.length}
              currentQuestion={currentQuestion}
              answeredQuestions={getAnsweredQuestionsSet()}
              markedQuestions={markedQuestions}
              questionIds={exercise.questions.map((q) => q.id)}
              onQuestionClick={handleQuestionClick}
              onExit={handleExit}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
              isSubmitted={isSubmitted}
            />
          </div>
        </div>

        {/* Modals */}
        <ConfirmModal
          isOpen={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          onConfirm={confirmExit}
          title="Xác nhận thoát"
          message="Bạn có chắc muốn thoát? Bài làm sẽ không được lưu."
          confirmText="Thoát"
          cancelText="Hủy"
          type="warning"
        />

        <ConfirmModal
          isOpen={showSubmitConfirm}
          onClose={() => setShowSubmitConfirm(false)}
          onConfirm={submitExercise}
          title="Xác nhận nộp bài"
          message={`Bạn còn ${exercise.questions.length - getAnsweredCount()} câu chưa trả lời. Bạn có chắc muốn nộp bài?`}
          confirmText="Nộp bài"
          cancelText="Hủy"
          type="warning"
          isLoading={submitting}
        />
      </div>
    </>
  );
}
