"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import ConversationSidebar from "@/components/chatbot/ConversationSidebar";
import ChatHeader from "@/components/chatbot/ChatHeader";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatInput from "@/components/chatbot/ChatInput";
import SuggestedQuestions from "@/components/chatbot/SuggestedQuestions";
import { chatbotApi } from "@/services/chatbot.service";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Giải thích về OOP trong Java",
  "Sự khác biệt giữa ArrayList và LinkedList",
  "Cách xử lý exception trong Java",
  "Design patterns phổ biến trong Java",
  "Spring Boot là gì?",
  "Cách tối ưu hiệu suất Java application",
];

export default function ChatbotClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý AI của JavaBuilder. Tôi có thể giúp bạn giải đáp các thắc mắc về lập trình Java, giải thích khái niệm, debug code, và hỗ trợ học tập. Bạn muốn hỏi gì?",
      timestamp: new Date(),
    },
  ]);
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "OOP trong Java",
      lastMessage: "Giải thích về OOP trong Java",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "ArrayList vs LinkedList",
      lastMessage: "Sự khác biệt giữa ArrayList và LinkedList",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Exception Handling",
      lastMessage: "Cách xử lý exception trong Java",
      timestamp: new Date(Date.now() - 259200000),
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent || isLoading) return;

    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const typingMessage: Message = {
      id: "typing",
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await chatbotApi.chat({ message: messageContent });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
        timestamp: new Date(),
      };

      setMessages((prev) => prev.filter((m) => m.id !== "typing").concat(assistantMessage));
    } catch (error) {
      console.error("Chatbot error:", error);
      
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
      
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
        : "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
      
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, authLoading, isAuthenticated]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Xin chào! Tôi là trợ lý AI của JavaBuilder. Tôi có thể giúp bạn giải đáp các thắc mắc về lập trình Java, giải thích khái niệm, debug code, và hỗ trợ học tập. Bạn muốn hỏi gì?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Đã tải cuộc trò chuyện. Đây là nội dung mock.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleDeleteAll = useCallback(() => {
    console.log("Delete all conversations");
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const showSuggestedQuestions = useMemo(() => messages.length === 1, [messages.length]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900 flex overflow-hidden">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Conversation List */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        isOpen={sidebarOpen}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteAll={handleDeleteAll}
        onClose={handleCloseSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onToggleSidebar={handleToggleSidebar} />

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden flex flex-col w-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestedQuestions && (
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={handleSuggestedQuestion}
            />
          )}

          {/* Input Area */}
          <ChatInput
            value={inputValue}
            isLoading={isLoading}
            onChange={setInputValue}
            onSend={handleSendMessage}
          />
        </div>
      </div>

      <AuthRequiredModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
