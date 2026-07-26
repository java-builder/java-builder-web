import Image from "next/image";
import { EnrolledUserResponse } from "@/services/enrollment.service";

interface EnrolledUserItemProps {
  user: EnrolledUserResponse;
  onSelectUser: (user: EnrolledUserResponse) => void;
}

export default function EnrolledUserItem({
  user,
  onSelectUser,
}: EnrolledUserItemProps) {
  const isOnline = user.status === "online";

  return (
    <div
      onClick={() => onSelectUser(user)}
      className="p-3 flex items-start gap-3 transition-all cursor-pointer hover:bg-muted/60 group relative"
    >
      {/* Avatar with Live Online Badge */}
      <div className="relative shrink-0">
        <Image
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
          }
          alt={user.username || "User"}
          width={44}
          height={44}
          unoptimized
          className="w-11 h-11 rounded-full object-cover border border-border shadow-2xs"
        />
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-xs" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h3 className="text-xs font-bold text-foreground truncate flex items-center gap-1.5 min-w-0">
            <span className="truncate">{user.username}</span>
          </h3>
        </div>

        {/* Role or Course Tag */}
        {(user.courseName || user.role) && (
          <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded-md mb-1 inline-block">
            {user.courseName || user.role || "Thành viên"}
          </span>
        )}

        <p className="text-xs text-muted-foreground truncate font-normal">
          Bấm để bắt đầu trò chuyện
        </p>
      </div>
    </div>
  );
}
