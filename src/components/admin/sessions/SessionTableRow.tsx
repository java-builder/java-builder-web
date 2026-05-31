import Image from "next/image";
import { UserSession } from "@/types/session";
import { formatReadableDate } from "@/utils/dateUtils";
import { getProviderBadge, getStatusBadge } from "./SessionBadges";

interface SessionTableRowProps {
  session: UserSession;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onViewDetails: (session: UserSession) => void;
}

export const SessionTableRow = ({ session, imageErrors, onImageError, onViewDetails }: SessionTableRowProps) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {session.avatar && !imageErrors.has(session.sessionId) ? (
              <Image 
                src={session.avatar} 
                alt={session.username || 'User avatar'} 
                width={36} 
                height={36} 
                className="rounded-full object-cover" 
                onError={() => onImageError(session.sessionId)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-semibold text-sm">
                {session.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={session.username}>{session.username}</div>
            <div className="text-xs text-gray-500 dark:text-gray-300 truncate max-w-[150px]" title={session.email}>{session.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 align-top whitespace-nowrap">{getProviderBadge(session.provider)}</td>
      <td className="px-4 py-3 align-top whitespace-nowrap">{getStatusBadge(session.status)}</td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top">
        <div className="max-w-[140px] truncate" title={`${session.browser} ${session.browserVersion}`}>
          {session.browser} {session.browserVersion}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top">
        <div className="max-w-[120px]">
          <div className="truncate" title={session.device}>{session.device}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300 truncate" title={session.os}>{session.os}</div>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700 dark:text-gray-200 align-top whitespace-nowrap">{session.ipAddress}</td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 align-top whitespace-nowrap text-xs">{formatReadableDate(session.createdAt)}</td>
      <td className="px-4 py-3 text-center align-top">
        <button
          onClick={() => onViewDetails(session)}
          className="p-1.5 text-blue-600 bg-blue-100/50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:bg-slate-700/40 dark:hover:bg-slate-700 dark:text-blue-200"
          title="Xem chi tiết"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};
