"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Bot, Sparkles, Loader2, Minimize2, Trash2, Send } from "lucide-react";
import { chatbotApi } from "@/services/chatbot.service";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface DocsAiAssistantProps {
  lessonName?: string;
  lessonDescription?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function DocsAiAssistant({
  lessonName = "",
  lessonDescription = "",
}: DocsAiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Welcome message memoized
  const welcomeMessage = useMemo(() => {
    return {
      id: "welcome",
      role: "assistant" as const,
      content: `Chào bạn! Mình là **Trợ lý AI Học tập** của JavaBuilder. 🤖\n\nHôm nay bạn cần hỗ trợ gì về bài học **"${lessonName || "Tài liệu Java"}"**? Mình có thể giúp tóm tắt, giải thích code hoặc đưa ra ví dụ thực tế đấy!`,
      timestamp: new Date(),
    };
  }, [lessonName]);

  // Initialise messages with welcome message
  useEffect(() => {
    setMessages([welcomeMessage]);
  }, [welcomeMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when opened
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSend = async (textToSend?: string) => {
    const rawMessage = textToSend || inputValue.trim();
    if (!rawMessage || isLoading) return;

    const userMessageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: rawMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const typingId = "typing";
    const typingMessage: ChatMessage = {
      id: typingId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Build context prefix so the AI chatbot knows about the current lesson.
      const contextPrefix = `[Bối cảnh bài học: "${lessonName}"${lessonDescription ? ` - Mô tả: "${lessonDescription}"` : ""}]. `;
      const messageWithContext = `${contextPrefix}${rawMessage}`;

      const response = await chatbotApi.chat({ message: messageWithContext });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data || "Xin lỗi, hệ thống AI chatbot đang bận. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== typingId).concat(assistantMessage)
      );
    } catch (error) {
      console.error("AI assistant error:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🔴 Đã xảy ra lỗi kết nối với máy chủ AI. Vui lòng kiểm tra lại mạng hoặc thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Bạn có muốn xóa lịch sử trò chuyện với trợ lý bài học này không?")) {
      setMessages([welcomeMessage]);
    }
  };

  const suggestionChips = useMemo(() => [
    { label: "📝 Tóm tắt bài này", prompt: "Tóm tắt bài học này một cách ngắn gọn, súc tích và nêu các ý chính." },
    { label: "💡 Cho ví dụ thực tế", prompt: "Hãy cho tôi một ví dụ thực tế liên quan đến nội dung bài học này để tôi dễ hình dung." },
    { label: "❓ Đố trắc nghiệm nhanh", prompt: "Đặt cho tôi 1 câu hỏi trắc nghiệm kèm 4 lựa chọn (A, B, C, D) kiểm tra hiểu biết về bài học này. Khi tôi trả lời hãy giải thích đúng/sai." }
  ], []);

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-accent text-white shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:scale-110 active:scale-95 transition-all duration-300 group ${isOpen ? "rotate-90 opacity-0 pointer-events-none scale-75" : "scale-100"
          }`}
        aria-label="Ask AI Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping group-hover:animate-none"></div>
        <Bot className="w-6 h-6 animate-pulse group-hover:scale-110" />
      </button>

      {/* Chat Popover Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[450px] h-[550px] max-h-[82vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-250 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 origin-bottom-right ${isOpen
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-8 opacity-0 scale-90 pointer-events-none"
          }`}
      >
        {/* Chat Window Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-accent text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 dark:bg-slate-800/80 rounded-lg">
              <Bot className="w-5 h-5 text-white/95" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                Trợ lý AI Java
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              </h4>
              <p className="text-[11px] text-white/80 dark:text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Đang trực tuyến
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Xóa lịch sử chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Thu nhỏ"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Conversation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-accent/10 dark:bg-slate-850 flex items-center justify-center flex-shrink-0 mt-1 border border-accent/20 dark:border-slate-700/50">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}

              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-sm text-sm ${msg.role === "user"
                    ? "bg-accent text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-150 rounded-tl-none border border-gray-150/40 dark:border-slate-800/40"
                  }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-xs text-gray-500 dark:text-slate-400 animate-pulse">
                      AI đang suy nghĩ...
                    </span>
                  </div>
                ) : msg.role === "user" ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <PublicMarkdownRenderer
                    content={msg.content}
                    className="prose-sm dark:prose-invert leading-relaxed max-w-none text-inherit dark:text-inherit"
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-gray-150 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              Gợi ý nhanh cho bạn
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.prompt)}
                  className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 hover:bg-accent/5 dark:hover:bg-slate-700 hover:border-accent/40 text-gray-650 dark:text-slate-355 hover:text-accent dark:hover:text-accent transition-all duration-200 font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-slate-800/80">
          <div className="relative flex items-end border border-gray-250 dark:border-slate-800 rounded-2xl bg-gray-50 dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-950 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent dark:focus-within:ring-accent dark:focus-within:border-accent hover:border-gray-300 dark:hover:border-slate-700 transition-all p-1.5 pl-3">
            <textarea
              ref={chatInputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi trợ lý về bài học này..."
              className="flex-1 max-h-24 min-h-[38px] py-2 border-0 bg-transparent focus:outline-none focus:ring-0 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none transition-all mr-12"
              style={{ height: "38px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all active:scale-95 ${!inputValue.trim() || isLoading
                  ? "bg-gray-100 dark:bg-slate-850 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-accent text-white shadow-md hover:scale-105 hover:opacity-90"
                }`}
              title="Gửi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
