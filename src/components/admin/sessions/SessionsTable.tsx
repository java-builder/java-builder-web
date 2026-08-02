"use client";

import { Monitor } from "lucide-react";
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

  const columnHeaders: { label: string; align?: "left" | "center" }[] = [
    { label: t("admin.sessions.colUser") },
    { label: "Provider" },
    { label: t("admin.userStreaks.colStatus") },
    { label: "Browser" },
    { label: t("admin.sessions.colDevice") },
    { label: t("admin.sessions.colIp") },
    { label: t("admin.sessions.colLastActive") },
    { label: t("admin.sessions.colActions"), align: "center" },
  ];

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
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
            {totalElements.toLocaleString()}
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columnHeaders.map((col) => (
              <TableHead
                key={col.label}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                  col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
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
              </TableRow>
            ))
          ) : sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnHeaders.length} className="px-6 py-12 text-center">
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
