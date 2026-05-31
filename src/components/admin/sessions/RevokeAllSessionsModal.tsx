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
      <div className="fixed inset-0 backdrop-blur-sm bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-center text-orange-600 dark:text-orange-400 mb-1">Thu hồi tất cả phiên</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-300 mb-4">
          Đăng xuất khỏi tất cả thiết bị
        </p>
        
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{username}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 truncate">ID: {userId}</div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 text-center">
          Tất cả phiên đăng nhập sẽ bị thu hồi
        </p>
        
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
            className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm rounded-lg transition-colors font-medium"
          >
            {isRevoking ? "Đang xử lý..." : "Thu hồi"}
          </button>
        </div>
      </div>
    </div>
  );
};
