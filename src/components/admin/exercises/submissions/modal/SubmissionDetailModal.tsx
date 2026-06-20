"use client";

import { Loader2 } from "lucide-react";
import { useSubmissionById } from "@/hooks/useExerciseSubmissions";
import ModalShell from "./ModalShell";
import ModalSummary from "./ModalSummary";
import ModalQuestionItem from "./ModalQuestionItem";

interface SubmissionDetailModalProps {
  submissionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDetailModal({
  submissionId,
  isOpen,
  onClose,
}: SubmissionDetailModalProps) {
  const { data: result, isLoading } = useSubmissionById(submissionId);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết bài làm"
      subtitle="Xem lại điểm số và phản hồi từng câu hỏi"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : !result ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Không tìm thấy dữ liệu bài làm.
        </div>
      ) : (
        <div className="space-y-5">
          <ModalSummary
            totalScore={result.totalScore}
            maxScore={result.maxScore}
            correctCount={result.correctCount}
            totalQuestions={result.totalQuestions}
          />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Chi tiết câu hỏi
              </h3>
              <span className="text-xs text-muted-foreground">
                {result.results.length} câu
              </span>
            </div>
            <div className="space-y-3">
              {result.results.map((q, idx) => (
                <ModalQuestionItem
                  key={q.questionId}
                  questionNumber={idx + 1}
                  question={q}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
