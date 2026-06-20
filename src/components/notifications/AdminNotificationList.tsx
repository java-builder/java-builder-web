import { NotificationItem } from "@/types/notification";
import AdminNotificationCard from "./AdminNotificationCard";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Loader2 } from "lucide-react";

interface AdminNotificationListProps {
  notifications: NotificationItem[];
  onNotificationClick: (notification: NotificationItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function AdminNotificationList({
  notifications,
  onNotificationClick,
  onDelete,
  isLoading,
  hasMore,
  onLoadMore,
}: AdminNotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Không có thông báo</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <AdminNotificationCard
          key={notification.id}
          notification={notification}
          onClick={onNotificationClick}
          onDelete={onDelete}
        />
      ))}

      {/* Load More Button */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      )}

      {hasMore && onLoadMore && !isLoading && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={onLoadMore}
            className="text-accent hover:text-accent/80 hover:bg-accent/10 font-semibold"
          >
            <span>Xem thêm</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
