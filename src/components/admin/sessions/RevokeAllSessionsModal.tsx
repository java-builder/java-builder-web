import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2 } from "lucide-react";

interface RevokeAllSessionsModalProps {
  userId: string;
  username: string;
  isRevoking: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const RevokeAllSessionsModal = ({ userId, username, isRevoking, onConfirm, onClose }: RevokeAllSessionsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Container */}
      <div className="relative w-full max-w-md bg-card border border-border text-foreground rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-500/10 rounded-full">
          <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-500" />
        </div>
        
        <h3 className="text-lg font-bold text-center text-foreground mb-1">Thu hồi tất cả phiên</h3>
        <p className="text-sm text-center text-muted-foreground mb-4">
          Người dùng sẽ bị đăng xuất khỏi tất cả thiết bị hiện tại.
        </p>
        
        <div className="p-3 bg-muted/50 border border-border rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground truncate">{username}</div>
              <div className="text-xs text-muted-foreground truncate">ID: {userId}</div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-6 text-center">
          Mọi phiên truy cập hiện tại sẽ bị xóa hoàn toàn.
        </p>
        
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
