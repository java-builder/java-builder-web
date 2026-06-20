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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/60 transition-opacity animate-in fade-in" onClick={onClose} />
        <div className="relative bg-card rounded-xl shadow-xl w-full max-w-md border border-border animate-in zoom-in-95 duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                ❌ Từ chối câu hỏi
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Nhập lý do từ chối câu hỏi này..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200 resize-none"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Lý do này sẽ được gửi cho người đóng góp
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                Hủy
              </Button>
              <Button
                variant="outline"
                onClick={onConfirm}
                disabled={!rejectReason.trim()}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Từ chối
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
