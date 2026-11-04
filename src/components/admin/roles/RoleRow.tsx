import { Shield, ShieldAlert, Pencil } from "lucide-react";
import { RoleDetailResponse } from "@/types/role";
import { formatReadableDateTime } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";

interface RoleRowProps {
  role: RoleDetailResponse;
  onEdit: (role: RoleDetailResponse) => void;
}

export default function RoleRow({
  role,
  onEdit,
}: RoleRowProps) {
  // Custom colors for different roles
  const getBadgeClass = (name: string) => {
    switch (name) {
      case "ADMIN":
        return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-900/30";
      case "USER":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-950/20 dark:text-emerald-400 dark:ring-emerald-900/30";
      default:
        return "bg-primary-soft text-primary ring-1 ring-inset ring-primary/20 dark:bg-orange-950/30 dark:text-orange-300 dark:ring-primary/30";
    }
  };

  return (
    <tr className="group transition hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
      {/* Name Column */}
      <td className="whitespace-nowrap px-6 py-4 overflow-hidden">
        <div className="flex items-center gap-2">
          {role.name === "ADMIN" ? (
            <ShieldAlert className="h-4 w-4 text-red-500" />
          ) : (
            <Shield className={`h-4 w-4 ${role.name === "USER" ? "text-emerald-500" : "text-primary"}`} />
          )}
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getBadgeClass(role.name)}`}>
            {role.name}
          </span>
        </div>
      </td>

      {/* Description Column */}
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 overflow-hidden truncate" title={role.description}>
        {role.description || "-"}
      </td>

      {/* Created Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 overflow-hidden truncate">
        {formatReadableDateTime(role.createdAt)}
      </td>

      {/* Updated Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 overflow-hidden truncate">
        {formatReadableDateTime(role.updatedAt || role.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium overflow-hidden">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(role)}
            className="h-8 px-3 rounded-full text-xs font-semibold gap-1 hover:text-primary transition-all"
            title="Chỉnh sửa mô tả role"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
        </div>
      </td>
    </tr>
  );
}
