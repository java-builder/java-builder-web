import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseFooterProps {
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: () => void;
}

export default function ExerciseFooter({
  answeredCount,
  totalQuestions,
  isSubmitting,
  isSubmitted,
  onSubmit,
}: ExerciseFooterProps) {
  return (
    <div className="mt-5">
      {/* Desktop version: End-of-list summary bar */}
      <div className="hidden md:flex items-center justify-between gap-4 bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs">
        <div className="text-sm text-text-secondary">
          Đã hoàn thành <span className="font-bold text-primary">{answeredCount}</span> /{' '}
          <span className="font-semibold text-foreground">{totalQuestions}</span> câu hỏi
        </div>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || isSubmitted}
          className="px-6 gap-2 font-semibold"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSubmitting ? 'Đang nộp...' : isSubmitted ? 'Đã nộp' : 'Nộp bài'}
        </Button>
      </div>

      {/* Mobile version */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting || isSubmitted}
          className="w-full shadow-lg gap-2 font-semibold"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSubmitting
            ? 'Đang nộp...'
            : isSubmitted
            ? 'Đã nộp'
            : `Nộp bài (${answeredCount}/${totalQuestions})`}
        </Button>
      </div>
    </div>
  );
}
