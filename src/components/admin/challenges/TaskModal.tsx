"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChallengeTaskResponse,
  CreateChallengeTaskRequest,
  UpdateChallengeTaskRequest,
} from "@/types/challenge";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengeTaskRequest | UpdateChallengeTaskRequest) => Promise<void>;
  initialData?: ChallengeTaskResponse | null;
  dayId: string;
  dayNumber: number;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  dayId,
  dayNumber,
}: TaskModalProps) {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setOrderIndex(initialData.orderIndex || 1);
    } else {
      setTitle("");
      setOrderIndex(1);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      if (isEdit) {
        await onSubmit({
          title: title.trim(),
          orderIndex,
        } as UpdateChallengeTaskRequest);
      } else {
        await onSubmit({
          challengeDayId: dayId,
          title: title.trim(),
          orderIndex,
        } as CreateChallengeTaskRequest);
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
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEdit
                  ? `Chỉnh sửa bài tập Ngày ${dayNumber}`
                  : `Thêm bài tập mới cho Ngày ${dayNumber}`}
              </h2>
              <p className="text-xs text-muted-foreground">
                Nhiệm vụ hoặc bài tập thực hành học viên cần hoàn thành
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
              Tiêu đề bài tập / nhiệm vụ <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cài đặt JDK 21 và kiểm tra lệnh javac trong terminal"
              className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Thứ tự hiển thị (Order Index)
            </label>
            <input
              type="number"
              min={1}
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
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
                  <span>{isEdit ? "Cập nhật bài tập" : "Thêm bài tập"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
