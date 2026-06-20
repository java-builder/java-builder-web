import Image from "next/image";
import { UserDetailResponse, UserStatus } from "@/types/user";
import { formatReadableDate } from "@/utils/dateUtils";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const StatusBadge = ({ status }: { status: UserStatus | string }) => {
  const getStatusConfig = (status: UserStatus | string) => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          text: "Hoạt động"
        };
      case "INACTIVE":
        return {
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          text: "Không hoạt động",
        };
      case "BANNED":
        return {
          color: "bg-destructive/10 text-destructive border-destructive/25",
          text: "Bị cấm"
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          text: status
        };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.text}
    </span>
  );
};

const getRoleClass = (role: string) => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
    case "ROLE_ADMIN":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25";
    case "MODERATOR":
    case "ROLE_MODERATOR":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
    case "TEACHER":
    case "INSTRUCTOR":
      return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25";
    case "OWNER":
    case "SUPERADMIN":
    case "ROLE_SUPERADMIN":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25";
    case "USER":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

interface UserTableRowProps {
  user: UserDetailResponse;
  isDeleting: boolean;
  onEdit: (user: UserDetailResponse) => void;
  onDelete: (id: string, userName: string) => void;
}

export const UserTableRow = ({ user, isDeleting, onEdit, onDelete }: UserTableRowProps) => {
  return (
    <TableRow className="transition-colors duration-200">
      <TableCell className="px-4 py-3 max-w-[200px] truncate">
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 h-9 w-9">
            {user.avatar ? (
              <div className="relative h-9 w-9">
                <Image
                  src={user.avatar}
                  alt={user.username || user.email || "User avatar"}
                  fill
                  sizes="36px"
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div
                className="h-9 w-9 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center"
              >
                <span className="text-xs font-medium text-white">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate" title={user.username}>
              {user.username}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 max-w-[180px] truncate" title={user.email}>
        {user.email}
      </TableCell>
      <TableCell className="px-4 py-3">
        <StatusBadge status={user.userStatus} />
      </TableCell>
      <TableCell className="px-4 py-3 max-w-[200px]">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {(user.authorities || []).map((role) => (
            <span
              key={role}
              className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border ${getRoleClass(role)}`}
            >
              {role}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${user.mftEnable ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : "bg-muted text-muted-foreground border-border"}`}>
          {user.mftEnable ? "Bật" : "Tắt"}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
        {user.createdAt ? formatReadableDate(user.createdAt) : "N/A"}
      </TableCell>
      <TableCell className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            className="h-8 gap-1 px-2.5 text-xs font-medium"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user.id, user.username)}
            disabled={isDeleting}
            className="h-8 gap-1 px-2.5 text-xs font-medium"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Xóa
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
