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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Dialog container */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md border border-border overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
          <div className="flex gap-3">
            <div className="w-11 h-11 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Từ chối câu hỏi
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vui lòng nhập lý do để phản hồi lại người đóng góp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors p-2 rounded-lg"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1">
              Lý do từ chối <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do từ chối chi tiết..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent resize-none text-foreground"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/20 border-t border-border rounded-b-2xl">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-10 px-4 rounded-lg font-medium"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!rejectReason.trim()}
            className="bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700 h-10 px-4 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Từ chối câu hỏi
          </Button>
        </div>
      </div>
    </div>
  );
}
