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
import { useI18n } from "@/contexts/I18nContext";

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

export default function ChatbotClient() {
  const { t } = useI18n();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const welcomeMessageText = useMemo(() => t("chatbotPage.welcomeMessage"), [t]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "", // Will be filled on client side mount to avoid hydration mismatch
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessageText,
        timestamp: new Date(),
      },
    ]);
  }, [welcomeMessageText]);

  const conversations = useMemo<Conversation[]>(() => [
    {
      id: "current",
      title: t("chatbotPage.currentChat"),
      lastMessage: t("chatbotPage.lastMsgDesc"),
      timestamp: new Date(),
    },
  ], [t]);

  const suggestedQuestions = useMemo(() => [
    t("chatbotPage.suggestedOop"),
    t("chatbotPage.suggestedCollections"),
    t("chatbotPage.suggestedException"),
    t("chatbotPage.suggestedDesignPatterns"),
    t("chatbotPage.suggestedSpringBoot"),
    t("chatbotPage.suggestedPerformance"),
  ], [t]);

  const [currentConversationId, setCurrentConversationId] = useState<string | null>("current");
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
        content: response.data || t("chatbotPage.sendError"),
        timestamp: new Date(),
      };

      setMessages((prev) => prev.filter((m) => m.id !== "typing").concat(assistantMessage));
    } catch (error) {
      console.error("Chatbot error:", error);
      
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
      
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || t("chatbotPage.genericError")
        : t("chatbotPage.genericError");
      toast.error(errorMessage);
      
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("chatbotPage.systemError"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, authLoading, isAuthenticated, t]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleNewChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessageText,
        timestamp: new Date(),
      },
    ]);
  }, [welcomeMessageText]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
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
              questions={suggestedQuestions}
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
