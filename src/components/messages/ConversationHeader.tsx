import Image from "next/image";
import { Plus, PanelLeftClose } from "lucide-react";
import { EnrolledUserResponse } from "@/services/enrollment.service";

interface ConversationHeaderProps {
  currentUser: EnrolledUserResponse;
  onOpenNewChatModal: () => void;
  onToggleSidebar?: () => void;
}

export default function ConversationHeader({
  currentUser,
  onOpenNewChatModal,
  onToggleSidebar,
}: ConversationHeaderProps) {
  return (
    <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="relative">
          <Image
            src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={currentUser.username || "User"}
            width={40}
            height={40}
            unoptimized
            className="w-10 h-10 rounded-full object-cover border-2 border-border shadow-xs"
          />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            Hộp thoại học tập
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wider">
              PRO
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
            title="Thu gọn danh sách trò chuyện"
          >
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>
        )}

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onOpenNewChatModal}
          style={{ width: "36px", height: "36px", minWidth: "36px", minHeight: "36px", borderRadius: "9999px", padding: 0 }}
          className="p-0 rounded-full shrink-0 flex items-center justify-center bg-accent text-white hover:bg-accent/90 border-0 outline-none transition-transform cursor-pointer hover:scale-105 active:scale-95"
          title="Tạo nhóm / Chat mới"
        >
          <Plus className="w-5 h-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
