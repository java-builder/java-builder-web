import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UseExerciseTimerProps {
  initialTime: number; 
  isStarted: boolean;
  isSubmitted: boolean;
  onTimeUp: () => void;
}

export const useExerciseTimer = ({
  initialTime,
  isStarted,
  isSubmitted,
  onTimeUp,
}: UseExerciseTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isStarted && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          if (prev === 60) {
            toast('⚠️ Còn 1 phút! Hãy kiểm tra lại bài làm.', {
              icon: '⏰',
              style: {
                background: '#FEF3C7',
                color: '#92400E',
              },
            });
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, timeRemaining, isSubmitted]);

  useEffect(() => {
    if (isStarted && timeRemaining === 0 && !isSubmitted) {
      toast.error('⏰ Hết thời gian! Tự động nộp bài...');
      onTimeUp();
    }
  }, [timeRemaining, isStarted, isSubmitted, onTimeUp]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    formatTime,
  };
};
