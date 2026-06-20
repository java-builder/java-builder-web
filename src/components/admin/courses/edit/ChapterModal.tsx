"use client";

import { BookOpen, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChapterModalProps {
  isOpen: boolean;
  editId: string;
  chapterName: string;
  description: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onChapterNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function ChapterModal({
  isOpen,
  editId,
  chapterName,
  description,
  isSubmitting,
  onClose,
  onSave,
  onChapterNameChange,
  onDescriptionChange,
}: ChapterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/40 dark:bg-black/60 transition-opacity" 
        onClick={() => !isSubmitting && onClose()} 
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal content */}
        <div className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden mx-4 z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent dark:text-accent-on-dark" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editId ? "Chỉnh sửa chương" : "Thêm chương mới"}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-1.5 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Tên chương <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={chapterName}
                onChange={(e) => onChapterNameChange(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                placeholder="Nhập tên chương"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground resize-none"
                placeholder="Nhập mô tả chương (tùy chọn)"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-border bg-muted/40 rounded-b-xl">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="accent"
              onClick={onSave}
              disabled={isSubmitting}
              className="gap-2 font-medium"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin w-4 h-4 text-background" />
              )}
              {editId ? "Cập nhật" : "Thêm chương"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
