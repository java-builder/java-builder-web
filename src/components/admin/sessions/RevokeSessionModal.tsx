import { UserSession } from "@/types/session";

interface RevokeSessionModalProps {
  session: UserSession;
  isRevoking: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const RevokeSessionModal = ({ session, isRevoking, onConfirm, onClose }: RevokeSessionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/30 rounded-full">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-1">Xác nhận thu hồi phiên</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
          Người dùng sẽ bị đăng xuất khỏi thiết bị này
        </p>
        
        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg mb-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Session:</span>
            <span className="font-mono text-xs text-gray-800 dark:text-gray-200">{session.sessionId.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">IP:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{session.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Thiết bị:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{session.device}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onClose} 
            disabled={isRevoking}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isRevoking}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm rounded-lg transition-colors font-medium"
          >
            {isRevoking ? "Đang xử lý..." : "Thu hồi"}
          </button>
        </div>
      </div>
    </div>
  );
};
