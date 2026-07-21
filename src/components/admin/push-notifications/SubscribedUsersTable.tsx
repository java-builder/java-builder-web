"use client";

import React from "react";
import Image from "next/image";
import { Search, Send, Smartphone, Monitor, ShieldCheck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export interface SubscribedUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  fcmTokenSnippet?: string;
  deviceType: string;
  enabledAt: string;
  lastActive: string;
}

interface SubscribedUsersTableProps {
  users: SubscribedUser[];
  totalElements?: number;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSendDirectPush: (user: SubscribedUser) => void;
}

export default function SubscribedUsersTable({
  users,
  totalElements,
  searchTerm,
  onSearchTermChange,
  onSendDirectPush,
}: SubscribedUsersTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Search & Header Bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email học viên..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-bold tabular-nums">{totalElements ?? users.length}</span> thiết bị đang bật Push
            </span>
          </div>
        </div>

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Học Viên
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thiết Bị / Trình Duyệt
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trạng Thái Push
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thời Gian Bật Push
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Thao Tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                  Không tìm thấy học viên nào đã bật Push
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={`${user.id}-${index}`} className="hover:bg-muted/50 transition-colors">
                  {/* User Info */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm border border-accent/20 shrink-0">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.fullName || "User"}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          user.fullName?.charAt(0)?.toUpperCase() || "U"
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{user.fullName || "Học viên"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Device Type */}
                  <TableCell className="px-4 py-3 whitespace-nowrap text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">
                      {user.deviceType?.toUpperCase() === "MOBILE" || user.deviceType?.includes("iOS") || user.deviceType?.includes("Android") ? (
                        <Smartphone className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {user.deviceType || "WEB"}
                    </span>
                  </TableCell>

                  {/* Push Status Badge */}
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" /> Active Token
                    </span>
                  </TableCell>

                  {/* Enabled Date */}
                  <TableCell className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{user.enabledAt}</p>
                    <p className="text-[11px] text-muted-foreground">Hoạt động: {user.lastActive}</p>
                  </TableCell>

                  {/* Action Button */}
                  <TableCell className="px-4 py-3 whitespace-nowrap text-right">
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => onSendDirectPush(user)}
                      className="gap-1.5 text-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Gửi Push Riêng
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
