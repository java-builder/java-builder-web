'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { exerciseApi } from '@/services/exercise.service';
import { ExerciseDetailResponse, Difficulty, ExerciseType } from '@/types/exercise';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ExerciseStartScreen from '@/components/exercises/ExerciseStartScreen';
import ExerciseHeader from '@/components/exercises/ExerciseHeader';
import QuestionCard from '@/components/exercises/QuestionCard';
import ExerciseFooter from '@/components/exercises/ExerciseFooter';
import ExerciseResultScreen from '@/components/exercises/ExerciseResultScreen';
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
      case 'EASY': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HARD': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
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
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <ExerciseHeader
          title={exercise.title}
          difficulty={exercise.difficulty}
          timeRemaining={timeRemaining}
          onExit={handleExit}
          getDifficultyColor={getDifficultyColor}
          getDifficultyLabel={getDifficultyLabel}
          formatTime={formatTime}
        />

        {/* Questions */}
        <div className="space-y-4">
          {exercise.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              selectedOptions={userAnswers.get(question.id) || []}
              isSubmitted={isSubmitted}
              onAnswerChange={handleAnswerChange}
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
    </div>
  );
}
