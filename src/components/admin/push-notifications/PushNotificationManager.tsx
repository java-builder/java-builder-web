"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import PushHeader from "./PushHeader";
import PushStatsCards from "./PushStatsCards";
import PushNotificationsTable, { PushNotificationItem } from "./PushNotificationsTable";
import CreatePushForm, { PushPreset } from "./CreatePushForm";
import PushPreviewCard from "./PushPreviewCard";
import PushDetailModal from "./PushDetailModal";
import DirectPushModal from "./DirectPushModal";
import SubscribedUsersTable, { SubscribedUser } from "./SubscribedUsersTable";
import { fcmService } from "@/services/fcm.service";
import { useDebounce } from "@/hooks/useDebounce";

const INITIAL_PUSHES: PushNotificationItem[] = [
  {
    id: "PUSH-001",
    title: "💡 Mẹo tối ưu HashMap & ConcurrentHashMap trong Java!",
    body: "Xem ngay hướng dẫn sử dụng ConcurrentHashMap chuẩn chuyên nghiệp tránh Race Condition.",
    url: "/interview-topics",
    targetAudience: "Tất cả học viên",
    sentCount: 1250,
    clickCount: 410,
    sentAt: "2026-07-21 20:00",
  },
  {
    id: "PUSH-002",
    title: "📖 Tiếp tục học nốt bài giảng: Spring Security Filter Chain",
    body: "Tiếp tục bài học dở 10 phút trước để hoàn thành chứng chỉ nhé!",
    url: "/my-courses",
    targetAudience: "Học viên học dở bài",
    sentCount: 840,
    clickCount: 295,
    sentAt: "2026-07-20 19:00",
  },
  {
    id: "PUSH-003",
    title: "🎯 10 Câu hỏi phỏng vấn Spring Boot Senior hay gặp nhất",
    body: "Xem ngay đáp án chuẩn và mẹo trả lời ấn tượng với nhà tuyển dụng.",
    url: "/interview-topics",
    targetAudience: "Tất cả học viên",
    sentCount: 3100,
    clickCount: 780,
    sentAt: "2026-07-19 08:30",
  },
];

export default function PushNotificationManager() {
  const [activeTab, setActiveTab] = useState<"history" | "create" | "subscribers">("history");
  const [pushList, setPushList] = useState<PushNotificationItem[]>(INITIAL_PUSHES);
  const [subscribedUsers, setSubscribedUsers] = useState<SubscribedUser[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);
  const [selectedPush, setSelectedPush] = useState<PushNotificationItem | null>(null);
  const [directPushUser, setDirectPushUser] = useState<SubscribedUser | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/interview-topics");
  const [targetAudience, setTargetAudience] = useState("Tất cả học viên");
  const [selectedUser, setSelectedUser] = useState<SubscribedUser | null>(null);

  const fetchSubscribers = useCallback(async (keyword?: string) => {
    try {
      const response = await fcmService.getSubscribedUsers(keyword, 1, 20);
      console.log("FCM Subscribed Users API Response:", response);
      if (response && response.data) {
        const pageData = response.data;
        const list = (pageData.data || []) as unknown as SubscribedUser[];
        setSubscribedUsers(list);
        setTotalSubscribers(pageData.totalElements ?? list.length);
      }
    } catch (error) {
      console.error("Failed to load FCM subscribers from API:", error);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers(debouncedSearch);
  }, [debouncedSearch, fetchSubscribers]);

  const totalSent = pushList.reduce((acc, p) => acc + p.sentCount, 0);
  const totalClicks = pushList.reduce((acc, p) => acc + p.clickCount, 0);
  const avgCtr = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : "0.0";

  const handleApplyPreset = (preset: PushPreset) => {
    setTitle(preset.title);
    setBody(preset.body);
    setUrl(preset.url);
    setTargetAudience(preset.audience);
    setSelectedUser(null);
    setActiveTab("create");
    toast.success(`Đã áp dụng kịch bản "${preset.name}"`);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung thông báo");
      return;
    }

    const recipientText = selectedUser ? `Cá nhân (${selectedUser.fullName})` : targetAudience;

    try {
      await fcmService.sendFCMPush({
        title,
        body,
        clickUrl: url,
        targetAudience,
        targetUserIds: selectedUser ? [selectedUser.id] : undefined,
      });
      toast.success(
        selectedUser
          ? `🚀 Đã phát Push tới học viên ${selectedUser.fullName} thành công!`
          : "🚀 Đã phát Push Notification tới tất cả học viên thành công!"
      );
    } catch (error) {
      console.error("Error sending FCM push:", error);
      toast.error("Không thể kết nối đến máy chủ gửi Push");
    }

    const newPush: PushNotificationItem = {
      id: `PUSH-00${pushList.length + 1}`,
      title,
      body,
      url: url || "/",
      targetAudience: recipientText,
      sentCount: selectedUser ? 1 : 1500,
      clickCount: 0,
      sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setPushList([newPush, ...pushList]);
    setTitle("");
    setBody("");
    setSelectedUser(null);
    setActiveTab("history");
  };

  const handleDelete = (id: string) => {
    setPushList(pushList.filter((p) => p.id !== id));
    toast.success("Đã xóa thông báo");
  };

  const handleReuse = (item: PushNotificationItem) => {
    setTitle(item.title);
    setBody(item.body);
    setUrl(item.url);
    setTargetAudience(item.targetAudience);
    setSelectedUser(null);
    setActiveTab("create");
    toast("Đã sao chép nội dung vào trình soạn thảo!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PushHeader
        totalCount={pushList.length}
        onOpenCreate={() => {
          setTitle("");
          setBody("");
          setSelectedUser(null);
          setActiveTab("create");
        }}
      />

      {/* Stats Cards */}
      <PushStatsCards
        totalSent={totalSent}
        totalClicks={totalClicks}
        avgCtr={avgCtr}
        activeDevicesCount={totalSubscribers}
      />

      {/* System Standard Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${activeTab === "history"
            ? "border-accent text-accent dark:text-accent-on-dark"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Lịch Sử Đã Gửi ({pushList.length})
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${activeTab === "create"
            ? "border-accent text-accent dark:text-accent-on-dark"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Soạn & Gửi Push Mới
        </button>

        <button
          onClick={() => {
            setActiveTab("subscribers");
            fetchSubscribers(debouncedSearch);
          }}
          className={`py-3 px-5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${activeTab === "subscribers"
            ? "border-accent text-accent dark:text-accent-on-dark"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Học Viên Đã Bật Push ({totalSubscribers})
        </button>
      </div>

      {/* TAB 1: HISTORY TABLE */}
      {activeTab === "history" && (
        <PushNotificationsTable
          pushList={pushList}
          onView={(item) => setSelectedPush(item)}
          onReuse={handleReuse}
          onDelete={handleDelete}
        />
      )}

      {/* TAB 2: CREATE FORM & PREVIEW */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CreatePushForm
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              url={url}
              setUrl={setUrl}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              subscribedUsersList={subscribedUsers}
              onSubmit={handleSend}
              onApplyPreset={handleApplyPreset}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <PushPreviewCard title={title} body={body} />
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIBED USERS LIST */}
      {activeTab === "subscribers" && (
        <SubscribedUsersTable
          users={subscribedUsers}
          totalElements={totalSubscribers}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSendDirectPush={(user) => setDirectPushUser(user)}
        />
      )}

      {/* DIRECT PUSH MODAL FOR INDIVIDUAL USER */}
      {directPushUser && (
        <DirectPushModal
          user={directPushUser}
          onClose={() => setDirectPushUser(null)}
          onSuccess={() => fetchSubscribers(debouncedSearch)}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedPush && (
        <PushDetailModal item={selectedPush} onClose={() => setSelectedPush(null)} />
      )}
    </div>
  );
}
