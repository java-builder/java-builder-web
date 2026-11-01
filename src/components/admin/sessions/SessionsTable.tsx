"use client";

import { Monitor, RotateCcw } from "lucide-react";
import { UserSession } from "@/types/session";
import { SessionTableRow } from "./SessionTableRow";
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

interface SessionsTableProps {
  sessions: UserSession[];
  isLoading: boolean;
  totalElements: number;
  hasFilter?: boolean;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onViewDetails: (session: UserSession) => void;
}

export const SessionsTable = ({
  sessions,
  isLoading,
  totalElements,
  imageErrors,
  onImageError,
  onViewDetails,
}: SessionsTableProps) => {
  const { t } = useI18n();

  const columns: ResizableColumn[] = [
    { id: "user", label: t("admin.sessions.colUser"), defaultWidth: 230, minWidth: 160 },
    { id: "provider", label: "Provider", defaultWidth: 130, minWidth: 100 },
    { id: "status", label: t("admin.userStreaks.colStatus"), defaultWidth: 130, minWidth: 100 },
    { id: "browser", label: "Browser", defaultWidth: 150, minWidth: 110 },
    { id: "device", label: t("admin.sessions.colDevice"), defaultWidth: 140, minWidth: 110 },
    { id: "ip", label: t("admin.sessions.colIp"), defaultWidth: 140, minWidth: 110 },
    { id: "lastActive", label: t("admin.sessions.colLastActive"), defaultWidth: 170, minWidth: 140 },
    { id: "actions", label: t("admin.sessions.colActions"), align: "right", defaultWidth: 90, minWidth: 80 },
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
    storageKey: "admin_sessions_table_column_widths_v1",
    columns,
  });

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {t("admin.sessions.pageTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("admin.sessions.pageSubtitle")}
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
              {totalElements.toLocaleString()}
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
          {isLoading && sessions.length === 0 ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx} className="animate-pulse">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3.5 bg-muted rounded w-36" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-32" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-16" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-5 bg-muted rounded w-16" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-24" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-28" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="h-8 bg-muted rounded w-8 mx-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t("admin.common.noData")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => (
              <SessionTableRow
                key={session.sessionId}
                session={session}
                imageErrors={imageErrors}
                onImageError={onImageError}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
