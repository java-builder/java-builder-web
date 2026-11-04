"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Bot, Loader2, ArrowUp } from "lucide-react";
import { chatbotApi } from "@/services/chatbot.service";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface DocsAiAssistantProps {
  lessonId?: string;
  lessonName?: string;
  lessonDescription?: string;
  isInline?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function DocsAiAssistant({
  lessonId = "",
  lessonName = "",
}: DocsAiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const welcomeMessage = useMemo(() => {
    return {
      id: "welcome",
      role: "assistant" as const,
      content: `Chào bạn! Mình là **Trợ lý AI Học tập** của JavaBuilder.\n\nHôm nay bạn cần hỗ trợ gì về bài học **"${
        lessonName || "Tài liệu Java"
      }"**? Mình có thể giúp tóm tắt, giải thích code hoặc đưa ra ví dụ thực tế.`,
      timestamp: new Date(),
    };
  }, [lessonName]);

  useEffect(() => {
    setMessages([welcomeMessage]);
  }, [welcomeMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    setTimeout(() => chatInputRef.current?.focus(), 300);
  }, [messages, scrollToBottom]);

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
      const response = await chatbotApi.lessonChat({
        conversationId: lessonId,
        message: rawMessage,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          response.data ||
          "Xin lỗi, hệ thống AI chatbot đang bận. Vui lòng thử lại sau.",
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
        content:
          "Đã xảy ra lỗi kết nối với máy chủ AI. Vui lòng kiểm tra lại mạng hoặc thử lại sau.",
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

  const suggestionChips = useMemo(
    () => [
      {
        label: "Tóm tắt bài này",
        prompt:
          "Tóm tắt bài học này một cách ngắn gọn, súc tích và nêu các ý chính.",
      },
      {
        label: "Cho ví dụ thực tế",
        prompt:
          "Hãy cho tôi một ví dụ thực tế liên quan đến nội dung bài học này để tôi dễ hình dung.",
      },
      {
        label: "Đố trắc nghiệm nhanh",
        prompt:
          "Đặt cho tôi 1 câu hỏi trắc nghiệm kèm 4 lựa chọn (A, B, C, D) kiểm tra hiểu biết về bài học này. Khi tôi trả lời hãy giải thích đúng/sai.",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-transparent">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-background/60 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-primary-soft dark:bg-primary/15 flex items-center justify-center shrink-0 mt-1 border border-primary-soft-border">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-2xs text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-surface text-foreground rounded-tl-none border border-border"
              }`}
            >
              {msg.isTyping ? (
                <div className="flex items-center gap-1.5 py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-text-muted">
                    AI đang suy nghĩ...
                  </span>
                </div>
              ) : msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
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

      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-border bg-surface space-y-1.5 shrink-0">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Gợi ý nhanh
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-primary-soft hover:text-primary text-text-muted transition-all font-medium cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-surface border-t border-border">
        <div className="relative flex items-end border border-border rounded-2xl bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all p-2 pl-3.5">
          <textarea
            ref={chatInputRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi trợ lý về bài học này..."
            spellCheck="false"
            className="flex-1 max-h-28 min-h-[36px] py-1.5 border-0 bg-transparent focus:outline-none focus:ring-0 text-sm text-foreground placeholder-text-muted resize-none mr-12"
            style={{ height: "36px" }}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer ${
              !inputValue.trim() || isLoading
                ? "bg-transparent text-text-muted cursor-not-allowed"
                : "bg-primary text-white shadow-sm shadow-primary/25 hover:bg-primary-hover"
            }`}
            title="Gửi"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
