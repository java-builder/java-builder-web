import { useState, useCallback } from 'react';
import { UserAnswer } from '@/types/submission';

export const useExerciseAnswers = () => {
  const [userAnswers, setUserAnswers] = useState<Map<string, string[]>>(new Map());

  const handleAnswerChange = useCallback((questionId: string, optionId: string, isMultiple: boolean) => {
    const newAnswers = new Map(userAnswers);
    
    if (isMultiple) {
      const currentAnswers = newAnswers.get(questionId) || [];
      if (currentAnswers.includes(optionId)) {
        newAnswers.set(questionId, currentAnswers.filter(id => id !== optionId));
      } else {
        newAnswers.set(questionId, [...currentAnswers, optionId]);
      }
    } else {
      newAnswers.set(questionId, [optionId]);
    }
    
    setUserAnswers(newAnswers);
  }, [userAnswers]);

  const getAnswersArray = useCallback((): UserAnswer[] => {
    return Array.from(userAnswers.entries()).map(([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds
    }));
  }, [userAnswers]);

  const getAnsweredCount = useCallback(() => {
    return userAnswers.size;
  }, [userAnswers]);

  const reset = useCallback(() => {
    setUserAnswers(new Map());
  }, []);

  return {
    userAnswers,
    handleAnswerChange,
    getAnswersArray,
    getAnsweredCount,
    reset,
  };
};
