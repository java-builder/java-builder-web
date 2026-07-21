"use client";

import React, { useState } from "react";
import { Search, Eye, Copy, Trash2 } from "lucide-react";
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

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  url: string;
  targetAudience: string;
  sentCount: number;
  clickCount: number;
  sentAt: string;
}

interface PushNotificationsTableProps {
  pushList: PushNotificationItem[];
  onView: (item: PushNotificationItem) => void;
  onReuse: (item: PushNotificationItem) => void;
  onDelete: (id: string) => void;
}

export default function PushNotificationsTable({
  pushList,
  onView,
  onReuse,
  onDelete,
}: PushNotificationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = pushList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
            Hiển thị <span className="font-semibold text-foreground">{filteredList.length}</span> thông báo
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thông Báo
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Đối Tượng Nhận
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Liên Kết (URL)
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lượt Nhận / Click
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thời Gian
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Thao Tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                  Không tìm thấy thông báo nào
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="px-4 py-3 max-w-xs">
                    <p className="font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{item.body}</p>
                  </TableCell>

                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent dark:text-accent-on-dark">
                      {item.targetAudience}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 whitespace-nowrap text-xs text-accent font-mono">
                    {item.url}
                  </TableCell>

                  <TableCell className="px-4 py-3 whitespace-nowrap text-xs">
                    <span className="font-semibold text-foreground">{item.sentCount}</span> gửi |{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.clickCount} clicks</span>
                  </TableCell>

                  <TableCell className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {item.sentAt}
                  </TableCell>

                  <TableCell className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onView(item)}
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onReuse(item)}
                      title="Dùng lại nội dung này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onDelete(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
