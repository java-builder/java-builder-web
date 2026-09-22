"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RejectModalProps {
  onClose: () => void;
  onConfirm: () => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
}

export default function RejectModal({
  onClose,
  onConfirm,
  rejectReason,
  setRejectReason,
}: RejectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Dialog container */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Từ chối câu hỏi
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vui lòng nhập lý do để phản hồi lại người đóng góp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              Lý do từ chối <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do từ chối chi tiết..."
              className="flex w-full rounded-xl border border-input bg-background/50 p-3 text-sm shadow-2xs transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:border-rose-500 resize-none text-foreground leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-muted/20 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={!rejectReason.trim()}
            className="cursor-pointer"
          >
            Xác nhận từ chối
          </Button>
        </div>
      </div>
    </div>
  );
}
