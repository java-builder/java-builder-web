import { useState, useCallback } from 'react';
import { submissionApi } from '@/services/submission.service';
import { ExerciseSubmissionResponse, UserAnswer } from '@/types/submission';
import { toast } from 'react-hot-toast';

export const useExerciseSubmission = () => {
  const [submission, setSubmission] = useState<ExerciseSubmissionResponse | null>(null);
  const [submissionResult, setSubmissionResult] = useState<ExerciseSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const startExercise = useCallback(async (exerciseId: string) => {
    try {
      setLoading(true);
      const response = await submissionApi.startExercise(exerciseId);
      
      if (response.data) {
        setSubmission(response.data);
        setIsStarted(true);
        toast.success('Bắt đầu làm bài! Chúc bạn may mắn 🍀');
        return response.data;
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể bắt đầu làm bài');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitExercise = useCallback(async (submissionId: string, answers: UserAnswer[]) => {
    try {
      setSubmitting(true);
      
      const response = await submissionApi.submitExercise({
        submissionId,
        answers
      });

      if (response.data) {
        setSubmissionResult(response.data);
        setIsSubmitted(true);
        toast.success('Nộp bài thành công! 🎉');
        return response.data;
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể nộp bài');
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSubmission(null);
    setSubmissionResult(null);
    setIsStarted(false);
    setIsSubmitted(false);
    setLoading(false);
    setSubmitting(false);
  }, []);

  return {
    submission,
    submissionResult,
    loading,
    submitting,
    isStarted,
    isSubmitted,
    startExercise,
    submitExercise,
    reset,
  };
};
