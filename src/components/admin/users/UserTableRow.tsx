import Image from "next/image";
import { UserDetailResponse, UserStatus } from "@/types/user";
import { formatReadableDate } from "@/utils/dateUtils";

const StatusBadge = ({ status }: { status: UserStatus | string }) => {
  const getStatusConfig = (status: UserStatus | string) => {
    switch (status) {
      case "ACTIVE":
        return { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", text: "Hoạt động" };
      case "INACTIVE":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          text: "Không hoạt động",
        };
      case "BANNED":
        return { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", text: "Bị cấm" };
      default:
        return { color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", text: status };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};

const getRoleClass = (role: string) => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
    case "ROLE_ADMIN":
      return "bg-indigo-100 text-indigo-800";
    case "MODERATOR":
    case "ROLE_MODERATOR":
      return "bg-blue-100 text-blue-800";
    case "TEACHER":
    case "INSTRUCTOR":
      return "bg-emerald-100 text-emerald-800";
    case "OWNER":
    case "SUPERADMIN":
    case "ROLE_SUPERADMIN":
      return "bg-red-100 text-red-800";
    case "USER":
      return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.avatar ? (
              <div className="relative h-10 w-10">
                <Image
                  src={user.avatar}
                  alt={user.username || user.email || "User avatar"}
                  fill
                  sizes="40px"
                  className="rounded-full object-cover"
                />
              </div>
            ) : null}
            <div
              className={`h-10 w-10 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center ${user.avatar ? "hidden" : ""}`}
            >
              <span className="text-sm font-medium text-white">
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.username}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-gray-200 max-w-[180px] truncate" title={user.email}>{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.userStatus} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {(user.authorities || []).map((role) => (
            <span
              key={role}
              className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md whitespace-nowrap ${getRoleClass(role)}`}
            >
              {role}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.mftEnable ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
          {user.mftEnable ? "ON" : "OFF"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {user.createdAt ? formatReadableDate(user.createdAt) : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Sửa
          </button>
          <button
            onClick={() => onDelete(user.id, user.username)}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-800 text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xóa...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
