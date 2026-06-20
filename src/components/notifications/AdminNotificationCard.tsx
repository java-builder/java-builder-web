import Image from "next/image";
import { NotificationItem } from "@/types/notification";
import { formatRelativeTime } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { User, Clock, Trash2 } from "lucide-react";

interface AdminNotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  onDelete: (id: string) => void;
}

export default function AdminNotificationCard({ notification, onClick, onDelete }: AdminNotificationCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer border border-transparent transition-all group ${
        notification.isRead
          ? "bg-card hover:bg-muted/50"
          : "bg-accent/5 hover:bg-accent/10 border-accent/10"
      } shadow-sm hover:shadow-md`}
      onClick={() => onClick(notification)}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-accent rounded-r-full" />
      )}

      {/* Avatar */}
      <div className="flex-shrink-0 ml-2">
        {notification.avatar ? (
          <Image
            src={notification.avatar}
            alt={notification.senderName || "Avatar"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-background"
            unoptimized
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {(notification.senderName || notification.title || "U")[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-semibold line-clamp-1 mb-1.5 ${
          notification.isRead 
            ? "text-foreground/80" 
            : "text-foreground font-bold"
        }`}>
          {notification.title}
        </h3>
        <p className={`text-sm line-clamp-2 mb-2 ${
          notification.isRead
            ? "text-muted-foreground"
            : "text-foreground/90"
        }`}>
          {notification.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
          {notification.senderName && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{notification.senderName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(notification.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Xóa thông báo"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
