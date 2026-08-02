"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Users, X, Check, Search, MessageSquare, ShieldCheck, Upload, Camera, Loader2, BookOpen } from "lucide-react";
import { Conversation, ConversationType, ChatUser } from "@/components/messages/types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { conversationApi } from "@/services/conversation.service";
import { enrollmentApi, EnrolledUserResponse } from "@/services/enrollment.service";
import { courseApi } from "@/services/course.service";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";

const DEFAULT_GROUP_AVATAR = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80";

export interface CourseSelectItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

interface AdminNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (user: EnrolledUserResponse) => void;
  onCreateConversation?: (newConv: Partial<Conversation>) => void;
}

export default function AdminNewChatModal({
  isOpen,
  onClose,
  onSelectUser,
  onCreateConversation,
}: AdminNewChatModalProps) {
  const currentUser = useChatCurrentUser();
  const [chatType, setChatType] = useState<ConversationType>("PRIVATE");
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(DEFAULT_GROUP_AVATAR);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [courses, setCourses] = useState<CourseSelectItem[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [apiUsers, setApiUsers] = useState<ChatUser[]>([]);
  const [rawEnrolledUsers, setRawEnrolledUsers] = useState<EnrolledUserResponse[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Fetch ALL courses using courseApi.getCourses(1, 100) for Admin
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCourses(true);
      courseApi
        .getCourses(1, 100)
        .then((res) => {
          const raw = res?.data?.data;
          const list = Array.isArray(raw) ? raw : [];
          setCourses(
            list.map((c) => ({
              id: c.id,
              title: c.title,
              thumbnailUrl: c.thumbnailUrl,
            }))
          );
        })
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách khóa học Admin:", err);
        })
        .finally(() => {
          setIsLoadingCourses(false);
        });
    }
  }, [isOpen]);

  const currentUserId = currentUser?.id;

  // Search enrolled users according to course or query
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSearchingApi(true);

    const courseIdParam = selectedCourseId !== "ALL" ? selectedCourseId : undefined;

    enrollmentApi
      .searchEnrolledUsers({
        page: 1,
        size: 30,
        courseId: courseIdParam,
        query: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      })
      .then((res) => {
        if (isMounted) {
          const list: EnrolledUserResponse[] = res?.data?.data || [];
          const uniqueList = Array.from(new Map(list.map((u) => [u.id, u])).values());
          setRawEnrolledUsers(uniqueList);

          const converted: ChatUser[] = uniqueList
            .filter((u) => u.id !== currentUserId)
            .map((u) => ({
              id: u.id,
              name: u.username,
              avatar:
                u.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              role: (u.role as string) || "USER",
              email: u.email || "",
              status: (u.status as string) || "online",
              course: u.courseName,
            }));
          setApiUsers(converted);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh bạ nhắn tin Admin:", err);
      })
      .finally(() => {
        if (isMounted) setIsSearchingApi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, debouncedSearch, selectedCourseId, currentUserId]);

  if (!isOpen) return null;

  const toggleSelectUser = (user: ChatUser) => {
    if (chatType === "PRIVATE") {
      setSelectedUserIds([user.id]);
      if (onSelectUser) {
        const foundRaw = rawEnrolledUsers.find((r) => r.id === user.id);
        if (foundRaw) {
          onSelectUser(foundRaw);
          onClose();
        }
      }
    } else {
      setSelectedUserIds((prev) =>
        prev.includes(user.id) ? prev.filter((i) => i !== user.id) : [...prev, user.id]
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await conversationApi.createConversation({
        conversationType: chatType,
        name: chatType === "GROUP" ? groupName.trim() : undefined,
        memberIds: selectedUserIds,
      });

      const selectedUsers = apiUsers.filter((u) => selectedUserIds.includes(u.id));
      const allMembers: EnrolledUserResponse[] = [
        currentUser,
        ...selectedUsers.map((u) => ({
          id: u.id,
          username: u.name,
          avatar: u.avatar,
          role: u.role,
          courseName: u.course,
          status: u.status,
        })),
      ];

      if (onCreateConversation) {
        if (chatType === "PRIVATE") {
          const targetUser = selectedUsers[0];
          onCreateConversation({
            id: res?.data?.id,
            type: "PRIVATE",
            name: targetUser.name,
            avatar: targetUser.avatar,
            courseTag:
              targetUser.role === "ADMIN" || targetUser.role === "ROLE_ADMIN"
                ? "Quản trị viên"
                : undefined,
            members: allMembers,
            unreadCount: 0,
            isPinned: false,
          });
        } else {
          if (!groupName.trim()) return;
          onCreateConversation({
            id: res?.data?.id,
            type: "GROUP",
            name: groupName.trim(),
            avatar: groupAvatar,
            members: allMembers,
            unreadCount: 0,
            isPinned: false,
          });
        }
      }
      onClose();
    } catch (err: unknown) {
      console.error("Lỗi tạo cuộc trò chuyện Admin:", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || "Tạo cuộc trò chuyện thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card text-card-foreground rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-accent/15 text-accent border border-accent/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Tạo cuộc trò chuyện Admin</h3>
              <p className="text-xs text-muted-foreground">
                Kết nối với học viên, hỗ trợ kỹ thuật hoặc tạo nhóm học tập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Chat Type Switcher */}
          <div className="flex p-1 bg-muted rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setChatType("PRIVATE");
                setSelectedUserIds([]);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                chatType === "PRIVATE"
                  ? "bg-card text-accent shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Chat 1-1 với Học viên</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setChatType("GROUP");
                setSelectedUserIds([]);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                chatType === "GROUP"
                  ? "bg-card text-accent shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Tạo Nhóm Học Tập</span>
            </button>
          </div>

          {chatType === "GROUP" && (
            <>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Tên nhóm học tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ví dụ: Nhóm Học Java Core Admin..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Ảnh đại diện nhóm
                </label>
                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-border bg-muted/20 hover:border-accent/50 transition-all">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 cursor-pointer group shrink-0 shadow-xs bg-background"
                  >
                    <Image
                      src={groupAvatar}
                      alt="Group Avatar"
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-foreground">Ảnh đại diện nhóm</h5>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="mt-1.5 px-3 py-1 rounded-xl bg-accent/10 hover:bg-accent/20 text-xs font-bold text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{groupAvatar !== DEFAULT_GROUP_AVATAR ? "Đổi ảnh" : "Chọn ảnh từ máy"}</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGroupAvatar(URL.createObjectURL(file));
                        toast.success("Đã chọn ảnh đại diện!");
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {chatType === "GROUP" ? "Chọn học viên tham gia nhóm" : "Chọn học viên cần trao đổi"}
            </label>

            {/* Course Filter & Search Bar */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
                <BookOpen className="w-4 h-4 text-accent shrink-0" />
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-background text-foreground">
                    Tất cả khóa học hệ thống ({courses.length} khóa)
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} className="bg-background text-foreground">
                      {course.title}
                    </option>
                  ))}
                </select>
                {isLoadingCourses && <Loader2 className="w-3.5 h-3.5 animate-spin text-accent shrink-0" />}
              </div>

              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên học viên..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* User List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {isSearchingApi ? (
                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span>Đang tải học viên...</span>
                </div>
              ) : apiUsers.length > 0 ? (
                apiUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleSelectUser(user)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-2xs"
                          : "border-border/50 bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border">
                          <Image
                            src={user.avatar || DEFAULT_GROUP_AVATAR}
                            alt={user.name}
                            width={36}
                            height={36}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {user.course || user.email || "Học viên"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isSelected ? "bg-accent border-accent text-accent-foreground" : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Không tìm thấy học viên nào phù hợp
                </div>
              )}
            </div>
          </div>

          {chatType === "GROUP" && (
            <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedUserIds.length === 0 || !groupName.trim()}
                className="px-5 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo nhóm...</span>
                  </>
                ) : (
                  <span>Tạo nhóm học tập</span>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
