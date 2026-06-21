"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";
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
import {
  Users,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  MessageSquare,
  ZapOff,
  Activity,
  Clock,
  RotateCw,
  Loader2,
  X,
  Send
} from "lucide-react";

interface MockActiveUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "ADMIN" | "USER";
  currentPage: string;
  pageTitle: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet";
  connectedAt: Date;
  durationSeconds: number;
}

const initialUsers: MockActiveUser[] = [
  {
    id: "1",
    username: "duclk",
    email: "duclk@gmail.com",
    avatar: undefined,
    role: "ADMIN",
    currentPage: "/learn/java-core/java-basic-types",
    pageTitle: "Kiểu dữ liệu cơ bản trong Java",
    ipAddress: "14.232.244.15",
    browser: "Chrome",
    os: "Windows",
    device: "desktop",
    connectedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
    durationSeconds: 25 * 60,
  },
  {
    id: "2",
    username: "anhtuan",
    email: "anhtuan.le@gmail.com",
    avatar: undefined,
    role: "USER",
    currentPage: "/exercises/stack-and-queue",
    pageTitle: "Bài tập Stack & Queue",
    ipAddress: "113.161.42.9",
    browser: "Safari",
    os: "macOS",
    device: "desktop",
    connectedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
    durationSeconds: 10 * 60,
  },
  {
    id: "3",
    username: "hoangnam",
    email: "hoangnam99@gmail.com",
    avatar: undefined,
    role: "USER",
    currentPage: "/interview/spring-boot-questions",
    pageTitle: "Câu hỏi phỏng vấn Spring Boot",
    ipAddress: "27.72.105.12",
    browser: "Safari",
    os: "iOS",
    device: "mobile",
    connectedAt: new Date(Date.now() - 72 * 60 * 1000), // 1.2h ago
    durationSeconds: 72 * 60,
  },
  {
    id: "4",
    username: "thuylinh",
    email: "linh.thuy@gmail.com",
    avatar: undefined,
    role: "USER",
    currentPage: "/blogs/recursive-cte-va-ung-dung",
    pageTitle: "Recursive CTE và ứng dụng",
    ipAddress: "171.244.80.3",
    browser: "Chrome",
    os: "Android",
    device: "mobile",
    connectedAt: new Date(Date.now() - 4 * 60 * 1000), // 4 mins ago
    durationSeconds: 4 * 60,
  },
  {
    id: "5",
    username: "minhquan",
    email: "quan.minh@yahoo.com",
    avatar: undefined,
    role: "USER",
    currentPage: "/qna",
    pageTitle: "Hỏi đáp & thảo luận",
    ipAddress: "115.79.200.41",
    browser: "Firefox",
    os: "Windows",
    device: "desktop",
    connectedAt: new Date(Date.now() - 38 * 60 * 1000), // 38 mins ago
    durationSeconds: 38 * 60,
  },
];

const mockPages = [
  { path: "/learn/java-core/oop-introduction", title: "Hướng đối tượng trong Java" },
  { path: "/exercises/binary-search-tree", title: "Cây tìm kiếm nhị phân" },
  { path: "/blogs/window-function-la-gi", title: "Window Function là gì?" },
  { path: "/chatbot", title: "Hỏi đáp với AI Assistant" },
  { path: "/pricing", title: "Bảng giá Premium" },
  { path: "/interview/java-collections-framework", title: "Phỏng vấn Java Collections" },
  { path: "/roadmap/springboot-developer", title: "Lộ trình Spring Boot Developer" },
];

const mockNewUsers = [
  { username: "ngocdiep", email: "diep.ngoc@gmail.com", os: "macOS", browser: "Chrome", device: "desktop" as const },
  { username: "thanhtung", email: "tung.thanh@gmail.com", os: "Windows", browser: "Edge", device: "desktop" as const },
  { username: "phuongthao", email: "thao.phuong@gmail.com", os: "iOS", browser: "Safari", device: "mobile" as const },
  { username: "vietdung", email: "dung.viet@outlook.com", os: "Linux", browser: "Firefox", device: "desktop" as const },
];

export default function ActiveUsersPage() {
  const { locale } = useI18n();
  const isVi = locale === "vi";

  const [activeUsers, setActiveUsers] = useState<MockActiveUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<MockActiveUser | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate active session timer and WS activity
  useEffect(() => {
    // 1. Tick session duration every second
    const durationInterval = setInterval(() => {
      setActiveUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          durationSeconds: user.durationSeconds + 1,
        }))
      );
    }, 1000);

    // 2. Simulate user activity (navigate, join, leave)
    const simulationInterval = setInterval(() => {
      const chance = Math.random();

      if (chance < 0.45 && activeUsers.length > 2) {
        // A user changes pages
        setActiveUsers((prevUsers) => {
          const randomIndex = Math.floor(Math.random() * prevUsers.length);
          const updatedUsers = [...prevUsers];
          const randomPage = mockPages[Math.floor(Math.random() * mockPages.length)];
          const targetUser = updatedUsers[randomIndex];

          updatedUsers[randomIndex] = {
            ...targetUser,
            currentPage: randomPage.path,
            pageTitle: randomPage.title,
          };

          return updatedUsers;
        });
      } else if (chance < 0.70 && activeUsers.length < 8) {
        // A new user joins
        const newUserIndex = Math.floor(Math.random() * mockNewUsers.length);
        const sourceUser = mockNewUsers[newUserIndex];

        // Avoid duplicating active user
        setActiveUsers((prevUsers) => {
          if (prevUsers.some((u) => u.username === sourceUser.username)) return prevUsers;

          const randomPage = mockPages[Math.floor(Math.random() * mockPages.length)];
          const generatedUser: MockActiveUser = {
            id: `user_${Date.now()}`,
            username: sourceUser.username,
            email: sourceUser.email,
            avatar: undefined,
            role: "USER",
            currentPage: randomPage.path,
            pageTitle: randomPage.title,
            ipAddress: `113.161.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
            browser: sourceUser.browser,
            os: sourceUser.os,
            device: sourceUser.device,
            connectedAt: new Date(),
            durationSeconds: 0,
          };

          return [...prevUsers, generatedUser];
        });
      } else if (chance < 0.90 && activeUsers.length > 3) {
        // A user disconnects
        setActiveUsers((prevUsers) => {
          // Keep duclk (admin) and at least some users
          const eligibleUsers = prevUsers.filter((u) => u.username !== "duclk");
          if (eligibleUsers.length === 0) return prevUsers;

          const randomTarget = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
          return prevUsers.filter((u) => u.id !== randomTarget.id);
        });
      }
    }, 8000);

    return () => {
      clearInterval(durationInterval);
      clearInterval(simulationInterval);
    };
  }, [activeUsers.length]);

  const handleKick = (userId: string, username: string) => {
    setActiveUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success(isVi ? `Đã ngắt kết nối của ${username}` : `Disconnected ${username}`);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    setIsSendingMessage(true);

    setTimeout(() => {
      toast.success(isVi ? `Đã gửi thông báo trực tiếp đến ${selectedUser.username}` : `Direct alert sent to ${selectedUser.username}`);
      setMessageText("");
      setSelectedUser(null);
      setIsSendingMessage(false);
    }, 600);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(isVi ? "Đã cập nhật danh sách trực tuyến" : "Live list updated");
    }, 500);
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let res = "";
    if (hours > 0) res += `${hours}h `;
    if (minutes > 0 || hours > 0) res += `${minutes}m `;
    res += `${seconds}s`;
    return res;
  };

  const filteredUsers = activeUsers.filter((user) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.currentPage.toLowerCase().includes(q) ||
      user.pageTitle.toLowerCase().includes(q) ||
      user.ipAddress.includes(q)
    );
  });

  // Calculate quick stats
  const desktopCount = activeUsers.filter((u) => u.device === "desktop").length;
  const mobileCount = activeUsers.filter((u) => u.device === "mobile" || u.device === "tablet").length;

  const getDeviceIcon = (device: "desktop" | "mobile" | "tablet") => {
    switch (device) {
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "mobile":
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const statsItems = [
    {
      label: isVi ? "Trực tuyến" : "Active Now",
      value: activeUsers.length,
      icon: <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      accent: "border-emerald-100 dark:border-emerald-900/30",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: isVi ? "Máy tính (Desktop)" : "Desktop",
      value: desktopCount,
      icon: <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      accent: "border-blue-100 dark:border-blue-900/30",
      valueClass: "text-foreground",
    },
    {
      label: isVi ? "Di động (Mobile)" : "Mobile / Tablet",
      value: mobileCount,
      icon: <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
      accent: "border-purple-100 dark:border-purple-900/30",
      valueClass: "text-foreground",
    },
  ];

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            {isVi ? "Người dùng đang hoạt động" : "Active Users"}
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isVi
              ? "Theo dõi danh sách các tài khoản đang truy cập và hoạt động trên hệ thống."
              : "Monitor users currently accessing and active on the system."}
          </p>
        </div>
        {activeUsers.length > 0 && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent dark:text-accent-on-dark self-start sm:self-auto">
            {isVi ? "Đang trực tuyến: " : "Online: "}
            <span className="font-bold tabular-nums">
              {activeUsers.length}
            </span>
          </span>
        )}
      </div>

      {/* Overview Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsItems.map((item) => (
          <Card key={item.label} className={`border ${item.accent} hover:shadow-md transition-all duration-200`}>
            <CardContent className="flex items-center justify-between p-4 sm:p-5">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                  {item.label}
                </p>
                <p className={`text-2xl font-bold tracking-tight tabular-nums ${item.valueClass}`}>
                  {item.value.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg} flex-shrink-0 ml-3`}>
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Control Panel */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVi ? "Nhập tên, email hoặc trang..." : "Search username, email, or page..."}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 pr-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-xs text-muted-foreground">
            {isVi
              ? `Hiển thị ${filteredUsers.length} / ${activeUsers.length} học viên online`
              : `Showing ${filteredUsers.length} / ${activeUsers.length} online`}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isVi ? "Làm mới" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Connections Table wrapper */}
      <Card className="border border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {isVi ? "Danh sách người dùng trực tuyến" : "Online Users List"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isVi ? "Xem và quản lý các tài khoản đang truy cập hệ thống thời gian thực" : "View and manage accounts currently accessing the system in real-time"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? "Người dùng" : "User"}
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? "Thiết bị / OS" : "Device / OS"}
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  IP Address
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? "Thời gian" : "Duration"}
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isVi ? "Trạng thái" : "Status"}
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  {isVi ? "Thao tác" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Activity className="h-8 w-8 text-muted-foreground/55" />
                      <span className="font-medium text-foreground">
                        {isVi ? "Không tìm thấy học viên trực tuyến" : "No active users found"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isVi ? "Thử đổi từ khóa tìm kiếm hoặc lọc lại danh sách." : "Try changing search terms."}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="transition-colors duration-200">
                    {/* User profile */}
                    <TableCell className="px-4 py-3 max-w-[220px]">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0 h-9 w-9">
                          {user.avatar ? (
                            <div className="relative h-9 w-9">
                              <Image
                                src={user.avatar}
                                alt={user.username}
                                fill
                                sizes="36px"
                                className="rounded-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <span className="text-sm font-semibold text-foreground truncate block" title={user.username}>
                            {user.username}
                          </span>
                          <span className="text-xs text-muted-foreground truncate block" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Device & browser */}
                    <TableCell className="px-4 py-3 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {getDeviceIcon(user.device)}
                        </span>
                        <span className="text-xs">
                          {user.os} ({user.browser})
                        </span>
                      </div>
                    </TableCell>


                    {/* IP */}
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground font-mono select-all">
                      {user.ipAddress}
                    </TableCell>

                    {/* Active duration */}
                    <TableCell className="px-4 py-3 text-xs text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="tabular-nums">{formatDuration(user.durationSeconds)}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {isVi ? "Hoạt động" : "Active"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="h-8 gap-1 px-2.5 text-xs font-medium"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {isVi ? "Gửi thông báo" : "Alert"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleKick(user.id, user.username)}
                          className="h-8 gap-1 px-2.5 text-xs font-medium"
                        >
                          <ZapOff className="h-3.5 w-3.5" />
                          {isVi ? "Ngắt" : "Kick"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Alert / Send Message Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
              onClick={() => setSelectedUser(null)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-card border border-border text-foreground rounded-2xl shadow-2xl transform transition-all duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {isVi ? `Gửi thông báo tới ${selectedUser.username}` : `Send notification to ${selectedUser.username}`}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isVi ? "Gửi thông điệp hiển thị trực tiếp trên màn hình của người dùng" : "Send a message that displays directly on the user's screen"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                  className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendMessageSubmit} className="p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      {isVi ? "Nội dung thông báo trực tiếp" : "Direct Alert Message"}
                    </label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                      placeholder={isVi ? "Nhập thông báo hiển thị dạng popup cho người dùng..." : "Type message for user's screen popup..."}
                      className="w-full min-h-[100px] p-2.5 rounded-lg border border-input bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <span className="text-[10px] text-muted-foreground block leading-relaxed">
                      {isVi
                        ? "Nội dung này sẽ xuất hiện dưới dạng thông báo tức thì trên giao diện học tập của người dùng."
                        : "This content will appear as an instant popup notification on the user's learning interface."}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
                  >
                    {isVi ? "Hủy" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    disabled={isSendingMessage}
                    className="gap-1.5"
                  >
                    {isSendingMessage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isVi ? "Đang gửi..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {isVi ? "Gửi ngay" : "Send Alert"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
