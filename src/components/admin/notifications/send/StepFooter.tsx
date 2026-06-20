"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  isFinal?: boolean;
  isSubmitting?: boolean;
}

export default function StepFooter({
  onBack,
  onNext,
  nextLabel = "Tiếp tục",
  isFinal,
  isSubmitting,
}: StepFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      ) : (
        <span />
      )}

      {onNext && (
        <Button
          type="button"
          variant="accent"
          onClick={onNext}
          disabled={isSubmitting}
          className="gap-1.5 font-semibold"
        >
          {isFinal ? <Send className="h-4 w-4" /> : null}
          {nextLabel}
          {!isFinal && <ArrowRight className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
