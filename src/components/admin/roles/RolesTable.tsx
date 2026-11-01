"use client";

import { Shield, Loader2, RotateCcw } from "lucide-react";
import { RoleDetailResponse } from "@/types/role";
import RoleRow from "./RoleRow";
import { useI18n } from "@/contexts/I18nContext";
import { useResizableColumns, ResizableColumn } from "@/hooks/useResizableColumns";

interface RolesTableProps {
  roles: RoleDetailResponse[];
  isLoading: boolean;
  searchQuery?: string;
  onEdit: (role: RoleDetailResponse) => void;
}

export default function RolesTable({
  roles,
  isLoading,
  onEdit,
}: RolesTableProps) {
  const { t } = useI18n();

  const columns: ResizableColumn[] = [
    { id: "roleName", label: t("admin.roles.colRoleName"), defaultWidth: 200, minWidth: 140 },
    { id: "description", label: t("admin.roles.colDescription"), defaultWidth: 320, minWidth: 180 },
    { id: "createdAt", label: t("admin.users.colCreatedAt"), defaultWidth: 190, minWidth: 150 },
    { id: "updatedAt", label: t("admin.common.update"), defaultWidth: 190, minWidth: 150 },
    { id: "actions", label: t("admin.roles.colActions"), align: "right", defaultWidth: 120, minWidth: 100 },
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
    storageKey: "admin_roles_table_column_widths_v1",
    columns,
  });

  if (isLoading && roles.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">
            {t("admin.common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Shield className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          {t("admin.common.noData")}
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {isCustomized && (
        <div className="flex justify-end border-b border-border px-5 py-2.5 bg-muted/20">
          <button
            type="button"
            onClick={resetAllWidths}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md border border-dashed border-border hover:bg-muted/60 transition-colors cursor-pointer"
            title="Đặt lại độ rộng các cột về mặc định"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại cột</span>
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-left"
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
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  style={{ width: `${columnWidths[col.id] || col.defaultWidth}px` }}
                  className={`relative px-6 py-3.5 select-none overflow-visible ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <div className="truncate pr-2">{col.label}</div>

                  {/* Resizer Handle */}
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
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <RoleRow
                key={role.id}
                role={role}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
