"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChallengePhaseResponse,
  CreateChallengePhaseRequest,
  UpdateChallengePhaseRequest,
} from "@/types/challenge";

interface PhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengePhaseRequest | UpdateChallengePhaseRequest) => Promise<void>;
  initialData?: ChallengePhaseResponse | null;
  challengeId: string;
  nextPhaseNumber: number;
}

export default function PhaseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  challengeId,
  nextPhaseNumber,
}: PhaseModalProps) {
  const isEdit = Boolean(initialData);

  const [phaseNumber, setPhaseNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setPhaseNumber(initialData.phaseNumber || 1);
      setTitle(initialData.title || "");
    } else {
      setPhaseNumber(nextPhaseNumber || 1);
      setTitle("");
    }
  }, [initialData, isOpen, nextPhaseNumber]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      if (isEdit) {
        await onSubmit({
          phaseNumber,
          title: title.trim(),
        } as UpdateChallengePhaseRequest);
      } else {
        await onSubmit({
          challengeId,
          phaseNumber,
          title: title.trim(),
        } as CreateChallengePhaseRequest);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit ? "Chỉnh sửa giai đoạn" : "Thêm giai đoạn mới"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Gom nhóm các ngày học thành từng giai đoạn mục tiêu rõ ràng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Số thứ tự giai đoạn (Phase Number) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={phaseNumber}
              onChange={(e) => setPhaseNumber(parseInt(e.target.value) || 1)}
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Tiêu đề giai đoạn <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nền tảng & Khởi động Spring Boot 3"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isEdit ? "Cập nhật giai đoạn" : "Tạo giai đoạn mới"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
