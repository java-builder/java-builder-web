"use client";

import { Users, Loader2, RotateCcw } from "lucide-react";
import { UserDetailResponse } from "@/types/user";
import { UserTableRow } from "./UserTableRow";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";
import { useResizableColumns, ResizableColumn } from "@/hooks/useResizableColumns";

interface UsersTableProps {
  users: UserDetailResponse[];
  isLoading: boolean;
  totalElements: number;
  hasFilter?: boolean;
  deletingId: string;
  onEdit: (user: UserDetailResponse) => void;
  onDelete: (id: string, userName: string) => void;
}

export const UsersTable = ({
  users,
  isLoading,
  totalElements,
  deletingId,
  onEdit,
  onDelete,
}: UsersTableProps) => {
  const { t } = useI18n();

  const columns: ResizableColumn[] = [
    { id: "user", label: t("admin.users.colUser"), defaultWidth: 230, minWidth: 160 },
    { id: "email", label: t("admin.users.colEmail"), defaultWidth: 220, minWidth: 160 },
    { id: "status", label: t("admin.users.colStatus"), defaultWidth: 140, minWidth: 110 },
    { id: "role", label: t("admin.users.colRole"), defaultWidth: 200, minWidth: 130 },
    { id: "mft", label: "MFT", defaultWidth: 100, minWidth: 80 },
    { id: "createdAt", label: t("admin.users.colCreatedAt"), defaultWidth: 170, minWidth: 140 },
    { id: "actions", label: t("admin.users.colActions"), align: "right", defaultWidth: 150, minWidth: 140 },
  ];

  const {
    columnWidths,
    resizingColId,
    handleMouseDown,
    handleDoubleClick,
    resetAllWidths,
    isCustomized,
    totalTableWidth,
  } = useResizableColumns({
    storageKey: "admin_users_table_column_widths_v1",
    columns,
  });

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.users.pageTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("admin.users.pageSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {isCustomized && (
            <button
              type="button"
              onClick={resetAllWidths}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md border border-dashed border-border hover:bg-muted/60 transition-colors cursor-pointer"
              title="Đặt lại độ rộng các cột về mặc định"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại cột</span>
            </button>
          )}
          {totalElements > 0 && (
            <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
              {totalElements.toLocaleString()} {t("admin.users.totalUsers")}
            </span>
          )}
        </div>
      </div>

      <Table
        style={{
          tableLayout: "fixed",
          minWidth: `${totalTableWidth}px`,
          width: "100%",
        }}
      >
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.id}
              style={{ width: `${columnWidths[col.id] || col.defaultWidth}px` }}
            />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.id}
                style={{ width: `${columnWidths[col.id] || col.defaultWidth}px` }}
                className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none overflow-visible ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                <div className="truncate pr-2">{col.label}</div>

                {/* Resizer handle (Excel-like drag bar) */}
                <div
                  onMouseDown={(e) => handleMouseDown(col.id, e)}
                  onDoubleClick={() => handleDoubleClick(col.id)}
                  title="Kéo sang trái/phải để chỉnh độ rộng cột, nhấp đúp để đặt lại"
                  className={`absolute top-0 right-0 bottom-0 w-2.5 cursor-col-resize select-none touch-none z-10 flex items-center justify-center group/resizer hover:bg-accent/15 ${
                    resizingColId === col.id ? "bg-accent/20" : ""
                  }`}
                >
                  <div
                    className={`h-4 w-[1px] transition-all duration-150 ${
                      resizingColId === col.id
                        ? "h-full bg-accent w-[2px]"
                        : "bg-border group-hover/resizer:h-full group-hover/resizer:bg-accent group-hover/resizer:w-[2px]"
                    }`}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  {t("admin.common.loading")}
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t("admin.common.noData")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isDeleting={deletingId === user.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
