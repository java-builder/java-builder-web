import { UserSession } from "@/types/session";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface RevokeSessionModalProps {
  session: UserSession;
  isRevoking: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const RevokeSessionModal = ({ session, isRevoking, onConfirm, onClose }: RevokeSessionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Container */}
      <div className="relative w-full max-w-md bg-card border border-border text-foreground rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-full">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        
        <h3 className="text-lg font-bold text-center text-foreground mb-1">Xác nhận thu hồi phiên</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          Người dùng sẽ bị đăng xuất khỏi thiết bị này lập tức.
        </p>
        
        <div className="p-3 bg-muted/50 border border-border rounded-lg mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phiên:</span>
            <span className="font-mono text-xs text-foreground font-semibold">{session.sessionId.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Địa chỉ IP:</span>
            <span className="font-semibold text-foreground">{session.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thiết bị:</span>
            <span className="font-semibold text-foreground">{session.device}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={onClose} 
            disabled={isRevoking}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm} 
            disabled={isRevoking}
            className="flex-1 gap-1.5"
          >
            {isRevoking && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRevoking ? "Đang xử lý..." : "Thu hồi"}
          </Button>
        </div>
      </div>
    </div>
  );
};
