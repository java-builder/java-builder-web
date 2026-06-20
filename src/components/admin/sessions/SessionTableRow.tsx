import Image from "next/image";
import { UserSession } from "@/types/session";
import { formatLocaleString } from "@/utils/dateUtils";
import { getProviderBadge, getStatusBadge } from "./SessionBadges";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface SessionTableRowProps {
  session: UserSession;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onViewDetails: (session: UserSession) => void;
}

export const SessionTableRow = ({ session, imageErrors, onImageError, onViewDetails }: SessionTableRowProps) => {
  return (
    <TableRow className="transition-colors duration-200">
      <TableCell className="px-4 py-3 align-middle max-w-[200px] truncate">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0">
            {session.avatar && !imageErrors.has(session.sessionId) ? (
              <Image 
                src={session.avatar} 
                alt={session.username || 'User avatar'} 
                width={32} 
                height={32} 
                className="rounded-full object-cover border border-border" 
                onError={() => onImageError(session.sessionId)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center text-white font-semibold text-xs">
                {session.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate" title={session.username}>
              {session.username}
            </div>
            <div className="text-xs text-muted-foreground truncate" title={session.email}>
              {session.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 align-middle">{getProviderBadge(session.provider)}</TableCell>
      <TableCell className="px-4 py-3 align-middle">{getStatusBadge(session.status)}</TableCell>
      <TableCell className="px-4 py-3 align-middle text-foreground max-w-[130px] truncate" title={`${session.browser} ${session.browserVersion}`}>
        {session.browser} {session.browserVersion}
      </TableCell>
      <TableCell className="px-4 py-3 align-middle text-foreground max-w-[120px]">
        <div className="max-w-[120px] text-sm min-w-0">
          <div className="truncate font-medium" title={session.device}>{session.device}</div>
          <div className="text-xs text-muted-foreground truncate" title={session.os}>{session.os}</div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 align-middle text-foreground text-sm max-w-[130px] truncate" title={session.ipAddress}>
        {session.ipAddress}
      </TableCell>
      <TableCell className="px-4 py-3 align-middle text-muted-foreground text-xs whitespace-nowrap">
        {formatLocaleString(session.createdAt)}
      </TableCell>
      <TableCell className="px-4 py-3 align-middle text-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewDetails(session)}
          className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/10 border-border dark:text-accent-on-dark"
          title="Xem chi tiết"
        >
          <Info className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
