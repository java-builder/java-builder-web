"use client";

import { Users, Loader2 } from "lucide-react";
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

interface UsersTableProps {
  users: UserDetailResponse[];
  isLoading: boolean;
  totalElements: number;
  hasFilter: boolean;
  deletingId: string;
  onEdit: (user: UserDetailResponse) => void;
  onDelete: (id: string, userName: string) => void;
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Người dùng" },
  { label: "Email" },
  { label: "Trạng thái" },
  { label: "Vai trò" },
  { label: "MFT" },
  { label: "Ngày tạo" },
  { label: "Thao tác", align: "right" },
];

export const UsersTable = ({
  users,
  isLoading,
  totalElements,
  hasFilter,
  deletingId,
  onEdit,
  onDelete,
}: UsersTableProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách người dùng
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Quản lý thông tin tài khoản, vai trò và trạng thái
          </p>
        </div>
        {totalElements > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent dark:text-accent-on-dark">
            {totalElements.toLocaleString("vi-VN")} người dùng
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {COLUMN_HEADERS.map((col) => (
              <TableHead
                key={col.label}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_HEADERS.length}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  Đang tải...
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {hasFilter
                    ? "Không tìm thấy người dùng phù hợp"
                    : "Chưa có người dùng nào"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hasFilter
                    ? "Thử thay đổi từ khoá tìm kiếm"
                    : "Bấm 'Thêm người dùng' để tạo tài khoản mới"}
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
