import Image from "next/image";
import { UserSession } from "@/types/session";
import { formatReadableDate } from "@/utils/dateUtils";
import { getProviderBadge, getStatusBadge } from "./SessionBadges";

interface SessionDetailModalProps {
  session: UserSession;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onClose: () => void;
  onRevokeSession: (session: UserSession) => void;
  onRevokeAllSessions: (userId: string, username: string) => void;
}

export const SessionDetailModal = ({ 
  session, 
  imageErrors, 
  onImageError, 
  onClose, 
  onRevokeSession, 
  onRevokeAllSessions 
}: SessionDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/10" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-10 ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-0 dark:border dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết phiên đăng nhập</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-md bg-gray-50 dark:bg-slate-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* User Info */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            {session.avatar && !imageErrors.has(session.sessionId) ? (
              <Image 
                src={session.avatar} 
                alt={session.username || 'User avatar'} 
                width={48} 
                height={48} 
                className="rounded-full object-cover" 
                onError={() => onImageError(session.sessionId)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-semibold text-lg">
                {session.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{session.username}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300 truncate">{session.email}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Session ID</div>
            <div className="font-medium text-gray-800 dark:text-gray-200 font-mono text-xs">{session.sessionId}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Nguồn</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{getProviderBadge(session.provider)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Trạng thái</div>
            <div className="font-medium">{getStatusBadge(session.status)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Trình duyệt</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{session.browser} {session.browserVersion}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Hệ điều hành</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{session.os}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Thiết bị</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{session.device}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">IP</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{session.ipAddress}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500 dark:text-gray-300">Thời gian</div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{formatReadableDate(session.createdAt)}</div>
          </div>
        </div>
        
        {/* Actions */}
        {session.status === 'ACTIVE' && (
          <div className="mt-6 flex gap-2">
            <button 
              onClick={() => { 
                onRevokeSession(session); 
                onClose(); 
              }} 
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Thu hồi phiên
            </button>
            <button 
              onClick={() => { 
                onRevokeAllSessions(session.userId, session.username); 
                onClose(); 
              }} 
              className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Thu hồi tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
