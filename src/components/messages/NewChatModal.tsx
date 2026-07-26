import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Users, UserPlus, X, Check, Search, MessageSquare, ShieldCheck, Upload, Camera, Loader2, Send, BookOpen } from "lucide-react";
import { Conversation, ConversationType, ChatUser } from "./types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import { conversationApi } from "@/services/conversation.service";
import { enrollmentApi, EnrolledUserResponse } from "@/services/enrollment.service";
import { MyEnrolledCourseResponse } from "@/types/course";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";

const DEFAULT_GROUP_AVATAR = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (newConv: Partial<Conversation>) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onCreateConversation,
}: NewChatModalProps) {
  const currentUser = useChatCurrentUser();
  const [chatType, setChatType] = useState<ConversationType>("GROUP");
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(DEFAULT_GROUP_AVATAR);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [myCourses, setMyCourses] = useState<MyEnrolledCourseResponse[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [apiUsers, setApiUsers] = useState<ChatUser[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách khóa học của tôi khi mở modal
  useEffect(() => {
    if (isOpen) {
      enrollmentApi
        .getMyCourses(1, 50)
        .then((res) => {
          setMyCourses(res?.data?.data || []);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách khóa học:", err);
        });
    }
  }, [isOpen]);

  // Tìm kiếm danh bạ từ Conversation API
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSearchingApi(true);

    const courseIdParam = selectedCourseId !== "ALL" ? selectedCourseId : undefined;

    enrollmentApi
      .searchEnrolledUsers({
        page: 1,
        size: 20,
        courseId: courseIdParam,
        query: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      })
      .then((res) => {
        if (isMounted) {
          const list: EnrolledUserResponse[] = res?.data?.data || [];
          const converted: ChatUser[] = list
            .filter((u) => u.id !== currentUser.id)
            .map((u) => ({
              id: u.id,
              name: u.username,
              avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              role: (u.role as string) || "USER",
              email: "",
              status: (u.status as string) || "online",
              course: u.courseName,
            }));
          setApiUsers(converted);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh bạ nhắn tin:", err);
      })
      .finally(() => {
        if (isMounted) setIsSearchingApi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, debouncedSearch, selectedCourseId, currentUser]);

  if (!isOpen) return null;

  const allContacts = apiUsers;

  const filteredContacts = allContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.role ? c.role.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );

  const toggleSelectUser = (id: string) => {
    if (chatType === "PRIVATE") {
      setSelectedUserIds([id]);
    } else {
      setSelectedUserIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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

      const selectedUsers = allContacts.filter((u) => selectedUserIds.includes(u.id));
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

      if (chatType === "PRIVATE") {
        const targetUser = selectedUsers[0];
        onCreateConversation({
          id: res?.data?.id,
          type: "PRIVATE",
          name: targetUser.name,
          avatar: targetUser.avatar,
          courseTag: (targetUser.role === "ADMIN" || targetUser.role === "ROLE_ADMIN") ? "Quản trị viên" : "Thành viên",
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
      toast.success("Tạo cuộc trò chuyện thành công!");
      onClose();
    } catch (err: unknown) {
      console.error("Lỗi tạo cuộc trò chuyện:", err);
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
            <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
              {chatType === "GROUP" ? <Users className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {chatType === "GROUP" ? "Tạo nhóm học tập mới" : "Trò chuyện 1-1"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Kết nối với các thành viên trên JavaBuilder
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
                setChatType("GROUP");
                setSelectedUserIds([]);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${chatType === "GROUP"
                ? "bg-card text-accent shadow-xs"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Tạo Nhóm Học Tập</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setChatType("PRIVATE");
                setSelectedUserIds([]);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${chatType === "PRIVATE"
                ? "bg-card text-accent shadow-xs"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Chat 1-1</span>
            </button>
          </div>

          {chatType === "GROUP" && (
            <>
              {/* Group Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Tên nhóm học tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ví dụ: Nhóm Lập Trình Java Core K16..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Group Avatar Upload */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Ảnh đại diện nhóm
                </label>
                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-border bg-muted/20 hover:border-accent/50 transition-all">
                  {/* Selected Avatar Preview */}
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 cursor-pointer group shrink-0 shadow-xs bg-background"
                    title="Tải ảnh lên từ thiết bị"
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

                  {/* Upload Info & Button */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-foreground">Tải ảnh đại diện nhóm</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium truncate">
                      Hỗ trợ PNG, JPG hoặc GIF (tỉ lệ 1:1)
                    </p>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="mt-1.5 px-3 py-1 rounded-xl bg-accent/10 hover:bg-accent/20 text-xs font-bold text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{groupAvatar !== DEFAULT_GROUP_AVATAR ? "Đổi ảnh khác" : "Chọn ảnh từ máy"}</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setGroupAvatar(url);
                        toast.success("Đã tải lên ảnh đại diện nhóm!");
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
              {chatType === "GROUP" ? "Chọn thành viên tham gia nhóm" : "Chọn người muốn trò chuyện"}
            </label>

            {/* Course & Keyword Search Filter */}
            <div className="space-y-2 mb-3">
              {myCourses.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
                  <BookOpen className="w-4 h-4 text-accent shrink-0" />
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-background text-foreground">
                      Tất cả khóa học ({myCourses.length} khóa)
                    </option>
                    {myCourses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-background text-foreground">
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên người dùng..."
                  className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {isSearchingApi && (
                  <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin" />
                )}
              </div>
            </div>

            {/* Contact list with Live Online Indicator */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filteredContacts.length === 0 && !isSearchingApi ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Không tìm thấy người dùng phù hợp
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedUserIds.includes(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => toggleSelectUser(contact.id)}
                      className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border hover:bg-muted/60"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar with Status badge */}
                        <div className="relative shrink-0">
                          <Image
                            src={contact.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                            alt={contact.name}
                            width={40}
                            height={40}
                            unoptimized
                            className="w-10 h-10 rounded-full object-cover border border-border"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${contact.status === "online"
                              ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                              : contact.status === "away"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                              }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-foreground truncate">
                              {contact.name}
                            </span>
                            {(contact.role === "ADMIN" || contact.role === "ROLE_ADMIN") && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/10 text-accent font-extrabold flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                                <ShieldCheck className="w-3 h-3" /> ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium truncate">
                            {contact.customStatus || contact.course || "Thành viên JavaBuilder"} •{" "}
                            <span className={contact.status === "online" ? "text-emerald-500 font-bold" : ""}>
                              {contact.status === "online" ? "Trực tuyến" : contact.lastActive}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${isSelected
                          ? "bg-accent border-accent text-white"
                          : "border-border text-transparent"
                          }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                selectedUserIds.length === 0 || (chatType === "GROUP" && !groupName.trim()) || isSubmitting
              }
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-50 text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {chatType === "GROUP" ? "Tạo nhóm ngay" : "Bắt đầu trò chuyện"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
