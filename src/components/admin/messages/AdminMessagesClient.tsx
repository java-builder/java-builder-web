"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Conversation,
  ChatMessage,
  CodeSnippetData,
  MessageType,
  FileData,
  ExerciseCardData,
} from "@/components/messages/types";
import { useChatCurrentUser } from "@/hooks/useCurrentUser";
import AdminConversationList from "@/components/admin/messages/AdminConversationList";
import ChatWindow, { TypingUser } from "@/components/messages/ChatWindow";
import ChatDetailDrawer from "@/components/messages/ChatDetailDrawer";
import CodeSnippetModal from "@/components/messages/CodeSnippetModal";
import AdminNewChatModal from "@/components/admin/messages/AdminNewChatModal";
import EmptyChatState from "@/components/messages/EmptyChatState";
import { EnrolledUserResponse } from "@/services/enrollment.service";
import { conversationApi } from "@/services/conversation.service";
import { chatMessageApi } from "@/services/chatMessage.service";
import { BEMessageType, ChatMessageResponse, MessageAttachmentRequest } from "@/types/chatMessage";
import { useWebSocket } from "@/components/providers/PresenceProvider";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AdminMessagesClient() {
  const currentUser = useChatCurrentUser();
  const queryClient = useQueryClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [typingUsersMap, setTypingUsersMap] = useState<Record<string, TypingUser[]>>({});
  const typingTimersRef = useRef<Record<string, Record<string, NodeJS.Timeout>>>({});

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mutedConvIds, setMutedConvIds] = useState<string[]>([]);

  const handleToggleMute = useCallback((convId: string) => {
    setMutedConvIds((prev) => {
      const isCurrentlyMuted = prev.includes(convId);
      if (isCurrentlyMuted) {
        toast.success("Đã bật thông báo cuộc trò chuyện");
        return prev.filter((id) => id !== convId);
      } else {
        toast.success("Đã tắt thông báo cuộc trò chuyện");
        return [...prev, convId];
      }
    });
  }, []);

  const handleTogglePin = useCallback((conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conv.id) {
          const nextPinned = !c.isPinned;
          toast.success(nextPinned ? "Đã ghim cuộc trò chuyện lên đầu" : "Đã bỏ ghim cuộc trò chuyện");
          return { ...c, isPinned: nextPinned };
        }
        return c;
      })
    );
  }, []);

  const handleToggleUnread = useCallback((conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conv.id) {
          const nextUnread = c.unreadCount > 0 ? 0 : 1;
          toast.success(nextUnread > 0 ? "Đã đánh dấu chưa đọc" : "Đã đánh dấu đã đọc");
          return { ...c, unreadCount: nextUnread };
        }
        return c;
      })
    );
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    setMessagesMap((prev) => {
      const list = prev[activeConversationId] || [];
      return {
        ...prev,
        [activeConversationId]: list.filter((m) => m.id !== messageId),
      };
    });
  }, [activeConversationId]);

  // Initial Fetch Conversations from Backend API
  useEffect(() => {
    let isMounted = true;

    conversationApi.getMyConversations(1, 50)
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
          unreadCount: item.unreadCount || 0,
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
        console.error("Lỗi khi tải danh sách cuộc trò chuyện Admin:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Message History when Active Conversation Changes
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

        convertedMessages.reverse();

        setMessagesMap((prev) => ({
          ...prev,
          [activeConversationId]: convertedMessages,
        }));

        const latestMsg = convertedMessages[convertedMessages.length - 1];
        if (latestMsg) {
          setConversations((prev) =>
            prev.map((c) => (c.id === activeConversationId ? { ...c, lastMessage: latestMsg } : c))
          );
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải tin nhắn Admin:", err);
      });

    conversationApi
      .markAsRead(activeConversationId)
      .then(() => {
        if (isMounted) {
          queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
        }
      })
      .catch((err) => {
        console.error("Lỗi khi đánh dấu đã đọc cuộc trò chuyện:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeConversationId, queryClient]);

  const activeConversationIdRef = useRef(activeConversationId);
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const { client, isConnected } = useWebSocket();

  const handleIncomingMessage = useCallback(
    (messageBody: string) => {
      try {
        const item: ChatMessageResponse = JSON.parse(messageBody);
        if (!item.id || !item.conversationId || !item.senderId) return;
        const currentActiveId = activeConversationIdRef.current;
        const isCurrentlyActive = item.conversationId === currentActiveId;

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
          const list = prev[item.conversationId] || [];
          if (list.some((m) => m.id === incomingMsg.id)) {
            return prev;
          }
          if (item.tempId && list.some((m) => m.id === item.tempId)) {
            return {
              ...prev,
              [item.conversationId]: list.map((m) => (m.id === item.tempId ? incomingMsg : m)),
            };
          }
          return {
            ...prev,
            [item.conversationId]: [...list, incomingMsg],
          };
        });

        setConversations((prev) => {
          const targetConv = prev.find((c) => c.id === item.conversationId);

          if (targetConv) {
            const updatedConv: Conversation = {
              ...targetConv,
              lastMessage: incomingMsg,
              unreadCount: isCurrentlyActive
                ? 0
                : (targetConv.unreadCount || 0) + (incomingMsg.senderId !== currentUser.id ? 1 : 0),
            };
            const remainingConvs = prev.filter((c) => c.id !== item.conversationId);
            return [updatedConv, ...remainingConvs];
          } else {
            const newConv: Conversation = {
              id: item.conversationId,
              type: "PRIVATE",
              name: item.senderName || "Tin nhắn mới",
              avatar: item.senderAvatar,
              members: [],
              unreadCount: isCurrentlyActive ? 0 : 1,
              lastMessage: incomingMsg,
            };
            return [newConv, ...prev];
          }
        });

        if (isCurrentlyActive && item.senderId !== currentUser.id) {
          conversationApi
            .markAsRead(item.conversationId)
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
            })
            .catch((err) => {
              console.error("Lỗi khi tự động đánh dấu đã đọc:", err);
            });
        }
      } catch (err) {
        console.error("Lỗi khi xử lý message từ WebSocket:", err);
      }
    },
    [currentUser.id, queryClient]
  );

  const handleTypingEvent = useCallback(
    (body: string) => {
      try {
        const event = JSON.parse(body) as {
          conversationId?: string;
          userId?: string;
          username?: string;
          isTyping?: boolean;
        };

        if (!event.conversationId || !event.userId || event.userId === currentUser.id) return;

        const convId = event.conversationId;
        const uid = event.userId;

        if (event.isTyping) {
          setTypingUsersMap((prev) => {
            const list = prev[convId] || [];
            if (list.some((u) => u.userId === uid)) return prev;
            return { ...prev, [convId]: [...list, { userId: uid, username: event.username }] };
          });

          if (!typingTimersRef.current[convId]) {
            typingTimersRef.current[convId] = {};
          }
          if (typingTimersRef.current[convId][uid]) {
            clearTimeout(typingTimersRef.current[convId][uid]);
          }
          typingTimersRef.current[convId][uid] = setTimeout(() => {
            setTypingUsersMap((prev) => {
              const list = prev[convId] || [];
              return { ...prev, [convId]: list.filter((u) => u.userId !== uid) };
            });
          }, 4000);
        } else {
          if (typingTimersRef.current[convId]?.[uid]) {
            clearTimeout(typingTimersRef.current[convId][uid]);
            delete typingTimersRef.current[convId][uid];
          }
          setTypingUsersMap((prev) => {
            const list = prev[convId] || [];
            return { ...prev, [convId]: list.filter((u) => u.userId !== uid) };
          });
        }
      } catch (err) {
        console.error("Lỗi khi xử lý typing event Admin:", err);
      }
    },
    [currentUser.id]
  );

  const handleSendTyping = useCallback(
    (isTyping: boolean) => {
      if (!client || !isConnected || !activeConversationId) return;
      try {
        client.publish({
          destination: `/app/chat/${activeConversationId}/typing`,
          body: JSON.stringify({ isTyping, username: currentUser.username }),
        });
      } catch (err) {
        console.error("Lỗi khi gửi status typing Admin:", err);
      }
    },
    [client, isConnected, activeConversationId, currentUser]
  );

  useEffect(() => {
    if (!client || !isConnected) return;

    const subs = [
      client.subscribe("/user/queue/chat-messages", (m) => handleIncomingMessage(m.body)),
    ];

    if (activeConversationId) {
      subs.push(
        client.subscribe(`/topic/conversations/${activeConversationId}`, (m) =>
          handleIncomingMessage(m.body)
        )
      );
      subs.push(
        client.subscribe(`/topic/conversations/${activeConversationId}/typing`, (m) =>
          handleTypingEvent(m.body)
        )
      );
    }

    return () => {
      subs.forEach((s) => s.unsubscribe());
    };
  }, [client, isConnected, activeConversationId, handleIncomingMessage, handleTypingEvent]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];

  const handleSelectConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === conv.id);
      if (!exists) {
        return [{ ...conv, unreadCount: 0 }, ...prev];
      }
      return prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    });
    setActiveConversationId(conv.id);

    conversationApi
      .markAsRead(conv.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
      })
      .catch((err) => {
        console.error("Lỗi khi đánh dấu đã đọc cuộc trò chuyện:", err);
      });
  };

  const handleSelectEnrolledUser = async (user: EnrolledUserResponse) => {
    try {
      const res = await conversationApi.createConversation({
        conversationType: "PRIVATE",
        memberIds: [user.id],
      });

      const resData = res?.data;
      const conversationId = resData?.id;

      if (!conversationId) {
        toast.error("Không thể khởi tạo cuộc trò chuyện");
        return;
      }

      setConversations((prev) => {
        const existingConv = prev.find((c) => c.id === conversationId);
        const newConv: Conversation = {
          id: conversationId,
          type: "PRIVATE",
          name: user.username,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          courseTag: user.courseName || (user.role === "ADMIN" || user.role === "ROLE_ADMIN" ? "Quản trị viên" : undefined),
          unreadCount: existingConv?.unreadCount || 0,
          lastMessage: existingConv?.lastMessage,
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

  const handleSendMessage = async (
    content: string,
    type: MessageType = "text",
    codeData?: CodeSnippetData,
    exerciseData?: ExerciseCardData,
    fileData?: FileData,
    mediaUrl?: string,
    attachmentObj?: MessageAttachmentRequest
  ) => {
    if (!activeConversationId || (!content.trim() && !fileData && !codeData && !attachmentObj && !mediaUrl)) return;

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let beType: BEMessageType = "TEXT";
    if (type === "image") beType = "IMAGE";
    else if (type === "video") beType = "VIDEO";
    else if (type === "file") beType = "FILE";

    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      conversationId: activeConversationId,
      type,
      content,
      mediaUrl,
      codeData,
      exerciseData,
      fileData,
      timestamp: "Đang gửi...",
      isRead: true,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), optimisticMsg],
    }));

    setConversations((prev) => {
      const target = prev.find((c) => c.id === activeConversationId);
      if (!target) return prev;
      const updated = { ...target, lastMessage: optimisticMsg, unreadCount: 0 };
      return [updated, ...prev.filter((c) => c.id !== activeConversationId)];
    });

    try {
      const res = await chatMessageApi.sendMessage({
        conversationId: activeConversationId,
        content: content.trim() || undefined,
        messageType: beType,
        tempId,
        attachments: attachmentObj ? [attachmentObj] : undefined,
      });

      const serverMsg = res?.data;
      if (serverMsg) {
        const firstAtt = serverMsg.attachments?.[0];
        const realMsg: ChatMessage = {
          id: serverMsg.id,
          senderId: serverMsg.senderId,
          senderName: serverMsg.senderName,
          senderAvatar: serverMsg.senderAvatar,
          conversationId: serverMsg.conversationId,
          type,
          content: serverMsg.content || content,
          mediaUrl: firstAtt?.attachmentUrl || mediaUrl,
          codeData,
          exerciseData,
          fileData: firstAtt
            ? {
                name: firstAtt.attachmentName,
                size: (firstAtt.attachmentSize / (1024 * 1024)).toFixed(1) + " MB",
                fileType: firstAtt.attachmentType === "IMAGE" ? "image" : "pdf",
                url: firstAtt.attachmentUrl,
              }
            : fileData,
          timestamp: serverMsg.createdAt || "Vừa xong",
          isRead: true,
        };

        setMessagesMap((prev) => {
          const list = prev[activeConversationId] || [];
          return {
            ...prev,
            [activeConversationId]: list.map((m) => (m.id === tempId ? realMsg : m)),
          };
        });

        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversationId ? { ...c, lastMessage: realMsg } : c))
        );
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn Admin:", err);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại!");

      setMessagesMap((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).filter((msg) => msg.id !== tempId),
      }));
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${activeConversationId ? "hidden md:flex" : "flex"} ${
            isSidebarCollapsed ? "w-0 opacity-0 pointer-events-none md:w-0 overflow-hidden border-none" : "w-full md:w-80"
          } h-full shrink-0 transition-all duration-300 ease-in-out`}
        >
          <AdminConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onSelectEnrolledUser={handleSelectEnrolledUser}
            onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
            onToggleMute={handleToggleMute}
            onTogglePin={handleTogglePin}
            onToggleUnread={handleToggleUnread}
            onDeleteConversation={(id) => {
              setConversations((prev) => prev.filter((c) => c.id !== id));
              toast.success("Đã xóa cuộc trò chuyện");
            }}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            mutedConvIds={mutedConvIds}
          />
        </div>

        {/* Center Chat Viewport */}
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            typingUsers={typingUsersMap[activeConversation.id] || []}
            onTyping={handleSendTyping}
            onSendMessage={handleSendMessage}
            onOpenCodeModal={() => setIsCodeModalOpen(true)}
            onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            onBackToList={() => setActiveConversationId(null)}
            onAddReaction={() => { }}
            onDeleteMessage={handleDeleteMessage}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        ) : (
          <EmptyChatState
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}

        {/* Right Drawer */}
        {activeConversation && (
          <ChatDetailDrawer
            conversation={activeConversation}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onToggleMute={() => handleToggleMute(activeConversation.id)}
            onTogglePin={() => handleTogglePin(activeConversation)}
            isMuted={mutedConvIds.includes(activeConversation.id)}
          />
        )}
      </div>

      {/* New Chat Modal */}
      <AdminNewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectUser={handleSelectEnrolledUser}
        onCreateConversation={(newConv) => {
          if (newConv.id) {
            setActiveConversationId(newConv.id);
          }
        }}
      />

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSendCode={(codeData, commentText) => {
          const text = commentText || "Mình chia sẻ đoạn code này nhờ mọi người review giúp nhé:";
          const fullContent = `${text}\n\n\`\`\`${codeData.language || "java"}\n${codeData.code}\n\`\`\``;
          handleSendMessage(fullContent, "code", codeData);
          setIsCodeModalOpen(false);
        }}
      />
    </div>
  );
}
