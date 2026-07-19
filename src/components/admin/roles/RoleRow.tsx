import { Shield, ShieldAlert, Pencil } from "lucide-react";
import { RoleDetailResponse } from "@/types/role";
import { formatReadableDateTime } from "@/utils/dateUtils";

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
        return "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10 dark:bg-indigo-950/20 dark:text-indigo-400 dark:ring-indigo-900/30";
    }
  };

  return (
    <tr className="group transition hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
      {/* Name Column */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          {role.name === "ADMIN" ? (
            <ShieldAlert className="h-4 w-4 text-red-500" />
          ) : (
            <Shield className={`h-4 w-4 ${role.name === "USER" ? "text-emerald-500" : "text-indigo-500"}`} />
          )}
          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${getBadgeClass(role.name)}`}>
            {role.name}
          </span>
        </div>
      </td>

      {/* Description Column */}
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={role.description}>
        {role.description || "-"}
      </td>

      {/* Created Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatReadableDateTime(role.createdAt)}
      </td>

      {/* Updated Date */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatReadableDateTime(role.updatedAt || role.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(role)}
            title="Chỉnh sửa mô tả role"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
