"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Conversation,
  ChatMessage,
  UserPresenceStatus,
  CodeSnippetData,
  ExerciseCardData,
  MessageType,
  FileData,
} from "@/components/messages/types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import ChatDetailDrawer from "@/components/messages/ChatDetailDrawer";
import CodeSnippetModal from "@/components/messages/CodeSnippetModal";
import NewChatModal from "@/components/messages/NewChatModal";
import EmptyChatState from "@/components/messages/EmptyChatState";
import { EnrolledUserResponse } from "@/services/enrollment.service";
import { conversationApi } from "@/services/conversation.service";
import { chatMessageApi } from "@/services/chatMessage.service";
import { BEMessageType, ChatMessageResponse } from "@/types/chatMessage";
import { useWebSocket } from "@/components/providers/PresenceProvider";
import toast from "react-hot-toast";

export default function MessagesClient() {
  const currentUser = useChatCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [myStatus, setMyStatus] = useState<UserPresenceStatus>("online");
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    conversationApi.getMyConversations(1, 20)
      .then((res) => {
        if (!isMounted) return;
        const list = res?.data?.data || [];
        const converted: Conversation[] = list.map((item) => ({
          id: item.id,
          type: item.conversationType || "PRIVATE",
          name: item.name || "Cuộc trò chuyện",
          avatar:
            item.conversationAvatar ||
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
          members: [],
          unreadCount: 0,
          lastMessage: item.lastMessage
            ? {
              id: `msg_last_${item.id}`,
              conversationId: item.id,
              senderId: "",
              senderName: item.lastMessageSender,
              content: item.lastMessage,
              timestamp: item.lastMessageTime || "Vừa xong",
              type: "text",
            }
            : undefined,
        }));
        setConversations(converted);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách cuộc trò chuyện:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch tin nhắn thực tế từ BE API khi chọn activeConversationId
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;
    chatMessageApi.getMessagesByConversationId(activeConversationId, 1, 50)
      .then((res) => {
        if (!isMounted) return;
        const pageData = res?.data?.data || [];
        const convertedMessages: ChatMessage[] = pageData.map((item) => {
          const firstAtt = item.attachments?.[0];
          let type: MessageType = "text";
          if (item.messageType === "IMAGE") type = "image";
          else if (item.messageType === "VIDEO") type = "video";
          else if (item.messageType === "FILE") type = "file";

          return {
            id: item.id,
            senderId: item.senderId,
            senderName: item.senderName,
            senderAvatar: item.senderAvatar,
            conversationId: item.conversationId,
            type,
            content: item.content || "",
            mediaUrl: firstAtt?.attachmentUrl,
            attachments: item.attachments,
            fileData: firstAtt
              ? {
                name: firstAtt.attachmentName,
                size: (firstAtt.attachmentSize / (1024 * 1024)).toFixed(1) + " MB",
                fileType: firstAtt.attachmentType === "IMAGE" ? "image" : "pdf",
                url: firstAtt.attachmentUrl,
              }
              : undefined,
            timestamp: item.createdAt || "Vừa xong",
            isRead: true,
          };
        });

        // BE trả về DESC -> reverse để hiển thị tin nhắn mới ở dưới cùng
        convertedMessages.reverse();

        setMessagesMap((prev) => ({
          ...prev,
          [activeConversationId]: convertedMessages,
        }));
      })
      .catch((err) => {
        console.error("Lỗi khi tải lịch sử tin nhắn:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  // Subscribe tới WebSocket Topic của cuộc trò chuyện hiện tại để nhận tin nhắn Realtime
  const { client, isConnected } = useWebSocket();

  useEffect(() => {
    if (!activeConversationId || !client || !isConnected) return;

    const destination = `/topic/conversations/${activeConversationId}`;

    const subscription = client.subscribe(destination, (message) => {
      try {
        const item: ChatMessageResponse = JSON.parse(message.body);

        const firstAtt = item.attachments?.[0];
        let type: MessageType = "text";
        if (item.messageType === "IMAGE") type = "image";
        else if (item.messageType === "VIDEO") type = "video";
        else if (item.messageType === "FILE") type = "file";

        const incomingMsg: ChatMessage = {
          id: item.id,
          senderId: item.senderId,
          senderName: item.senderName,
          senderAvatar: item.senderAvatar,
          conversationId: item.conversationId,
          type,
          content: item.content || "",
          mediaUrl: firstAtt?.attachmentUrl,
          attachments: item.attachments,
          fileData: firstAtt
            ? {
              name: firstAtt.attachmentName,
              size: (firstAtt.attachmentSize / (1024 * 1024)).toFixed(1) + " MB",
              fileType: firstAtt.attachmentType === "IMAGE" ? "image" : "pdf",
              url: firstAtt.attachmentUrl,
            }
            : undefined,
          timestamp: item.createdAt || "Vừa xong",
          isRead: true,
        };

        setMessagesMap((prev) => {
          const list = prev[activeConversationId] || [];
          if (list.some((m) => m.id === incomingMsg.id)) {
            return prev;
          }
          if (item.tempId && list.some((m) => m.id === item.tempId)) {
            return {
              ...prev,
              [activeConversationId]: list.map((m) => (m.id === item.tempId ? incomingMsg : m)),
            };
          }
          return {
            ...prev,
            [activeConversationId]: [...list, incomingMsg],
          };
        });

        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversationId ? { ...c, lastMessage: incomingMsg } : c))
        );
      } catch (err) {
        console.error("Lỗi khi xử lý message nhận từ WebSocket:", err);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeConversationId, client, isConnected]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];

  const handleSelectConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === conv.id);
      if (!exists) {
        return [conv, ...prev];
      }
      return prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    });
    setActiveConversationId(conv.id);
  };

  const handleSelectEnrolledUser = async (user: EnrolledUserResponse) => {
    try {
      const res = await conversationApi.createConversation({
        conversationType: "PRIVATE",
        memberIds: [user.id],
      });

      const resData = res?.data;
      const conversationId = resData?.id || `conv_${Date.now()}`;

      const newConv: Conversation = {
        id: conversationId,
        type: "PRIVATE",
        name: user.username,
        avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        courseTag: user.courseName || user.role || "Thành viên",
        unreadCount: 0,
        members: [
          currentUser,
          {
            id: user.id,
            username: user.username,
            avatar: user.avatar || "",
            role: (user.role as string) || "STUDENT",
            status: (user.status as string) || "online",
          },
        ],
      };

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== conversationId);
        return [newConv, ...filtered];
      });
      setActiveConversationId(conversationId);
    } catch (err: unknown) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || "Không thể khởi tạo cuộc trò chuyện");
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;

    setMessagesMap((prev) => {
      const list = prev[activeConversationId] || [];
      const updated = list.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions || [];
        const existing = reactions.find((r) => r.emoji === emoji);

        if (existing) {
          const hasUser = existing.users.includes(currentUser.id);
          const newUsers = hasUser
            ? existing.users.filter((u) => u !== currentUser.id)
            : [...existing.users, currentUser.id];

          if (newUsers.length === 0) {
            return {
              ...msg,
              reactions: reactions.filter((r) => r.emoji !== emoji),
            };
          }

          return {
            ...msg,
            reactions: reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r
            ),
          };
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, users: [currentUser.id] }],
          };
        }
      });

      return { ...prev, [activeConversationId]: updated };
    });
  };

  const handleSendMessage = useCallback(
    async (
      content: string,
      type: MessageType = "text",
      codeData?: CodeSnippetData,
      exerciseData?: ExerciseCardData,
      fileData?: FileData,
      mediaUrl?: string
    ) => {
      if (!activeConversationId) return;

      const tempId = `temp_${Date.now()}`;
      let beMessageType: BEMessageType = "TEXT";
      if (type === "image") beMessageType = "IMAGE";
      else if (type === "video") beMessageType = "VIDEO";
      else if (type === "file") beMessageType = "FILE";

      const optimisticMsg: ChatMessage = {
        id: tempId,
        senderId: currentUser.id,
        senderName: currentUser.username,
        senderAvatar: currentUser.avatar,
        conversationId: activeConversationId,
        type,
        content,
        codeData,
        exerciseData,
        fileData,
        mediaUrl,
        timestamp: "Đang gửi... ⏳",
        isRead: true,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), optimisticMsg],
      }));

      try {
        const res = await chatMessageApi.sendMessage({
          tempId,
          conversationId: activeConversationId,
          content: content.trim() || undefined,
          messageType: beMessageType,
        });

        const data = res?.data;
        if (data) {
          const firstAtt = data.attachments?.[0];
          const serverMsg: ChatMessage = {
            id: data.id,
            senderId: data.senderId,
            senderName: data.senderName || currentUser.username,
            senderAvatar: data.senderAvatar || currentUser.avatar,
            conversationId: activeConversationId,
            type,
            content: data.content || content,
            codeData,
            exerciseData,
            mediaUrl: firstAtt?.attachmentUrl || mediaUrl,
            fileData: firstAtt
              ? {
                name: firstAtt.attachmentName,
                size: (firstAtt.attachmentSize / (1024 * 1024)).toFixed(1) + " MB",
                fileType: firstAtt.attachmentType === "IMAGE" ? "image" : "pdf",
                url: firstAtt.attachmentUrl,
              }
              : fileData,
            timestamp: data.createdAt || "Vừa xong",
            isRead: true,
          };

          setMessagesMap((prev) => {
            const list = prev[activeConversationId] || [];
            // Nếu đã được WebSocket cập nhật rồi (không còn tempId trong list) -> Bỏ qua không cập nhật lại
            if (!list.some((msg) => msg.id === tempId)) {
              return prev;
            }
            return {
              ...prev,
              [activeConversationId]: list.map((msg) => (msg.id === tempId ? serverMsg : msg)),
            };
          });

          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId ? { ...c, lastMessage: serverMsg } : c
            )
          );
        }
      } catch (err: unknown) {
        console.error("Lỗi khi gửi tin nhắn:", err);
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(apiErr?.response?.data?.message || "Không thể gửi tin nhắn");

        setMessagesMap((prev) => ({
          ...prev,
          [activeConversationId]: (prev[activeConversationId] || []).filter((msg) => msg.id !== tempId),
        }));
      }
    },
    [activeConversationId, currentUser]
  );

  const handleSendCodeFromModal = (codeData: CodeSnippetData, commentText: string) => {
    const text = commentText || "Mình chia sẻ đoạn code này nhờ mọi người review giúp nhé:";
    const fullContent = `${text}\n\n\`\`\`${codeData.language || "java"}\n${codeData.code}\n\`\`\``;
    handleSendMessage(
      fullContent,
      "code",
      codeData
    );
    toast.success("Đã gửi đoạn code Java lên phòng chat!");
  };

  const handleCreateConversation = (newConvData: Partial<Conversation>) => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      type: newConvData.type || "GROUP",
      name: newConvData.name || "Nhóm Học Tập Mới",
      avatar: newConvData.avatar,
      courseTag: newConvData.courseTag || "Java Core",
      topic: newConvData.topic,
      members: newConvData.members || [currentUser],
      unreadCount: 0,
      isPinned: false,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessagesMap((prev) => ({
      ...prev,
      [newConv.id]: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: currentUser.id,
          conversationId: newConv.id,
          type: "text",
          content: `Chào mừng bạn đến với ${newConv.name}! Đã khởi tạo phòng học tập thành công.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isRead: true,
        },
      ],
    }));
    setActiveConversationId(newConv.id);
    toast.success(`Đã tạo ${newConv.type === "GROUP" ? "nhóm" : "cuộc trò chuyện"} thành công!`);
  };

  return (
    <div className="h-dvh w-full flex bg-background text-foreground overflow-hidden relative">
      <div
        className={`${activeConversationId ? "hidden md:flex" : "flex"
          } w-full md:w-80 h-full shrink-0`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onSelectEnrolledUser={handleSelectEnrolledUser}
          onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
          myStatus={myStatus}
          onChangeMyStatus={setMyStatus}
        />
      </div>

      <div
        className={`${!activeConversationId ? "hidden md:flex" : "flex"
          } flex-1 h-full flex-col relative overflow-hidden`}
      >
        {activeConversation ? (
          <div className="flex-1 h-full flex relative overflow-hidden">
            <ChatWindow
              conversation={activeConversation}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onAddReaction={handleAddReaction}
              onOpenCodeModal={() => setIsCodeModalOpen(true)}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
              onBackToList={() => setActiveConversationId(null)}
            />

            {isDrawerOpen && (
              <ChatDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                conversation={activeConversation}
              />
            )}
          </div>
        ) : (
          <EmptyChatState />
        )}
      </div>

      <CodeSnippetModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSendCode={handleSendCodeFromModal}
      />

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
}
