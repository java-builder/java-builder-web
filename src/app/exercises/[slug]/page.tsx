'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exerciseApi } from '@/services/exercise.service';
import { ExerciseDetailResponse, Difficulty, ExerciseType } from '@/types/exercise';
import ConfirmModal from '@/components/ui/ConfirmModal';
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
    setMarkedQuestions(prev => {
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
      case 'EASY': return 'text-green-700 bg-green-50 border border-green-200/60 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20';
      case 'MEDIUM': return 'text-amber-700 bg-amber-50 border border-amber-200/60 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20';
      case 'HARD': return 'text-rose-700 bg-rose-50 border border-rose-200/60 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20';
      default: return 'text-slate-750 bg-slate-50 border border-slate-200/60 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'EASY': return 'Dễ';
      case 'MEDIUM': return 'Trung bình';
      case 'HARD': return 'Khó';
      default: return difficulty;
    }
  };

  const getExerciseTypeLabel = (type: ExerciseType): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Trắc nghiệm';
      case 'ESSAY': return 'Tự luận';
      case 'CODING': return 'Lập trình';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/5 via-purple-500/5 to-blue-500/5 dark:from-accent/10 dark:via-purple-500/10 dark:to-blue-500/10 dark:bg-slate-900 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back button skeleton */}
          <div className="h-5 w-24 bg-muted rounded animate-pulse mb-4" />

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 sm:p-8 border border-gray-100 dark:border-slate-700 space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col items-center mb-5 space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="h-24 bg-muted rounded-xl animate-pulse" />
              <div className="h-24 bg-muted rounded-xl animate-pulse" />
              <div className="h-24 bg-muted rounded-xl animate-pulse" />
            </div>

            {/* Instructions skeleton */}
            <div className="h-32 bg-muted rounded-lg animate-pulse" />

            {/* Button skeleton */}
            <div className="h-12 bg-muted rounded-xl animate-pulse w-full" />
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

  // Start screen
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

  // Exercise screen
  return (
    <>
      {submitting && <SubmittingOverlay />}
      
      {/* Mobile Question Navigator - Top */}
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
        questionIds={exercise.questions.map(q => q.id)}
        onQuestionClick={handleQuestionClick}
        onExit={handleExit}
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-4 md:py-4 pt-32 md:pt-4">
        <div className="flex gap-4">
          {/* Main content */}
          <div className="flex-1 min-w-0 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Questions */}
              <div className="space-y-4 mb-20 md:mb-4">
                {exercise.questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    selectedOptions={userAnswers.get(question.id) || []}
                    isSubmitted={isSubmitted}
                    isMarked={markedQuestions.has(question.id)}
                    onAnswerChange={handleAnswerChange}
                    onToggleMark={handleToggleMark}
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
          </div>

          {/* Question Navigator Sidebar - Desktop */}
          <div className="hidden lg:block w-96 pr-4 flex-shrink-0">
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
              questionIds={exercise.questions.map(q => q.id)}
              onQuestionClick={handleQuestionClick}
              onExit={handleExit}
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
