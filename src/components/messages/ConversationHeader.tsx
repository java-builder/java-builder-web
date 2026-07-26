import Image from "next/image";
import { Plus } from "lucide-react";
import { EnrolledUserResponse } from "@/services/enrollment.service";

interface ConversationHeaderProps {
  currentUser: EnrolledUserResponse;
  onOpenNewChatModal: () => void;
}

export default function ConversationHeader({
  currentUser,
  onOpenNewChatModal,
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

      {/* New Chat Button */}
      <button
        type="button"
        onClick={onOpenNewChatModal}
        className="p-2.5 rounded-2xl bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
        title="Tạo nhóm / Chat mới"
      >
        <Plus className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}
