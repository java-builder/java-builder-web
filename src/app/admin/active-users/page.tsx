"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  RotateCw,
  Users
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { activeUserService } from "@/services/active-user.service";

interface ActiveUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export default function ActiveUsersPage() {
  const page = 1;
  const size = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["activeUsers", page, size],
    queryFn: async () => {
      const response = await activeUserService.getActiveUsers(page, size);
      return {
        users: response.data?.data || [],
        totalPages: response.data?.totalPages || 0,
        totalElements: response.data?.totalElements || 0,
      };
    },
  });

  const rawUsers = data?.users || [];

  const activeUsers: ActiveUser[] = rawUsers.map((user) => ({
    id: user.userId,
    username: user.username,
    email: user.email,
    avatar: user.avatar || undefined,
  }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Đã cập nhật danh sách trực tuyến");
    } catch {
      toast.error("Làm mới thất bại");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredUsers = activeUsers.filter((user) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
          Thành viên trực tuyến
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Danh sách người dùng đang hoạt động trong hệ thống.
        </p>
      </div>

      {/* Control Panel: Search & Refresh */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between bg-card border border-border/50 p-2.5 rounded-xl shadow-none">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="flex h-9 w-full rounded-lg border border-input bg-background/50 px-3 pl-9 text-xs shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40"
          />
        </div>

        <div className="flex items-center gap-3.5 self-end sm:self-auto text-xs">
          <div className="text-muted-foreground/80 font-medium">
            Tìm thấy {filteredUsers.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-1.5 rounded-lg h-9 px-3 hover:bg-muted/50 border-border/60 transition-colors text-xs"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Compact Active Users Horizontal Row Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-none min-w-0">
              <div className="w-11 h-11 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3.5 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="border border-dashed border-border bg-card/20 py-16 text-center shadow-none rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-muted/50 dark:bg-muted/10 rounded-xl">
              <Users className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-sm text-foreground">
                Không tìm thấy kết quả
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Không có thành viên nào đang kết nối trùng khớp với thông tin tìm kiếm.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-none transition-all duration-200 hover:shadow-sm hover:border-emerald-500/20 dark:hover:border-emerald-500/10 min-w-0"
            >
              {/* Avatar on the left */}
              <div className="relative flex-shrink-0">
                {user.avatar ? (
                  <div className="relative h-11 w-11 ring-2 ring-emerald-500/10 rounded-full overflow-hidden transition-transform duration-200 group-hover:scale-105">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      sizes="44px"
                      className="object-cover animate-in fade-in duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-11 w-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-500 ring-2 ring-emerald-500/10 transition-transform duration-200 group-hover:scale-105">
                    <span className="text-base font-extrabold text-white uppercase">
                      {user.username.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Glowing green presence dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-card"></span>
                </span>
              </div>

              {/* Details on the right */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-foreground truncate leading-normal" title={user.username}>
                  {user.username}
                </h3>
                <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
